import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/Card";
import Image from "~/components/UI/Image";
import type { Prisma } from "@prisma/client";
import styled from "@emotion/styled";
import { api } from "~/utils/api";
import DeleteAlertDialog from "./DeleteAlertDialog";

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
          <ImageContainer>
            <Image
              image={{ ...studySpot.images[0] }}
              key={studySpot.images[0].url}
              alt={`Image of ${studySpot.name}`}
              objectFit="cover"
            />
          </ImageContainer>
        )}
      </CardHeader>
      <CardContent>
        <CardTitle
          style={{
            fontWeight: 400,
          }}
        >
          {studySpot.name}
        </CardTitle>
        <DeleteAlertDialog
          deleteHandler={() => deleteStudyspot({ id: studySpot.id })}
          isDeleting={isDeleting}
        />
        <div>
          <CardRow>
            <strong>Location:</strong>
            <div>The Rocks, Sydney</div>
          </CardRow>
          <CardRow>
            <strong>Wifi:</strong>
            <div>{studySpot.hasWifi ? "True" : "False"}</div>
          </CardRow>
          <CardRow>
            <strong>Coordinates:</strong>
            <div>
              {studySpot.location.latitude} : {studySpot.location.longitude}
            </div>
          </CardRow>
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

const ImageContainer = styled.div`
  overflow: hidden;
  border-radius: 0.5rem;
`;
const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
