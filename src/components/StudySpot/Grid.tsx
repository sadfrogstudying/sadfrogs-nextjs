import StudySpotGridItem from "~/components/StudySpot/GridItem";
import StatusHandler from "~/components/StatusHandler";

import { type InfiniteData } from "@tanstack/react-query";
import { type GetNotValidatedOutput } from "~/schemas/study-spots";

const StudySpotGrid = ({
  data,
  status,
}: {
  data: InfiniteData<GetNotValidatedOutput> | undefined;
  status: "error" | "loading" | "success";
}) => {
  return (
    <>
      <div className="grid gap-8 relative sm:grid-cols-2 lg:grid-cols-4 w-full">
        <StatusHandler status={status}>
          {data?.pages.map((page) =>
            page.map((studySpot) => (
              <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
            ))
          )}
        </StatusHandler>
      </div>
    </>
  );
};

export default StudySpotGrid;
