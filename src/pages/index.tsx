import Head from "next/head";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
import { type InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";

const HomeHero = dynamic(() => import("~/components/HomeHero"), {
  loading: () => <div></div>,
});
const GridAndList = dynamic(
  () => import("~/components/StudySpot/GridAndList"),
  { loading: () => <div></div> }
);

export default function Home({
  studyspotsForHero,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Sad Frogs</title>
        <meta
          name="description"
          content="A place where Sad Frogs find places to study"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-4 font-mono">
        <HomeHero studySpots={studyspotsForHero} />
        <section className="px-8 md:px-8">
          <GridAndList />
        </section>
      </main>
    </>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps = async () => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      ip: "",
    }),
    transformer: superjson,
  });

  const studyspotsForHero = await helpers.studySpots.getHeroImages.fetch();

  return {
    props: {
      studyspotsForHero,
    },
    revalidate: 60, // In seconds
  };
};
