import Link from "next/link";
import MapControls from "./MapControls";
import type { MarkerData } from "./Map";
import Image from "../UI/Image";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { CopyIcon } from "lucide-react";

const MapInfoPanel = ({
  selectedMarker,
  clearSelectedMarker,
}: {
  selectedMarker: MarkerData | null;
  clearSelectedMarker: () => void;
}) => {
  const copyToClipboard = async (text: string) =>
    await navigator.clipboard.writeText(text);

  const panelRef = useRef<HTMLDivElement>(null);

  // Prevent user from dragging the map when clicking on the controls
  useEffect(() => {
    if (!panelRef.current) return;
    L.DomEvent.disableClickPropagation(panelRef.current);
  }, []);

  return (
    <div className="pointer-events-none absolute w-full flex justify-center bottom-8 md:top-4 md:bottom-auto md:left-4 md:w-fit">
      <div
        className="pointer-events-auto w-96 bg bg-white p-4 rounded-md font-mono space-y-6 mx-4 md:mx-0"
        ref={panelRef}
      >
        <h2 className="text-2xl font-serif tracking-tight md:text-4xl display">
          <Link style={{ color: `#000` }} href="/">
            Sad Frogs Studying
          </Link>
        </h2>

        <div className="space-y-4">
          <p>
            To go home, click{" "}
            <Link
              href="/"
              className="underline border border-gray-100 p-2 rounded-md bg-gray-50 font-bold hover:bg-gray-100 active:bg-gray-200"
            >
              here
            </Link>
          </p>
          {!selectedMarker ? (
            <p>
              Use this map to find study spots near you. Click on a marker to
              see more information about the study spot.
            </p>
          ) : (
            <div className="space-y-4 flex gap-4 items-end md:items-start md:flex-col">
              {selectedMarker.image && (
                <Image
                  image={selectedMarker.image}
                  alt={`Photo of ${selectedMarker.name}`}
                  className="w-1/2 md:w-full rounded overflow-hidden"
                />
              )}
              <div className="space-y-1 w-1/2 md:w-full">
                <Link
                  href={`/study-spot/${selectedMarker.slug}`}
                  className="hover:bg-gray-100 active:bg-gray-200 rounded-md w-full block"
                >
                  {selectedMarker.name}
                </Link>
                <p
                  onClick={() => void copyToClipboard(selectedMarker.address)}
                  className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 rounded-md"
                >
                  <CopyIcon
                    className="h-2 w-2 inline"
                    style={{ transform: `translateY(-2px)` }}
                  />{" "}
                  {selectedMarker.address}
                </p>
                <br />
                <p className="hidden md:block">
                  Some description could be shown here, and will be hidden on
                  mobile to keep compact
                </p>
              </div>
            </div>
          )}
        </div>

        <MapControls
          clearSelectedMarker={clearSelectedMarker}
          selectedMarker={!!selectedMarker}
        />
      </div>
    </div>
  );
};

export default MapInfoPanel;
