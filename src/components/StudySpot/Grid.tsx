import { api } from "~/utils/api";
import StudySpotGridItem from "~/components/StudySpot/GridItem";
import styled from "@emotion/styled";
import StatusHandler from "../StatusHandler";

const StudySpotGrid = () => {
  const { data, status, failureReason, fetchStatus } =
    api.studySpots.getNotValidated.useQuery();

  return (
    <Grid>
      <StatusHandler status={status} fetchStatus={fetchStatus}>
        {data?.map((studySpot) => (
          <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
        ))}
      </StatusHandler>
    </Grid>
  );
};

export default StudySpotGrid;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  position: relative;
`;
