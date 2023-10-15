import { Card, CardContent, CardHeader } from "~/components/UI/Card";
import Image from "~/components/UI/Image";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import dynamic from "next/dynamic";
import { Button } from "../UI/Button";
import type { GetNotValidatedElementOutput } from "~/schemas/study-spots";

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
  studySpot: GetNotValidatedElementOutput;
}) => {
  const { name, slug, id, address, wifi, music, powerOutlets } = studySpot;
  const properties = Object.entries({ wifi, music, powerOutlets });
  const [token] = useState(sessionStorage.getItem("sadfrogs_admin") || "");

  return (
    <Card className="flex flex-col gap-4 border-0 shadow-none w-full font-mono text-sm justify-end">
      <CardHeader className="p-0 w-full">
        {studySpot.images[0] && (
          <Link tabIndex={-1} href={`/study-spot/${slug}`}>
            <Image
              image={{ ...studySpot.images[0] }}
              key={studySpot.images[0].url}
              alt={`Image of ${name}`}
              objectFit="cover"
              className="rounded-md overflow-hidden w-full aspect-[3/4]"
              sizes="(max-width: 400px) 300px, (max-width: 640px) 600px, 320px"
            />
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-4 p-0 border-gray-400 py-4 flex flex-col">
        <Link
          className="font-bold hover:underline"
          href={`/study-spot/${slug}`}
        >
          {name}
        </Link>

        <div className="text-gray-500">
          <div className="mb-2">{address}</div>
          {properties.map(([key, value]) => (
            <Row key={key.toString()} title={key.toString()}>
              {value.toString()}
            </Row>
          ))}
        </div>

        {!!token && <DeleteAlertDialog id={id} />}
      </CardContent>
    </Card>
  );
};

export default StudySpotGridItem;

const Row = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-32 shrink-0 min-w-max font-bold">{title}:</div>
      {children}
    </div>
  );
};
