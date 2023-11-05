/**
 * This page statically generates (pre-renders) a page for each study spot, but only the metadata for the <Head>.
 * There isn't any content.  The main content is loaded on the client side.
 *    - This is because the main content is dynamic and fresh data is important.
 *    - The metadata is static and can be pre-rendered, it'll be revalidated every 30 seconds.
 *    - The metadata is important for SEO and social media sharing.
 *
 * If you're navigating to this page and `getNotValidated` has run, we'll try to use the cached data to show the user something,
 * but we'll still fetch the data in the background to make sure it's fresh.
 *   - The user is likely to be navigating to this page from the homepage, where we've already fetched SOME of the data.
 *
 * getServersideProps is too slow for my liking!
 */

import InfoTable from "~/components/StudySpot/Info/Table";
import { api } from "~/utils/api";

import dynamic from "next/dynamic";
import FullWidthCarouselSkeleton from "~/components/StudySpot/Hero/FullWidthCarouselSkeleton";
import { Skeleton } from "~/components/UI/Skeleton";
import DangerousEditFormSheet from "~/components/StudySpot/Form/DangerousEditForm";
import Image from "~/components/UI/Image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "~/components/UI/Button";
import Head from "next/head";

import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
} from "next";
import superjson from "superjson";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

const FullWidthHeroCarousel = dynamic(
  () => import("~/components/StudySpot/Hero/FullWidthCarousel"),
  {
    loading: () => <FullWidthCarouselSkeleton />,
    ssr: false,
  }
);

export const getStaticPaths = (async () => {
  const spots = await prisma.studySpot.findMany({
    select: {
      slug: true,
    },
  });

  return {
    paths: spots.map((spot) => ({
      params: {
        slug: spot.slug,
      },
    })),

    /**
     * Here we're using ISR (Incremental Static Regeneration)
     *
     * We'll pre-render only these paths at build time.
     *
     * If a new spot is created and that path hasn't been pre-rendered, it
     * will be server-rendered on-demand due to { fallback: 'blocking' }.
     * Future requests will serve the static file from the cache.
     *
     */
    fallback: "blocking",
  };
}) satisfies GetStaticPaths;

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      ip: "",
    }),
    transformer: superjson,
  });

  const slug = context.params?.slug;

  // Allows the page to return a 404 status
  if (!slug) {
    return {
      notFound: true,
    };
  }

  // can use `prefetch` but that does not return the result and never throws - since we need that behavior, using `fetch` instead.
  const meta = await helpers.studySpots.metadataBySlug.fetch(slug);

  const getMetaDescription = () => {
    if (!meta) return "";

    const getText = () => {
      let string: string;

      if (meta.powerOutlets && !meta.wifi) {
        string = "Spot has power outlets; doesn't have wifi";
      } else if (!meta.powerOutlets && meta.wifi) {
        string = "Spot doesn't have power outlets; has wifi";
      } else {
        string = "Spot has power outlets; has wifi";
      }

      return string;
    };

    return `${meta.venueType} in ${meta.city}, ${meta.state}, ${
      meta.country
    }.  ${getText()}.${meta.description && `  ${meta.description}`}`;
  };

  const getMetaTitle = () => {
    if (!meta) return "";

    return `Sad Frogs - ${meta.name}`;
  };

  return {
    props: {
      trpcState: helpers.dehydrate(),
      metaDescription: getMetaDescription(),
      metaTitle: getMetaTitle(),
      slug,
    },
    revalidate: 30,
  };
}

const StudySpotPage = ({
  slug,
  metaTitle,
  metaDescription,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { user } = useUser();
  const { data, isError, isLoading } = api.studySpots.getOne.useQuery({
    slug,
  });

  const apiUtils = api.useContext();
  const cachedGetAllQuery = apiUtils.studySpots.getNotValidated.getInfiniteData(
    {}
  )?.pages;
  const cachedStudySpot = cachedGetAllQuery
    ?.flatMap((page) => page)
    .find((studySpot) => studySpot.slug === slug);

  const {
    name = cachedStudySpot?.name || "",
    images = cachedStudySpot?.images || [],
    address = cachedStudySpot?.address || "",
    author,
  } = data || {};

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full w-full">
        {isError ? (
          <div className="pt-12 h-full w-full flex justify-center items-center font-mono text-2xl">
            No Study Spot exists for this URL
          </div>
        ) : (
          <>
            <section className="flex flex-col-reverse pt-12 min-h-screen md:pt-0 mt-auto">
              <div className="w-full h-fit p-4 space-y-4">
                {name ? (
                  <>
                    <div className="flex gap-4">
                      <h1 className="text-3xl font-serif">{name}</h1>
                      {data && user && !isLoading ? (
                        <DangerousEditFormSheet studySpot={data} />
                      ) : (
                        <Button
                          variant="secondary"
                          disabled
                          className="font-mono"
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    <div className="flex justify-between flex-wrap items-center gap-x-6">
                      <div className="font-mono max-w-s">
                        {address
                          ? address
                          : "No address yet, submit one to help others find this spot!"}
                      </div>
                      {!isLoading ? (
                        <div
                          className={`${!author ? "cursor-not-allowed" : ""}`}
                        >
                          <Link
                            className={`font-mono flex items-center gap-2 active:text-red-500 ${
                              !author ? "pointer-events-none" : ""
                            }`}
                            href={`/user/${author?.username}`}
                          >
                            <span className="h-fit">
                              Found by {author?.username || "Anonymous"}
                            </span>
                            {author?.profilePicture && (
                              <div className="aspect-square overflow-hidden rounded-full w-8 h-8 object-cover border">
                                <Image
                                  alt={`Profile picture of ${author?.username}`}
                                  image={author?.profilePicture}
                                  className="w-full h-full object-cover"
                                  objectFit="cover"
                                />
                              </div>
                            )}
                          </Link>
                        </div>
                      ) : (
                        <div>
                          <div className="h-fit font-mono flex items-center gap-2">
                            Loading Author...
                            <Skeleton className="aspect-square overflow-hidden rounded-full w-8 h-8 object-cover border" />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-9 w-4/5 mt-2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </>
                )}
              </div>
              <div>
                <FullWidthHeroCarousel images={images} name={name} />
              </div>
            </section>
            {data && (
              <section className="pb-4 flex flex-col align-start items-start min-h-screen w-full">
                <InfoTable studySpot={data} />
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default StudySpotPage;
