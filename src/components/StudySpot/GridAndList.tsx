import { useEffect, useState } from "react";

import { api } from "~/utils/api";

import dynamic from "next/dynamic";
import useDebounce from "~/hooks/useDebounce";
import { useInView } from "react-intersection-observer";

const Controls = dynamic(() => import("~/components/StudySpot/Controls"), {
  loading: () => <div></div>,
});

interface Filters {
  powerOutlets: boolean;
  wifi: boolean;
}
const StudySpotList = dynamic(() => import("~/components/StudySpot/List"));
const StudySpotGrid = dynamic(() => import("~/components/StudySpot/Grid"));

export default function GridAndList() {
  const [filters, setFilters] = useState<Filters>({
    powerOutlets: false,
    wifi: false,
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const { data, fetchNextPage, status, isLoading } =
    api.studySpots.getNotValidated.useInfiniteQuery(
      {
        powerOutlets: appliedFilters.powerOutlets || undefined,
        wifi: appliedFilters.wifi || undefined,
      },
      {
        getNextPageParam: (lastQuery) => lastQuery[lastQuery.length - 1]?.id,
        refetchOnWindowFocus: false,
      }
    );

  const { ref, inView } = useInView({
    rootMargin: "200px",
  });

  const debouncedRequest = useDebounce(() => {
    void fetchNextPage();
  }, 250);

  useEffect(() => {
    if (inView && !isLoading) debouncedRequest();
  }, [inView, isLoading, debouncedRequest]);

  const [listView, setListView] = useState(false);

  return (
    <>
      <div className="md:flex gap-16">
        <Controls
          filters={filters}
          setFilters={setFilters}
          setAppliedFilters={setAppliedFilters}
          listView={listView}
          setListView={setListView}
          isLoading={isLoading}
        />

        {listView ? (
          <StudySpotList data={data} status={status} />
        ) : (
          <StudySpotGrid data={data} status={status} />
        )}
      </div>
      <div aria-hidden ref={ref} />
    </>
  );
}
