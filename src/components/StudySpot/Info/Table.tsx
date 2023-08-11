import { useEffect, useState } from "react";
import type { GetOneOutput } from "~/schemas/study-spots";

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

const InfoTable = ({ studySpot }: { studySpot?: GetOneOutput }) => {
  const propertyEntries = Object.entries(studySpot || {});
  const propertyEntriesFiltered = propertyEntries.filter(
    ([key]) => !keysToIgnore.includes(key)
  );
  return (
    <div className="flex w-full pt-12">
      <div className="w-1/2 border-t border-gray-200">
        {propertyEntriesFiltered.map(([label, value]) => {
          if (value == null) return null;
          if (typeof value === "object") return null;

          return (
            <Row
              label={label.toString()}
              value={value}
              key={label.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};

export default InfoTable;

const readableKeys: Record<string, string> = {
  id: "Id",
  createdAt: "Created At",
  updatedAt: "Updated At",
  isValidated: "Is Validated",
  slug: "Slug",
  name: "Name",
  rating: "Rating",
  wifi: "Wifi",
  powerOutlets: "Power Outlets",
  noiseLevel: "Noise Level",
  venueType: "Venue Type",
  images: "Images",
  placeId: "Place Id",
  latitude: "Latitude",
  longitude: "Longitude",
  address: "Address",
  country: "Country",
  city: "City",
  state: "State",
  openingHours: "Opening Hours",
  canStudyForLong: "Can Study For Long",
  vibe: "Vibe",
  comfort: "Comfort",
  views: "Views",
  sunlight: "Sunlight",
  temperature: "Temperature",
  music: "Music",
  lighting: "Lighting",
  distractions: "Distractions",
  crowdedness: "Crowdedness",
  naturalSurroundings: "Natural Surroundings",
  proximityToAmenities: "Proximity To Amenities",
  drinks: "Drinks",
  food: "Food",
  studyBreakFacilities: "Study Break Facilities",
};

const Row = ({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | string[];
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

  return (
    <div className="flex border-b border-gray-200 w-full text-sm">
      <div className={`w-2 mr-2 ${color}`} />
      <div className="flex flex-wrap items-start justify-start py-1">
        <strong className="font-mono break-normal w-80">
          {readableKeys[label]}:{" "}
        </strong>{" "}
        <div className="font-mono break-normal w-96">
          {typeof value === "boolean" ? parseBoolean(value) : value}
        </div>
      </div>
    </div>
  );
};
