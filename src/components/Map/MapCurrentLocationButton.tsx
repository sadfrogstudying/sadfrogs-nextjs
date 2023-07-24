import { Button } from "../UI/Button";
import { useMapEvents } from "react-leaflet";

import {
  forwardRef,
  type Dispatch,
  type SetStateAction,
  type InputHTMLAttributes,
} from "react";
import type { LatLng } from "leaflet";

type ButtonProps = InputHTMLAttributes<HTMLButtonElement>;

interface Props extends ButtonProps {
  setUserCoords?: Dispatch<SetStateAction<LatLng | null>>;
}

const MapCurrentLocationButton = forwardRef<HTMLButtonElement, Props>(
  ({ setUserCoords, ...props }, ref) => {
    const map = useMapEvents({
      locationfound(e) {
        map.setView(e.latlng, 24);
        setUserCoords && setUserCoords(e.latlng);
      },
    });

    return (
      <Button
        ref={ref}
        className={props.className}
        onClick={() => map.locate()}
      >
        Current Location
      </Button>
    );
  }
);
MapCurrentLocationButton.displayName = "MapCurrentLocationButton";

export default MapCurrentLocationButton;
