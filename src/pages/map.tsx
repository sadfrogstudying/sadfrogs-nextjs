import Map from "~/components/Map";
import type { MarkerData } from "~/components/Map/Map";
import { api } from "~/utils/api";

const MapPage = () => {
  const { data } = api.studySpots.getNotValidated.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const markerData: MarkerData[] =
    data?.map((studySpot, i) => ({
      index: i,
      name: studySpot.name,
      address: studySpot.address,
      latlng: [studySpot.latitude, studySpot.longitude],
      image: studySpot.images[0],
      slug: studySpot.slug,
    })) || [];

  return <Map allMarkerData={markerData} className="h-screen" infoPanel />;
};

export default MapPage;
