import Link from "next/link";
import { Button } from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import type { PendingEditQueryOutput } from "~/schemas/study-spots";
import { api } from "~/utils/api";

const PendingEditsPage = () => {
  const { data, status } = api.studySpots.getAllPendingEdits.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="pt-40 space-y-8 font-mono p-8">
      {status === "loading" && <div>Loading...</div>}

      {data?.map((pendingEdit, i) => (
        <PendingEdit
          key={`${pendingEdit.studySpot.name}-${i}`}
          pendingEdit={pendingEdit}
        />
      ))}
    </div>
  );
};

export default PendingEditsPage;

const PendingEdit = ({
  pendingEdit,
}: {
  pendingEdit: PendingEditQueryOutput;
}) => {
  const images = pendingEdit.images;
  const imagesToDelete = pendingEdit.imagesToDelete;
  const apiUtils = api.useContext();

  const { mutate: acceptEdit, isLoading } =
    api.studySpots.acceptPendingEdit.useMutation({
      onSuccess: () => {
        void apiUtils.studySpots.getAllPendingEdits.invalidate();
      },
    });

  return (
    <div className="border border-gray-100 rounded-md">
      <h3 className="text-xl font-bold bg-gray-100 p-4 flex justify-between">
        <Link href={`/study-spot/${pendingEdit.studySpot.slug}`}>
          Edit request for {pendingEdit.studySpot.name}
        </Link>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => acceptEdit({ id: pendingEdit.id })}
          >
            {isLoading ? "Loading..." : "Confirm"}
          </Button>
          <Button variant="outline">Deny</Button>
        </div>
      </h3>

      <div className="space-y-4">
        <div>
          {Object.entries(pendingEdit)
            .map((entry) => entry)
            .map(([key, val], i) => {
              if (!val || (Array.isArray(val) && val.length === 0)) return;
              if (
                key === "createdAt" ||
                key === "updatedAt" ||
                key === "id" ||
                key === "studySpotId" ||
                key === "studySpot" ||
                key === "images" ||
                key === "imagesToDelete"
              )
                return;

              return (
                <div
                  key={`${key}-${i}`}
                  className="flex gap-2 rounded-md bg-green-50"
                >
                  <strong className="bg-green-200 w-44 min-w-max truncate shrink-0">
                    {key}
                  </strong>
                  <span>{JSON.stringify(val)}</span>
                </div>
              );
            })}
        </div>

        <div className="p-4 pt-0 space-y-4">
          {images?.length ? (
            <div className="space-y-2 p-4 border border-green-500 rounded-md bg-green-50">
              <h4 className="font-bold text-green-400">Images to add:</h4>
              <div className="flex gap-4">
                {images.map((image) => (
                  <Image
                    className="h-40 w-auto rounded-md overflow-hidden"
                    image={image}
                    alt="Image user wants to add"
                    key={image.url}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {imagesToDelete?.length ? (
            <div className="space-y-2 p-4 border border-red-500 rounded-md bg-red-50">
              <h4 className="font-bold text-red-500">Images to delete:</h4>
              <div className="flex gap-4">
                {imagesToDelete.map((image) => (
                  <Image
                    className="h-40 w-auto rounded-md overflow-hidden"
                    image={image}
                    alt="Image user wants to delete"
                    key={image.url}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
