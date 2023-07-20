import { api } from "~/utils/api";
import StudySpotGridItem from "~/components/StudySpot/GridItem";
import StatusHandler from "../StatusHandler";

const StudySpotGrid = () => {
  const { data, status } = api.studySpots.getNotValidated.useQuery();

  return (
    // <div className="flex column">
    <div className="grid gap-8 relative grid-cols-fill-40">
      <StatusHandler status={status}>
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
      </StatusHandler>
    </div>
  );
};

export default StudySpotGrid;
