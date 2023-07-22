import { ReactNode, useEffect } from "react";
import Leaflet, { MapOptions } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface Props extends MapOptions {
  className?: string;
  markers: [number, number][];
}

const FinalDynamicMap = ({ className, markers, ...rest }: Props) => {
  useEffect(() => {
    (async function init() {
      Leaflet.Icon.Default.mergeOptions({
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
        iconUrl: "leaflet/images/marker-icon.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
      });
    })();
  }, []);

  const DEFAULT_CENTER: [number, number] = [38.907132, -77.036546];

  return (
    <div
      className="w-full mb-4 rounded-md overflow-hidden border border-gray-200"
      style={{ height: `500px` }}
    >
      <MapContainer
        center={DEFAULT_CENTER}
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

        {markers.map((marker, index) => (
          <Marker key={index} position={marker}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default FinalDynamicMap;
