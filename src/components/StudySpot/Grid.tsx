import StudySpotGridItem from "~/components/StudySpot/GridItem";
import StatusHandler from "../StatusHandler";

import { api } from "~/utils/api";
import { Button } from "../UI/Button";

const StudySpotGrid = () => {
  const { data, fetchNextPage, status, isLoading, isFetchingNextPage } =
    api.studySpots.getNotValidated.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastQuery) => lastQuery[lastQuery.length - 1]?.id,
        refetchOnWindowFocus: false,
      }
    );

  return (
    <>
      <div className="grid gap-8 relative grid-cols-fill-40">
        <StatusHandler status={status}>
          {data?.pages.map((page) =>
            page.map((studySpot) => (
              <StudySpotGridItem studySpot={studySpot} key={studySpot.id} />
            ))
          )}
        </StatusHandler>
      </div>
      <Button
        className="font-mono"
        onClick={() => void fetchNextPage()}
        disabled={isLoading || isFetchingNextPage}
      >
        {isLoading || isFetchingNextPage ? "Loading..." : "Fetch More"}
      </Button>
    </>
  );
};

export default StudySpotGrid;
