import { useEffect, useState } from "react";

import L from "leaflet";
import type { LatLng, MapOptions } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

import { cn } from "~/lib/utils";
import MapInfoPanel from "./MapInfoPanel";
import type { Image } from "~/schemas/study-spots";

export type MarkerData = {
  index: number;
  name: string;
  address: string;
  latlng: [number, number];
  image?: Image;
  slug: string;
};

interface BaseProps extends MapOptions {
  className?: string;
  allMarkerData: MarkerData[];
}

interface Props extends BaseProps {
  infoPanel?: false;
  timeRefreshed: never;
}
interface PropsWithInfoPanel extends BaseProps {
  infoPanel: true;
  timeRefreshed: number;
}

const FinalDynamicMap = ({
  className,
  infoPanel = false,
  allMarkerData,
  timeRefreshed,
  ...props
}: Props | PropsWithInfoPanel) => {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [userCoords, setUserCoords] = useState<LatLng | null>(null);

  useEffect(() => {
    // (function init() {
    //   Icon.Default.mergeOptions({
    //     iconSize: [24, 24],
    //     iconAnchor: [12, 12],
    //     iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
    //     iconUrl: "leaflet/images/marker-icon.png",
    //     shadowUrl: "leaflet/images/marker-shadow.png",
    //   });
    // })();
  }, []);

  const clearSelectedMarker = () => setSelectedMarker(null);

  const defaultIcon = new L.Icon({
    iconSize: [32, 32],
    iconAnchor: [12, 12],
    iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
    iconUrl: "leaflet/images/marker-icon.png",
    shadowUrl: "leaflet/images/marker-shadow.png",
  });

  const selectedIcon = new L.Icon({
    iconSize: [32, 32],
    iconAnchor: [12, 12],
    iconRetinaUrl: "leaflet/images/selected-marker-icon-2x.png",
    iconUrl: "leaflet/images/selected-marker-icon.png",
    shadowUrl: "leaflet/images/marker-shadow.png",
  });

  const userIcon = new L.Icon({
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    iconRetinaUrl: "leaflet/images/user-marker-icon-2x.png",
    iconUrl: "leaflet/images/user-marker-icon.png",
    shadowUrl: "leaflet/images/marker-shadow.png",
  });

  return (
    <div
      className={cn(
        "w-full h-[30rem] mb-4 rounded-md overflow-hidden relative",
        className
      )}
    >
      <MapContainer
        center={[-33.8721876, 151.2058977]}
        zoom={24}
        className="h-full w-full"
        zoomControl={false}
        {...props}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {infoPanel && (
          <MapInfoPanel
            selectedMarker={selectedMarker}
            timeRefreshed={timeRefreshed}
            clearSelectedMarker={clearSelectedMarker}
            setUserCoords={(latLng) => setUserCoords(latLng)}
          />
        )}

        {userCoords && (
          <Marker
            position={userCoords}
            icon={userIcon}
            alt="Your location"
            eventHandlers={{
              click: () => {
                setSelectedMarker(null);
              },
              keypress: () => {
                setSelectedMarker(null);
              },
            }}
          />
        )}

        <MarkerClusterGroup chunkedLoading>
          {allMarkerData.map((marker, index) => (
            <Marker
              key={index}
              position={marker.latlng}
              autoPan
              icon={
                index === selectedMarker?.index ? selectedIcon : defaultIcon
              }
              alt={`Location of ${marker.name}`}
              eventHandlers={{
                click: () => {
                  setSelectedMarker(marker);
                },
                keypress: () => {
                  setSelectedMarker(marker);
                },
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default FinalDynamicMap;
