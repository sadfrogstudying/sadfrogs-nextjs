import { StudySpot } from "@prisma/client";
import { useEffect, useState } from "react";

const InfoTable = ({ studySpot }: { studySpot?: StudySpot }) => {
  const propertyEntries = Object.entries(studySpot || {});
  return (
    <div className="flex w-full pt-12">
      <div className="w-full w-1/2 border-t border-gray-200">
        {propertyEntries.map(([label, value]) => {
          return (
            <Row
              label={label.toString()}
              value={value.toString()}
              key={label.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};

export default InfoTable;

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

  return (
    <div className="flex border-b border-gray-200 w-full text-sm">
      <div className={`w-2 mr-2 ${color}`} />
      <div className="flex flex-wrap items-start justify-start py-1">
        <strong className="font-mono break-normal w-80">{label}: </strong>{" "}
        <div className="font-mono break-normal w-96">
          {typeof value === "boolean" ? value.toString() : value}
        </div>
      </div>
    </div>
  );
};

// const dummyStudySpot = [
//   { label: "Rating", name: "rating", value: 4.5 },
//   { label: "Can study for long", name: "canStudyForLong", value: true },
//   { label: "Views", name: "views", value: "City skyline" },
//   { label: "Interior", name: "interior", value: "Modern and minimalist" },
//   { label: "Temperature", name: "temperature", value: "Comfortably cool" },
//   { label: "Hours", name: "hours", value: "9 AM - 10 PM" },
//   {
//     label: "Comfort",
//     name: "comfort",
//     value: "Ergonomic chairs and adjustable desks",
//   },
//   { label: "Rating New", name: "noiseLevel", value: "Quiet" },
//   { label: "Noise Level", name: "lighting", value: "Bright and adjustable" },
//   {
//     label: "Lighting",
//     name: "seatingOptions",
//     value: ["Desks", "Chairs", "Sofas"],
//   },
//   { label: "Seating Options", name: "wifiAvailability", value: true },
//   { label: "Wi-Fi Availability", name: "powerOutlets", value: true },
//   { label: "Power Outlets", name: "refreshments", value: true },
//   {
//     label: "Refreshments",
//     name: "studyResources",
//     value: "Wide range of books and online databases",
//   },
//   { label: "Study Resources", name: "distractions", value: "Minimal" },
//   { label: "Distractions", name: "accessibility", value: true },
//   {
//     label: "Accessibility",
//     name: "privacy",
//     value: "Private study rooms available",
//   },
//   { label: "Privacy", name: "crowdedness", value: "Moderately crowded" },
//   {
//     label: "Crowdedness",
//     name: "security",
//     value: "24/7 surveillance and access control",
//   },
//   { label: "Security", name: "environment", value: "Relaxed and cozy" },
//   {
//     label: "Environment",
//     name: "proximityToAmenities",
//     value: "Walking distance to cafes and restaurants",
//   },
//   { label: "Proximity to Amenities", name: "studyRooms", value: true },
//   { label: "Study Rooms", name: "groupStudyFacilities", value: true },
//   {
//     label: "Group Study Facilities",
//     name: "whiteboardOrChalkboard",
//     value: true,
//   },
//   {
//     label: "Whiteboard or Chalkboard",
//     name: "naturalSurroundings",
//     value: "Adjacent to a beautiful park",
//   },
//   { label: "Natural Surroundings", name: "silentZones", value: true },
//   {
//     label: "Silent Zones",
//     name: "studyProgramsOrCourses",
//     value: "Offers specialized study courses",
//   },
//   {
//     label: "Study Programs or Courses",
//     name: "musicPolicy",
//     value: "Soft background music allowed",
//   },
//   { label: "Music Policy", name: "studyEventsOrMeetups", value: true },
//   {
//     label: "Study Events or Meetups",
//     name: "accessibilityToFood",
//     value: "On-site cafe with a variety of food options",
//   },
//   {
//     label: "Accessibility to Food",
//     name: "studyBreakFacilities",
//     value: "Recreation room with games and relaxation area",
//   },
//   {
//     label: "Study Break Facilities",
//     name: "studySupportServices",
//     value: true,
//   },
//   {
//     label: "Study Support Services",
//     name: "studyMaterialsForRent",
//     value: true,
//   },
// ];
