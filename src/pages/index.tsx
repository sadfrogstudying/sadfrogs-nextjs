import Head from "next/head";
import { useEffect, useState } from "react";

import StudySpotGrid from "~/components/StudySpot/Grid";
import { api } from "~/utils/api";

import dynamic from "next/dynamic";
import useDebounce from "~/hooks/useDebounce";
import { useInView } from "react-intersection-observer";

const StudySpotList = dynamic(() => import("~/components/StudySpot/List"));

const Controls = dynamic(() => import("~/components/StudySpot/Controls"), {
  loading: () => <div></div>,
});

interface Filters {
  powerOutlets: boolean;
  wifi: boolean;
}

export default function Home() {
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

  const { ref, inView } = useInView();

  const debouncedRequest = useDebounce(() => {
    void fetchNextPage();
  }, 250);

  useEffect(() => {
    if (inView && !isLoading) debouncedRequest();
  }, [inView, isLoading, debouncedRequest]);

  const [listView, setListView] = useState(false);

  return (
    <>
      <Head>
        <title>Sad Frogs</title>
        <meta
          name="description"
          content="A place where Sad Frogs find places to study"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4 pt-20 md:pt-24 md:px-8 space-y-4 font-mono">
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
        <div aria-hidden ref={ref} />
      </main>
    </>
  );
}
