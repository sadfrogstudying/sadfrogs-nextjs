import { type GetNotValidatedOutput } from "~/schemas/study-spots";
import Image from "./UI/Image";

interface Props {
  studySpots: GetNotValidatedOutput;
}

export default function HomeHero({ studySpots }: Props) {
  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="flex flex-wrap">
        {studySpots &&
          studySpots.map((studySpot) => {
            return (
              <div key={studySpot.id} className="w-1/2 md:w-1/4">
                {studySpot.images[0] && (
                  <Image
                    image={studySpot.images[0]}
                    alt={`Image of ${studySpot.name}`}
                    priority={true}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
