import { useMap } from "react-leaflet";
import MapCurrentLocationButton from "./MapCurrentLocationButton";
import { Button } from "../UI/Button";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

const MapControls = ({ className }: { className?: string }) => {
  const map = useMap();
  const panelRef = useRef<HTMLDivElement>(null);

  // Prevent user from dragging the map when clicking on the controls
  useEffect(() => {
    if (!panelRef.current) return;
    L.DomEvent.disableClickPropagation(panelRef.current);
  }, []);

  return (
    <div ref={panelRef} className={cn("flex gap-2 font-mono", className)}>
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
