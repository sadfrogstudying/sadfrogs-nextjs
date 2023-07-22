import Head from "next/head";
import FinalMap from "~/components/FinalMap";
import StudySpotGrid from "~/components/StudySpot/Grid";

export default function Home() {
  const markers: [number, number][] = [
    [38.907132, -77.036546],
    [48.2, 16.37],
    [48.1987, 16.3685],
  ];

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
        <FinalMap markers={markers} />
        <StudySpotGrid />
      </main>
    </>
  );
}
