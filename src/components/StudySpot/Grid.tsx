import { useEffect, useRef } from "react";

import StudySpotGridItem from "~/components/StudySpot/GridItem";
import StatusHandler from "~/components/StatusHandler";

import { api } from "~/utils/api";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";

const StudySpotGrid = () => {
  const { data, fetchNextPage, status, isLoading, isFetchingNextPage } =
    api.studySpots.getNotValidated.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastQuery) => lastQuery[lastQuery.length - 1]?.id,
        refetchOnWindowFocus: false,
      }
    );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(loadMoreRef, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible && (!isLoading || !isFetchingNextPage)) void fetchNextPage();
  }, [fetchNextPage, isVisible, isLoading, isFetchingNextPage]);

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
        <div aria-hidden ref={loadMoreRef} />
      </div>
    </>
  );
};

export default StudySpotGrid;
