import InfoTable from "~/components/StudySpot/Info/Table";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import FullWidthCarouselSkeleton from "~/components/StudySpot/Hero/FullWidthCarouselSkeleton";
import { Skeleton } from "~/components/UI/Skeleton";
import EditFormSheet from "~/components/StudySpot/Form/EditForm";

const FullWidthHeroCarousel = dynamic(
  () => import("~/components/StudySpot/Hero/FullWidthCarousel"),
  {
    loading: () => <FullWidthCarouselSkeleton />,
    ssr: false,
  }
);

const StudySpotPage = () => {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";

  const studySpot = api.studySpots.getOne.useQuery(
    {
      slug,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!slug,
      retry(failureCount, error) {
        if (error.data?.code === "NOT_FOUND") return false;
        return failureCount < 2;
      },
    }
  );

  const { name = "", images = [], address = "" } = studySpot.data || {};

  return (
    <main className="h-full w-full">
      {studySpot.isError ? (
        <div className="pt-12 h-full w-full flex justify-center items-center font-mono text-2xl">
          No Study Spot exists for this URL
        </div>
      ) : (
        <>
          <section className="flex flex-col-reverse pt-12 min-h-screen md:pt-0 mt-auto">
            <div className="w-full h-fit p-4 space-y-4 md:w-96">
              {name ? (
                <>
                  <div className="flex gap-4">
                    <h1 className="text-3xl font-serif">{name}</h1>
                    {studySpot.data && (
                      <EditFormSheet studySpot={studySpot.data} />
                    )}
                  </div>
                  <div className="italic font-mono">
                    {address
                      ? address
                      : "No address yet, submit one to help others find this spot!"}
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
          <section className="pb-4 flex flex-col justify-end align-start items-start min-h-screen w-full">
            <InfoTable studySpot={studySpot.data} />
          </section>
        </>
      )}
    </main>
  );
};

export default StudySpotPage;
