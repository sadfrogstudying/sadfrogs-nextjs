import StudySpotGridItem from "~/components/StudySpot/GridItem";
import StatusHandler from "../StatusHandler";

import { api } from "~/utils/api";
import useLazyLoad from "~/hooks/useLazyLoad";

const StudySpotGrid = () => {
  const { data, fetchNextPage, status, isLoading, isFetchingNextPage } =
    api.studySpots.getNotValidated.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastQuery) => lastQuery[lastQuery.length - 1]?.id,
        refetchOnWindowFocus: false,
      }
    );

  const fetchMore = () => {
    if (!isLoading || !isFetchingNextPage) void fetchNextPage();
  };

  const [loadMoreRef] = useLazyLoad({ fetchNextPage: fetchMore });

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
      <div aria-hidden ref={loadMoreRef} />
    </>
  );
};

export default StudySpotGrid;
