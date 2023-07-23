import Head from "next/head";
import FinalMap from "~/components/FinalMap";
import StudySpotGrid from "~/components/StudySpot/Grid";
import { api } from "~/utils/api";

export default function Home() {
  const { data, status } = api.studySpots.getNotValidated.useQuery();

  const newMarkers: [number, number][] =
    data?.map((studySpot) => [studySpot.latitude, studySpot.longitude]) || [];

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
        <FinalMap markers={newMarkers} />
        <StudySpotGrid studySpots={data} status={status} />
      </main>
    </>
  );
}
