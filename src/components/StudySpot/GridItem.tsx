import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/Card";
import Image from "~/components/UI/Image";
import type { Prisma } from "@prisma/client";
import { api } from "~/utils/api";
import DeleteAlertDialog from "./DeleteAlertDialog";
import Link from "next/link";

const StudySpotGridItem = ({
  studySpot,
}: {
  studySpot: Prisma.StudySpotGetPayload<{
    include: {
      location: true;
      images: true;
    };
  }>;
}) => {
  const apiUtils = api.useContext();
  const { mutate: deleteStudyspot, isLoading: isDeleting } =
    api.studySpots.deleteOne.useMutation({
      onSuccess: () => apiUtils.studySpots.getNotValidated.invalidate(),
    });

  return (
    <Card>
      <CardHeader>
        {studySpot.images[0] && (
          <div className="overflow-hidden rounded-md">
            <Image
              image={{ ...studySpot.images[0] }}
              key={studySpot.images[0].url}
              alt={`Image of ${studySpot.name}`}
              objectFit="cover"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-8">
        <CardTitle>
          <Link
            className="hover:underline"
            href={`/study-spot/${studySpot.slug}`}
          >
            {studySpot.name}
          </Link>
        </CardTitle>
        <DeleteAlertDialog
          deleteHandler={() => deleteStudyspot({ id: studySpot.id })}
          isDeleting={isDeleting}
        />
        <div>
          <div className="flex justify-between">
            <strong>Location:</strong>
            <div>The Rocks, Sydney</div>
          </div>
          <div className="flex justify-between">
            <strong>Wifi:</strong>
            <div>{studySpot.hasWifi ? "True" : "False"}</div>
          </div>
          <div className="flex justify-between">
            <strong>Coordinates:</strong>
            <div>
              {studySpot.location.latitude} : {studySpot.location.longitude}
            </div>
          </div>
        </div>
        <p>
          Este artículo se centra en el rechazo de Frederick Law Olmsted a la
          representación del paisaje en general y, en particular, a la pintura
          como modelo de paisaje.
        </p>
      </CardContent>
    </Card>
  );
};

export default StudySpotGridItem;
