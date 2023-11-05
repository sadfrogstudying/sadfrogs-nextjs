import { createServerSideHelpers } from "@trpc/react-query/server";
import { type InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import superjson from "superjson";
import Map from "~/components/Map";
import { type MarkerData } from "~/components/Map/Map";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

const MapPage = ({
  data,
  refreshedAt,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [timeRefreshed, setTimeRefreshed] = useState(0);

  useEffect(() => {
    setTimeRefreshed(refreshedAt);
  }, [refreshedAt]);

  const markerData: MarkerData[] =
    data?.map((studySpot, i) => ({
      index: i,
      name: studySpot.name,
      address: studySpot.address,
      latlng: [studySpot.latitude, studySpot.longitude],
      image: studySpot.images[0],
      slug: studySpot.slug,
    })) || [];

  return (
    <>
      <Head>
        <title>Sad Frogs - Map</title>
        <meta
          name="description"
          content="Interactive map to find study spots"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map
        allMarkerData={markerData}
        className="h-screen"
        infoPanel
        timeRefreshed={timeRefreshed}
      />
    </>
  );
};

export default MapPage;

export const getStaticProps = async () => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      ip: "",
    }),
    transformer: superjson,
  });

  const data = await helpers.studySpots.getNotValidatedForMap.fetch();
  /** unix timestamp in ms */
  const refreshedAt = Date.now();

  return {
    props: {
      data,
      refreshedAt,
    },
    revalidate: 60, // In seconds
  };
};
