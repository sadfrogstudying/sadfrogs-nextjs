import { useEffect, useState } from "react";
import type { GetOneOutput } from "~/schemas/study-spots";
import { typeSafeObjectEntries } from "~/types/util-types";

const keysToIgnore = [
  "id",
  "createdAt",
  "updatedAt",
  "isValidated",
  "slug",
  "placeId",
  "latitude",
  "longitude",
  "images",
];

const InfoTable = ({ studySpot }: { studySpot: GetOneOutput }) => {
  const propertyEntries = typeSafeObjectEntries(studySpot);
  const propertyEntriesFiltered = propertyEntries.filter(
    ([key]) => !keysToIgnore.includes(key)
  );

  return (
    <div className="flex w-full pt-12">
      <div className="w-full border-t border-gray-200">
        {propertyEntriesFiltered.map(([label, value]) => {
          return <Row label={label} value={value} key={label} />;
        })}
      </div>
    </div>
  );
};

export default InfoTable;

const readableKeys: Record<keyof GetOneOutput, string> = {
  name: "Name",
  rating: "Rating",
  website: "Website",
  wifi: "Wifi",
  powerOutlets: "Power Outlets",
  noiseLevel: "Noise Level",
  venueType: "Venue Type",
  address: "Address",
  country: "Country",
  city: "City",
  state: "State",
  canStudyForLong: "Can Study For Long",
  comfort: "Comfort",
  views: "Views",
  sunlight: "Sunlight",
  temperature: "Temperature",
  music: "Music",
  lighting: "Lighting",
  distractions: "Distractions",
  crowdedness: "Crowdedness",
  proximityToAmenities: "Proximity To Amenities",
  drinks: "Drinks",
  food: "Food",
  studyBreakFacilities: "Study Break Facilities",
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  isValidated: "isValidated",
  slug: "slug",
  placeId: "placeId",
  latitude: "latitude",
  longitude: "longitude",
  images: "images",
};

const Row = ({
  label,
  value,
}: {
  label: keyof GetOneOutput;
  value: GetOneOutput[keyof GetOneOutput];
}) => {
  const shadesOfOj = [
    "bg-orange-50",
    "bg-orange-100",
    "bg-orange-200",
    "bg-orange-300",
    "bg-orange-400",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-700",
    "bg-orange-800",
    "bg-orange-900",
    "bg-orange-950",
  ];

  const getRandomInt = (max: number) => Math.floor(Math.random() * max);
  const [int, setInt] = useState(0);
  useEffect(() => {
    setInt(getRandomInt(shadesOfOj.length));
  }, [shadesOfOj.length]);
  const color = shadesOfOj[int] || "";
  const parseBoolean = (value: boolean) => {
    if (!!value) return "Yes";
    return "No";
  };

  if (value == null || value === "") return null;
  if (typeof value === "object") return null;

  return (
    <div className="flex border-b border-gray-200 w-full text-sm">
      <div className={`w-2 mr-2 ${color}`} />
      <div className="flex flex-wrap items-start justify-start py-1">
        <strong className="font-mono break-normal w-80">
          {readableKeys[label]}:{" "}
        </strong>{" "}
        <div className="font-mono break-normal w-96">
          {typeof value === "boolean" ? parseBoolean(value) : value?.toString()}
        </div>
      </div>
    </div>
  );
};
