import { useMapEvents } from "react-leaflet";
import { Button } from "../UI/Button";

import { cn } from "~/lib/utils";
import type { LatLng } from "leaflet";

const MapControls = ({
  className,
  clearSelectedMarker,
  selectedMarker,
  setUserCoords,
}: {
  className?: string;
  clearSelectedMarker: () => void;
  selectedMarker: boolean;
  setUserCoords: (latlng: LatLng) => void;
}) => {
  const map = useMapEvents({
    locationfound(e) {
      map.setView(e.latlng, 24);
      setUserCoords && setUserCoords(e.latlng);
    },
  });

  return (
    <div className={cn("flex gap-2 font-mono", className)}>
      <Button className="h-8" onClick={() => map.locate()}>
        Current Location
      </Button>
      <Button className="h-8" onClick={() => map.zoomIn()}>
        +
      </Button>
      <Button className="h-8" onClick={() => map.zoomOut()}>
        -
      </Button>
      <Button
        className="h-8"
        variant="destructive"
        onClick={clearSelectedMarker}
        disabled={!selectedMarker}
      >
        Clear
      </Button>
    </div>
  );
};
export default MapControls;
