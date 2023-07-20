import { type StudySpot } from "@prisma/client";
import { Skeleton } from "~/components/UI/Skeleton";

const HeroText = ({ studySpot }: { studySpot?: StudySpot }) => {
  const { name, address } = studySpot || {};

  return (
    <>
      <div className="w-full h-fit p-4 space-y-4 md:w-96">
        {name ? (
          <>
            <h1 className="text-3xl font-serif">{name}</h1>
            <div className="italic font-mono">{address}</div>
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </>
        )}
        {/* {name ? (
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
        )} */}
      </div>
    </>
  );
};

export default HeroText;
