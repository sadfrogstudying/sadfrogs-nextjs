import { useEffect, useState } from "react";

import { Icon } from "leaflet";
import type { MapOptions } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

import { cn } from "~/lib/utils";

interface Props extends MapOptions {
  className?: string;
  markers: [number, number][];
}

const FinalDynamicMap = ({ className, markers, ...rest }: Props) => {
  useEffect(() => {
    (function init() {
      Icon.Default.mergeOptions({
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
        iconUrl: "leaflet/images/marker-icon.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
      });
    })();
  }, []);

  return (
    <div
      className={cn(
        "w-full h-96 mb-4 rounded-md overflow-hidden border border-gray-200",
        className
      )}
    >
      <MapContainer
        center={[-33.8721876, 151.2058977]}
        zoom={24}
        scrollWheelZoom={false}
        className="h-full w-full relative"
        {...rest}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomleft" zoomInText="🧐" zoomOutText="🗺️" />

        <MarkerClusterGroup chunkedLoading>
          {markers.map((marker, index) => (
            <Marker key={index} position={marker}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default FinalDynamicMap;
