import { Card, CardContent, CardHeader } from "~/components/UI/Card";
import Image from "~/components/UI/Image";
import Link from "next/link";
import { useState } from "react";

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
  const { name, slug, id, country, state, venueType, wifi, powerOutlets } =
    studySpot;
  const [token] = useState(sessionStorage.getItem("sadfrogs_admin") || "");

  return (
    <Card className="flex flex-col gap-4 border-0 shadow-none w-full font-mono md:text-sm justify-end">
      <CardHeader className="p-0 w-full">
        {studySpot.images[0] && (
          <Link tabIndex={-1} href={`/study-spot/${slug}`}>
            <Image
              image={{ ...studySpot.images[0] }}
              key={studySpot.images[0].url}
              alt={`Image of ${name}`}
              objectFit="cover"
              className="rounded-md overflow-hidden w-full aspect-square sm:aspect-[3/4]"
              sizes="(max-width: 400px) 300px, (max-width: 640px) 600px, 320px"
            />
          </Link>
        )}
      </CardHeader>
      <CardContent className="p-0 border-gray-400 py-2 flex flex-col">
        <div className="truncate font-bold">
          {state}, {country}
        </div>
        <Link className="truncate hover:underline" href={`/study-spot/${slug}`}>
          {name}
        </Link>
        <div className="truncate">{venueType}</div>
        <div>Wifi: {wifi ? "Yes" : "No"}</div>
        <div>Power Outlets: {powerOutlets ? "Yes" : "No"}</div>

        {!!token && <DeleteAlertDialog id={id} />}
      </CardContent>
    </Card>
  );
};

export default StudySpotGridItem;
