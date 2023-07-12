import { type Prisma } from "@prisma/client";
import { Skeleton } from "~/components/UI/Skeleton";

type StudySpotExtended = Prisma.StudySpotGetPayload<{
  include: {
    location: true;
  };
}>;

const HeroText = ({ studySpot }: { studySpot?: StudySpotExtended }) => {
  const {
    // createdAt,
    // hasWifi,
    // id,
    // isValidated,
    // locationId,
    name,
    // slug,
    // updatedAt,
    // location,
  } = studySpot || {};

  return (
    <>
      <div className="w-full h-fit p-4 space-y-4 md:w-96">
        {name ? (
          <h1 className="text-3xl font-serif">{name}</h1>
        ) : (
          <Skeleton className="h-8 w-4/5" />
        )}
        {name ? (
          <p className="w-full">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
            excepturi assumenda quas dolorum similique, veniam doloremque earum
            sit voluptate quo vero nulla, mollitia adipisci facere explicabo
            recusandae repudiandae.
          </p>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        )}
      </div>
    </>
  );
};

export default HeroText;
