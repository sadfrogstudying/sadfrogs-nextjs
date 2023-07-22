import FinalMap from "~/components/FinalMap";

const MapPage = () => {
  const markers: [number, number][] = [
    [38.907132, -77.036546],
    [48.2, 16.37],
    [48.1987, 16.3685],
  ];

  return <FinalMap markers={markers} />;
};

export default MapPage;
