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
    <div className="w-1/3 min-w-max p-4 space-y-4">
      <h1 className="text-xl font-bold">{name}</h1>
      <p className="w-96">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
        excepturi assumenda quas dolorum similique, veniam doloremque earum sit
        voluptate quo vero nulla, mollitia adipisci facere explicabo recusandae
        repudiandae.
      </p>
      {/* <div>
        {studySpotMapped.map((item) => {
          return <Row label={item[0]} value={item[1]} key={item[0]} />;
        })}
      </div> */}
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
