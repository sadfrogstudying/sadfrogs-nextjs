import { Button } from "../UI/Button";
import { useMapEvents } from "react-leaflet";

import type { Dispatch, SetStateAction } from "react";
import type { LatLng } from "leaflet";

const MapCurrentLocationButton = ({
  setUserCoords,
}: {
  setUserCoords?: Dispatch<SetStateAction<LatLng | null>>;
}) => {
  const map = useMapEvents({
    locationfound(e) {
      map.setView(e.latlng, 24);
      setUserCoords && setUserCoords(e.latlng);
    },
  });

  return (
    <Button
      className="absolute top-4 right-4 font-mono"
      onClick={() => {
        map.locate();
      }}
    >
      Current Location
    </Button>
  );
};

export default MapCurrentLocationButton;
