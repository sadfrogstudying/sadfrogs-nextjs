import { useMap } from "react-leaflet";
import MapCurrentLocationButton from "./MapCurrentLocationButton";
import { Button } from "../UI/Button";

import { cn } from "~/lib/utils";

const MapControls = ({ className }: { className?: string }) => {
  const map = useMap();

  return (
    <div className={cn("flex gap-2 font-mono", className)}>
      <MapCurrentLocationButton className="h-8" />
      <Button className="h-8" onClick={() => map.zoomIn()}>
        +
      </Button>
      <Button className="h-8" onClick={() => map.zoomOut()}>
        -
      </Button>
    </div>
  );
};
export default MapControls;
