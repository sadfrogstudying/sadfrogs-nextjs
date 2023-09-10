import { useMapEvents } from "react-leaflet";
import { Button } from "../UI/Button";

import { cn } from "~/lib/utils";
import type { LatLng } from "leaflet";
import { useState } from "react";
import { InfoIcon } from "lucide-react";

type State = {
  status: "initial" | "loading" | "success" | "error";
};

const MapControls = ({
  className,
  clearSelectedMarker,
  selectedMarker,
  setUserCoords,
  userCoords,
}: {
  className?: string;
  clearSelectedMarker: () => void;
  selectedMarker: boolean;
  setUserCoords: (latlng: LatLng) => void;
  userCoords: LatLng | null;
}) => {
  const [coords, setUserCoordsStatus] = useState<State>({
    status: "initial",
  });

  const map = useMapEvents({
    locationfound(e) {
      map.setView(e.latlng, 24);
      setUserCoords && setUserCoords(e.latlng);
      setUserCoordsStatus({ status: "success" });
    },
    locationerror() {
      setUserCoordsStatus({ status: "error" });
    },
  });

  return (
    <>
      {coords.status === "error" && (
        <p className="text-red-500">
          Grr.. you must allow location access to get your current location. If
          you&apos;re using Chrome, click the{" "}
          <InfoIcon
            className="inline h-4 w-4"
            aria-describedby="View site information icon"
          />{" "}
          next to the address bar and click &quot;reset permission&quot;, then
          reload.
        </p>
      )}
      <div className={cn("flex gap-2 font-mono", className)}>
        <Button
          className="h-8"
          onClick={() => {
            map.locate();

            !userCoords &&
              coords.status === "initial" &&
              setUserCoordsStatus({ status: "loading" });
          }}
          disabled={coords.status === "loading"}
        >
          {coords.status === "loading" ? "Loading" : "Current Location"}
        </Button>
        <Button className="h-8" onClick={() => map.zoomIn()}>
          +
        </Button>
        <Button className="h-8" onClick={() => map.zoomOut()}>
          -
        </Button>
        {selectedMarker && (
          <Button
            className="h-8"
            variant="destructive"
            onClick={clearSelectedMarker}
          >
            Clear
          </Button>
        )}
      </div>
    </>
  );
};
export default MapControls;
