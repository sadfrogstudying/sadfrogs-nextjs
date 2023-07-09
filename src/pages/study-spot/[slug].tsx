import { Prisma } from "@prisma/client";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import HeroCarousel from "~/components/StudySpot/Hero/Carousel";
import HeroText from "~/components/StudySpot/Hero/Text";
import InfoTable from "~/components/StudySpot/Info/Table";

type StudySpotComplete = Prisma.StudySpotGetPayload<{
  include: {
    location: true;
    images: true;
  };
}>;

const StudySpotPage = ({ studySpot }: { studySpot: StudySpotComplete }) => {
  const {
    createdAt,
    hasWifi,
    id,
    isValidated,
    locationId,
    name,
    slug,
    updatedAt,
    images,
    location,
  } = studySpot;

  return (
    <main className="pb-4 h-full">
      <section className="p-4 pt-20 flex flex-wrap items-end min-h-screen">
        <HeroText studySpot={studySpot} />
        <HeroCarousel name={name} images={images} />
      </section>
      <section className="pb-4 flex flex-col justify-end align-start items-start min-h-screen w-full bg-gray-50">
        <InfoTable />
      </section>
    </main>
  );
};

export default StudySpotPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug = "" } = context.params!;

  const { data } = await axios.get<StudySpotComplete>(
    "http://localhost:3000/api/studyspots.getOne",
    {
      params: {
        slug: slug,
      },
    }
  );

  return {
    props: {
      studySpot: data,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get<string[]>(
    "http://localhost:3000/api/studyspots.getAllPaths"
  );

  return {
    paths: data.map((path) => {
      return { params: { slug: path } };
    }),
    fallback: false,
  };
};
