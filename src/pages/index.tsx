import Head from "next/head";
import FinalMap from "~/components/FinalMap";
import StudySpotGrid from "~/components/StudySpot/Grid";
import { api } from "~/utils/api";
import type { MarkerData } from "~/components/FinalMap/FinalDynamicMap";

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
