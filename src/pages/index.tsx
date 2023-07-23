import Head from "next/head";
import { api } from "~/utils/api";

import StudySpotGrid from "~/components/StudySpot/Grid";
import FinalMap from "~/components/Map";

import type { MarkerData } from "~/components/Map/Map";

export default function Home() {
  const { data, status } = api.studySpots.getNotValidated.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const markerData: MarkerData =
    data?.map((studySpot) => ({
      name: studySpot.name,
      address: studySpot.address,
      latlng: [studySpot.latitude, studySpot.longitude],
      image: studySpot.images[0],
      slug: studySpot.slug,
    })) || [];

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
      <main className="p-4 pt-20">
        <FinalMap markerData={markerData} />
        <StudySpotGrid studySpots={data} status={status} />
      </main>
    </>
  );
}
