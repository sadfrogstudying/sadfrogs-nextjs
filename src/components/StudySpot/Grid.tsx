import StudySpotGridItem from "~/components/StudySpot/GridItem";
import StatusHandler from "../StatusHandler";

import type { QueryStatus } from "@tanstack/react-query";
import type { GetNotValidatedOutput } from "~/types/RouterOutputTypes";

const StudySpotGrid = ({
  studySpots,
  status,
}: {
  studySpots?: GetNotValidatedOutput;
  status: QueryStatus;
}) => {
  return (
    <div className="grid gap-8 relative grid-cols-fill-40">
      <StatusHandler status={status}>
        {studySpots?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
      </StatusHandler>
    </div>
  );
};

export default StudySpotGrid;
