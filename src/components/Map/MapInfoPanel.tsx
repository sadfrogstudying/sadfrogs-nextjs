import Link from "next/link";
import MapControls from "./MapControls";
import type { MarkerData } from "./Map";
import Image from "../UI/Image";
import { Button } from "../UI/Button";

const MapInfoPanel = ({
  selectedMarker,
  clearSelectedMarker,
}: {
  selectedMarker: MarkerData | null;
  clearSelectedMarker: () => void;
}) => {
  return (
    <div className="absolute w-80 bg top-4 left-4 bg-white p-4 rounded-md font-mono space-y-6">
      <h2 className="text-2xl font-serif tracking-tight md:text-4xl">
        Sad Frogs Locator
      </h2>

      <div className="space-y-4">
        {!selectedMarker ? (
          <p>
            Use this map to find study spots near you. Click on a marker to see
            more information about the study spot.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <Link href={`/study-spot/${selectedMarker.slug}`}>
                {selectedMarker.name}
              </Link>
              <p>{selectedMarker.address}</p>
              <p>lat: {selectedMarker.latlng[0]}</p>
              <p>lng: {selectedMarker.latlng[1]}</p>
            </div>
            {selectedMarker.image && (
              <Image
                image={selectedMarker.image}
                alt={`Photo of ${selectedMarker.name}`}
                className="w-40 rounded overflow-hidden"
              />
            )}
          </div>
        )}
        <p>
          For a larger map, click{" "}
          <Link
            href="/map"
            className="underline border border-gray-100 p-2 rounded-md bg-gray-50 font-bold hover:bg-gray-100 active:bg-gray-200"
          >
            here
          </Link>
        </p>

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

      <MapControls />
    </div>
  );
};

export default MapInfoPanel;
