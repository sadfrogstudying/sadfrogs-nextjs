import Head from "next/head";
import StudySpotGrid from "~/components/StudySpot/Grid";

export default function Home() {
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
        <StudySpotGrid />
      </main>
    </>
  );
}
