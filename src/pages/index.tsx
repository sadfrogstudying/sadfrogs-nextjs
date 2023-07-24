import Head from "next/head";
import { api } from "~/utils/api";

import StudySpotGrid from "~/components/StudySpot/Grid";

export default function Home() {
  const { data, status } = api.studySpots.getNotValidated.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

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
      <main className="p-4 pt-24">
        <StudySpotGrid studySpots={data} status={status} />
      </main>
    </>
  );
}
