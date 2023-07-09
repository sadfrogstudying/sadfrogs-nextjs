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
    <>
      <div className="w-full h-fit p-4 space-y-4 md:w-96">
        <h1 className="text-3xl font-serif">{name}</h1>
        <p className="w-full">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
          excepturi assumenda quas dolorum similique, veniam doloremque earum
          sit voluptate quo vero nulla, mollitia adipisci facere explicabo
          recusandae repudiandae.
        </p>
      </div>
    </>
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
