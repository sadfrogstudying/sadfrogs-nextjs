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
      <main style={{ padding: `6rem 1rem 1rem 1rem` }}>
        <StudySpotGrid />
      </main>
    </>
  );
}
