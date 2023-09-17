import Link from "next/link";
import MapControls from "./MapControls";
import type { MarkerData } from "./Map";
import Image from "../UI/Image";
import { useEffect, useRef } from "react";
import L, { type LatLng } from "leaflet";
import { CopyIcon } from "lucide-react";

const MapInfoPanel = ({
  selectedMarker,
  clearSelectedMarker,
  setUserCoords,
  userCoords,
  timeRefreshed,
}: {
  selectedMarker: MarkerData | null;
  clearSelectedMarker: () => void;
  setUserCoords: (latlng: L.LatLng) => void;
  userCoords: LatLng | null;
  timeRefreshed: number;
}) => {
  const copyToClipboard = async (text: string) =>
    await navigator.clipboard.writeText(text);

  const panelRef = useRef<HTMLDivElement>(null);

  // Prevent user from dragging the map when clicking on the controls
  useEffect(() => {
    if (!panelRef.current) return;
    L.DomEvent.disableClickPropagation(panelRef.current);
  }, []);

  const localeTimeString = new Date(timeRefreshed).toLocaleTimeString(
    undefined,
    {
      hour12: true,
      timeStyle: "medium",
    }
  );
  return (
    <div className="pointer-events-none fixed w-full flex justify-center bottom-8 md:top-4 md:bottom-auto md:left-4 md:w-fit cursor-default">
      <div
        className="pointer-events-auto max-w-md w-full bg bg-white p-4 rounded-md font-mono mx-4 md:mx-0 flex flex-col gap-6"
        ref={panelRef}
      >
        <h2 className="text-2xl font-serif tracking-tight md:text-4xl hidden md:block">
          <Link style={{ color: `#000` }} href="/">
            Sad Frogs Studying
          </Link>
        </h2>

        <div className="md:space-y-4">
          {!selectedMarker ? (
            <div>
              <p>
                Map data will be refreshed with latest data once every minute.
              </p>
              <br />
              <p>
                Last updated <strong>{localeTimeString}</strong>
              </p>
            </div>
          ) : (
            <div className="md:space-y-4 flex gap-4 items-center md:items-start md:flex-col">
              <div className="h-40 md:h-auto md:w-4/5">
                {selectedMarker.image && (
                  <Image
                    image={selectedMarker.image}
                    alt={`Photo of ${selectedMarker.name}`}
                    className="rounded overflow-hidden"
                    sizes="(max-width: 500px) 25vw, (max-width: 767px) 16vw, (max-width: 1500px) 20vw, 16vw"
                  />
                )}
              </div>
              <div className="space-y-1 w-1/2 md:w-full text-sm md:text-xs">
                <Link
                  href={`/study-spot/${selectedMarker.slug}`}
                  className="hover:bg-gray-100 active:bg-gray-200 rounded-md w-full block text-base md:text-xs font-bold"
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
          setUserCoords={setUserCoords}
          userCoords={userCoords}
        />
      </div>
    </div>
  );
};

export default MapInfoPanel;
