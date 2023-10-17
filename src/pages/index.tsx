import Head from "next/head";
import { useEffect, useState } from "react";

import StudySpotGrid from "~/components/StudySpot/Grid";
import { api } from "~/utils/api";

import dynamic from "next/dynamic";
import useDebounce from "~/hooks/useDebounce";
import { useInView } from "react-intersection-observer";
import HomeHero from "~/components/HomeHero";
import { env } from "~/env.mjs";
import { type GetStaticProps } from "next";
import { type GetNotValidatedOutput } from "~/schemas/study-spots";

const StudySpotList = dynamic(() => import("~/components/StudySpot/List"));

const Controls = dynamic(() => import("~/components/StudySpot/Controls"), {
  loading: () => <div></div>,
});

interface Props {
  studyspotsForHero: GetNotValidatedOutput;
}

interface Filters {
  powerOutlets: boolean;
  wifi: boolean;
}

export default function Home({ studyspotsForHero }: Props) {
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
      <Head>
        <title>Sad Frogs</title>
        <meta
          name="description"
          content="A place where Sad Frogs find places to study"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="space-y-4 font-mono">
        <HomeHero studySpots={studyspotsForHero} />
        <section className="px-8 md:px-8">
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
        </section>
      </main>
    </>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps<Props> = async () => {
  const siteUrl =
    env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://sadfrogs-nextjs.vercel.app";
  const res = await fetch(`${siteUrl}/api/studyspots.getHeroImages`);
  const data = (await res.json()) as GetNotValidatedOutput;

  return {
    props: {
      studyspotsForHero: data,
    },
    revalidate: 60, // In seconds
  };
};
