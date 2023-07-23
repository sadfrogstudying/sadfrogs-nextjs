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
import Link from "next/link";
import type { Image as ImageType } from "@prisma/client";
import Image from "../UI/Image";
import MapInfoPanel from "./MapInfoPanel";
import MapCurrentLocationButton from "./MapCurrentLocationButton";

export type MarkerData = {
  name: string;
  address: string;
  latlng: [number, number];
  image?: ImageType;
  slug: string;
}[];

interface Props extends MapOptions {
  className?: string;
  markerData: MarkerData;
}

const FinalDynamicMap = ({ className, markerData, ...rest }: Props) => {
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
        zoomControl={false}
        {...rest}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapInfoPanel />

        <ZoomControl position="bottomleft" zoomInText="+" zoomOutText="-" />

        <MapCurrentLocationButton />

        <MarkerClusterGroup chunkedLoading>
          {markerData.map((marker, index) => (
            <Marker key={index} position={marker.latlng} autoPan>
              <Popup>
                <div className="flex flex-col space-y-4">
                  <div>
                    <div className="font-semibold">{marker.name}</div>
                    <div className="text-sm">{marker.address}</div>
                    <Link href={`/study-spot/${marker.slug}`}></Link>
                  </div>
                  {marker.image && (
                    <Image
                      image={marker.image}
                      alt={`Photo of ${marker.name}`}
                      className="w-40 rounded overflow-hidden"
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default FinalDynamicMap;
