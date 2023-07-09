import { Prisma } from "@prisma/client";

type StudySpotExtended = Prisma.StudySpotGetPayload<{
  include: {
    location: true;
  };
}>;

const HeroText = ({ studySpot }: { studySpot: StudySpotExtended }) => {
  const {
    createdAt,
    hasWifi,
    id,
    isValidated,
    locationId,
    name,
    slug,
    updatedAt,
    location,
  } = studySpot;

  const studySpotMapped = Object.entries({
    hasWifi: hasWifi,
    id,
    isValidated: isValidated,
    slug,
  });

  return (
    <div className="w-1/3 min-w-max">
      <h1 className="text-xl font-bold">{name}</h1>
      <h2 className="mb-4">Individual page for {name}</h2>

      <div>
        {studySpotMapped.map((item) => {
          return <Row label={item[0]} value={item[1]} key={item[0]} />;
        })}
      </div>
    </div>
  );
};

export default HeroText;

const Row = ({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | string[];
}) => {
  return (
    <div className="flex">
      <strong className="w-64">{label}: </strong>{" "}
      <div className="w-64">
        {typeof value === "boolean" ? value.toString() : value}
      </div>
    </div>
  );
};
