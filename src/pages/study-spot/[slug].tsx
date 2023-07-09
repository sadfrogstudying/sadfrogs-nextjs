import VerticalCarousel from "~/components/StudySpot/Hero/VerticalCarousel";
import HeroText from "~/components/StudySpot/Hero/Text";
import InfoTable from "~/components/StudySpot/Info/Table";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

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

  const {
    createdAt,
    hasWifi,
    id,
    isValidated,
    locationId,
    name = "",
    updatedAt,
    images = [],
    location,
  } = studySpot.data || {};

  return (
    <main className="pb-4 h-fit">
      <section className="pt-12 flex flex-wrap items-end min-h-screen md:pt-0">
        <>
          <HeroText studySpot={studySpot.data} />
          <VerticalCarousel name={name} images={images} />
        </>
      </section>
      <section className="pb-4 flex flex-col justify-end align-start items-start min-h-screen w-full">
        <InfoTable />
      </section>
    </main>
  );
};

export default StudySpotPage;
