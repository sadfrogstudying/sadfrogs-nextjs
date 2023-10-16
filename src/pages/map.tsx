import { type GetStaticProps } from "next";
import { useEffect, useState } from "react";
import Map from "~/components/Map";
import { type MarkerData } from "~/components/Map/Map";
import { env } from "~/env.mjs";
import { type GetNotValidatedForMapOutput } from "~/schemas/study-spots";

interface Props {
  data: GetNotValidatedForMapOutput;
  /** unix timestamp in milliseconds */
  refreshedAt: number;
}

const MapPage = ({ data, refreshedAt }: Props) => {
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
    <Map
      allMarkerData={markerData}
      className="h-screen absolute top-0"
      infoPanel
      timeRefreshed={timeRefreshed}
    />
  );
};

export default MapPage;

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps<Props> = async () => {
  const siteUrl =
    env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://sadfrogs-nextjs.vercel.app";
  const res = await fetch(`${siteUrl}/api/studyspots.getNotValidatedForMap`);
  const data = (await res.json()) as GetNotValidatedForMapOutput;
  const refreshedAt = Date.now();

  return {
    props: {
      data,
      refreshedAt,
    },
    revalidate: 60, // In seconds
  };
};
