import { api } from "~/utils/api";
import StudySpotGridItem from "~/components/StudySpot/GridItem";
import StatusHandler from "../StatusHandler";

const StudySpotGrid = () => {
  const { data, status, fetchStatus } =
    api.studySpots.getNotValidated.useQuery();

  return (
    <div className="grid gap-4 relative grid-cols-fill-40">
      <StatusHandler status={status} fetchStatus={fetchStatus}>
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
      </StatusHandler>
    </div>
  );
};

export default StudySpotGrid;
