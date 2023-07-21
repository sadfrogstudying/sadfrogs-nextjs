import HeroText from "~/components/StudySpot/Hero/Text";
import InfoTable from "~/components/StudySpot/Info/Table";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import FullWidthCarouselSkeleton from "~/components/StudySpot/Hero/FullWidthCarouselSkeleton";

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
      enabled: !!slug,
    }
  );

  const { name = "", images = [] } = studySpot.data || {};

  return (
    <main className="pb-4 h-fit">
      <section className="flex-col-reverse pt-12 min-h-screen md:pt-0 mt-auto flex flex-col">
        <HeroText studySpot={studySpot.data} />
        <div>
          <FullWidthHeroCarousel images={images} name={name} />
        </div>
      </section>
      <section className="pb-4 flex flex-col justify-end align-start items-start min-h-screen w-full">
        <InfoTable studySpot={studySpot.data} />
      </section>
    </main>
  );
};

export default StudySpotPage;
