import { Card, CardContent, CardHeader } from "~/components/UI/Card";
import Image from "~/components/UI/Image";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import type { ReactNode } from "react";

import dynamic from "next/dynamic";
import { Button } from "../UI/Button";

const DeleteAlertDialog = dynamic(() => import("./DeleteAlertDialog"), {
  loading: () => <Loading />,
  ssr: false,
});

const Loading = () => (
  <Button className="h-7" variant="secondary">
    Loading...
  </Button>
);

const StudySpotGridItem = ({
  studySpot,
}: {
  studySpot: Prisma.StudySpotGetPayload<{
    include: {
      images: true;
    };
  }>;
}) => {
  const { address, wifi, music, powerOutlets } = studySpot;
  const properties = Object.entries({ address, wifi, music, powerOutlets });

  return (
    <Card className="flex flex-col gap-4 border-0 shadow-none w-full font-mono text-sm justify-end">
      <CardHeader className="p-0 w-full">
        {studySpot.images[0] && (
          <Link tabIndex={-1} href={`/study-spot/${studySpot.slug}`}>
            <Image
              image={{ ...studySpot.images[0] }}
              key={studySpot.images[0].url}
              alt={`Image of ${studySpot.name}`}
              objectFit="contain"
              className="rounded-md overflow-hidden w-4/5"
            />
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-4 p-0 w-29 border-y border-gray-400 py-4 flex flex-col">
        <Link
          className="hover:underline"
          href={`/study-spot/${studySpot.slug}`}
        >
          {studySpot.name}
        </Link>
        <div>
          Otters are carnivorous mammals in the subfamily Lutrinae. The 13
          extant otter species are all semiaquatic, aquatic, or marine, with
          diets based on fish and invertebrates.
        </div>

        <div>
          {properties.map(([key, value]) => (
            <Row key={key.toString()} title={key.toString()}>
              {value.toString()}
            </Row>
          ))}
        </div>

        <DeleteAlertDialog id={studySpot.id} />
      </CardContent>
    </Card>
  );
};

export default StudySpotGridItem;

const Row = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-32 shrink-0 min-w-max">{title}:</div>
      {children}
    </div>
  );
};
