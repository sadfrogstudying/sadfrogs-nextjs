import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import StudySpotGrid from "~/components/StudySpot/Grid";
import { Button } from "~/components/UI/Button";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { api } from "~/utils/api";

import dynamic from "next/dynamic";
import { Checkbox } from "~/components/UI/Checkbox";
import { Grid, List, Star } from "lucide-react";
const StudySpotList = dynamic(() => import("~/components/StudySpot/List"));

export default function Home() {
  const [filters, setFilters] = useState({
    powerOutlets: false,
    wifi: false,
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const { data, fetchNextPage, status, isLoading, isFetchingNextPage } =
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

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(loadMoreRef, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible && (!isLoading || !isFetchingNextPage)) void fetchNextPage();
  }, [fetchNextPage, isVisible, isLoading, isFetchingNextPage]);

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
        <div className="font-mono flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="poweroutlets">Power Outlets:</label>
            <Checkbox
              id="poweroutlets"
              checked={filters.powerOutlets}
              onCheckedChange={(x) =>
                setFilters({
                  ...filters,
                  powerOutlets: x === "indeterminate" ? true : x,
                })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="wifi">Wifi:</label>
            <Checkbox
              id="wifi"
              checked={filters.wifi}
              onCheckedChange={(x) =>
                setFilters({
                  ...filters,
                  wifi: x === "indeterminate" ? true : x,
                })
              }
            />
          </div>

          <Button
            onClick={() => setAppliedFilters(filters)}
            disabled={isLoading}
          >
            <span className={`${isLoading ? "opacity-0" : ""}`}>Apply</span>
            {isLoading && (
              <Star className="absolute p-1 animate-spin" fill="#fff" />
            )}
          </Button>

          <Button
            onClick={() => setListView((prev) => !prev)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {listView ? (
              <>
                <Grid className="p-0.5 mr-2" />
                Grid
              </>
            ) : (
              <>
                <List className="p-0.5 mr-2" />
                List
              </>
            )}
          </Button>
        </div>

        {listView ? (
          <StudySpotList data={data} status={status} />
        ) : (
          <StudySpotGrid data={data} status={status} />
        )}
        <div aria-hidden ref={loadMoreRef} />
      </main>
    </>
  );
}
