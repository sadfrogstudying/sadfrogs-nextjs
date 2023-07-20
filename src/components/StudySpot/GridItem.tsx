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
      images: true;
    };
  }>;
}) => {
  const apiUtils = api.useContext();
  const { mutate: deleteStudyspot, isLoading: isDeleting } =
    api.studySpots.deleteOne.useMutation({
      onSuccess: () => apiUtils.studySpots.getNotValidated.invalidate(),
    });

  const { address, wifi } = studySpot;

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
            className="hover:underline font-serif"
            href={`/study-spot/${studySpot.slug}`}
          >
            {studySpot.name}
          </Link>
        </CardTitle>
        <div className="text-sm">{address}</div>
        <DeleteAlertDialog
          deleteHandler={() => deleteStudyspot({ id: studySpot.id })}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  );
};

export default StudySpotGridItem;
