import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/Card";
import Image from "~/components/UI/Image";
import type { Prisma } from "@prisma/client";
import { api } from "~/utils/api";
import DeleteAlertDialog from "./DeleteAlertDialog";
import Link from "next/link";
import { ReactNode } from "react";

const StudySpotGridItem = ({
  studySpot,
}: {
  studySpot: Prisma.StudySpotGetPayload<{
    include: {
      images: true;
    };
  }>;
}) => {
  const apiUtils = api.useContext();
  const { mutate: deleteStudyspot, isLoading: isDeleting } =
    api.studySpots.deleteOne.useMutation({
      onSuccess: () => apiUtils.studySpots.getNotValidated.invalidate(),
    });

  const { address, wifi, music, powerOutlets } = studySpot;

  const properties = Object.entries({ address, wifi, music, powerOutlets });

  // return (
  //   <Card>
  //     <CardHeader>
  //       {studySpot.images[0] && (
  //         <div className="overflow-hidden rounded-md">
  //           <Image
  //             image={{ ...studySpot.images[0] }}
  //             key={studySpot.images[0].url}
  //             alt={`Image of ${studySpot.name}`}
  //             objectFit="cover"
  //           />
  //         </div>
  //       )}
  //     </CardHeader>
  //     <CardContent className="space-y-8">
  //       <CardTitle>
  //         <Link
  //           className="hover:underline font-serif"
  //           href={`/study-spot/${studySpot.slug}`}
  //         >
  //           {studySpot.name}
  //         </Link>
  //       </CardTitle>
  //       <div className="text-sm">{address}</div>
  //       <DeleteAlertDialog
  //         deleteHandler={() => deleteStudyspot({ id: studySpot.id })}
  //         isDeleting={isDeleting}
  //       />
  //     </CardContent>
  //   </Card>
  // );

  return (
    <Card className="flex flex-wrap gap-4 border-0 shadow-none w-full font-mono text-sm">
      <CardHeader className="p-0">
        {studySpot.images[0] && (
          <Link
            tabIndex={-1}
            className="overflow-hidden rounded-md w-4/5"
            href={`/study-spot/${studySpot.slug}`}
          >
            <Image
              image={{ ...studySpot.images[0] }}
              key={studySpot.images[0].url}
              alt={`Image of ${studySpot.name}`}
              objectFit="cover"
            />
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-2 p-0 w-29 border-y border-black py-2 flex flex-col">
        <div>
          <Row title="title">
            <Link
              className="hover:underline"
              href={`/study-spot/${studySpot.slug}`}
            >
              {studySpot.name}
            </Link>
          </Row>
          {properties.map(([key, value]) => (
            <Row key={key.toString()} title={key.toString()}>
              {value.toString()}
            </Row>
          ))}
        </div>
        <DeleteAlertDialog
          deleteHandler={() => deleteStudyspot({ id: studySpot.id })}
          isDeleting={isDeleting}
        />
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
