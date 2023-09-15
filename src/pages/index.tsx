import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import StudySpotGrid from "~/components/StudySpot/Grid";
import { Button } from "~/components/UI/Button";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { api } from "~/utils/api";

import dynamic from "next/dynamic";
const StudySpotList = dynamic(() => import("~/components/StudySpot/List"));

export default function Home() {
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
    if (isVisible && (!isLoading || !isFetchingNextPage)) {
      console.log("fetching nxt page");
      void fetchNextPage();
    }
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
      <main className="p-4 pt-20 md:pt-24 md:px-8 space-y-4">
        <div>
          <Button onClick={() => setListView((prev) => !prev)}>
            {listView ? "Grid View" : "List View"}
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
