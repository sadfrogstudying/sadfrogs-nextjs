import Link from "next/link";
import { useEffect, useState } from "react";
import Login from "~/components/Login";
import { Button } from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import type { PendingEditQueryOutput } from "~/schemas/study-spots";
import { api } from "~/utils/api";

const PendingEditsPage = () => {
  const [token, setToken] = useState("");
  const { data, isLoading, isSuccess, status } =
    api.studySpots.getAllPendingEdits.useQuery(
      { token: token },
      {
        refetchOnWindowFocus: false,
        retry: 1,
      }
    );

  useEffect(() => {
    const tokenFromStorage = sessionStorage.getItem("sadfrogs_admin") || "";
    setToken(tokenFromStorage);
  }, [status]);

  return (
    <main className="pt-40 space-y-8 font-mono h-full">
      <div className="p-8 space-y-4">
        <div className="flex">{isLoading && <div>loading...</div>}</div>

        {!isSuccess && !isLoading ? (
          <Login />
        ) : (
          <>
            {data?.map((pendingEdit, i) => (
              <PendingEdit
                key={`${pendingEdit.studySpot.name}-${i}`}
                pendingEdit={pendingEdit}
              />
            ))}

            {!!data && data?.length === 0 && <div>no pending edits...</div>}
          </>
        )}
      </div>
      <video
        className="rounded-md w-full object-cover h-full md:w-2/3 md:h-auto md:object-contain"
        autoPlay
        muted
        loop
        src="/videos/frog.mp4"
      ></video>
    </main>
  );
};

export default PendingEditsPage;

const PendingEdit = ({
  pendingEdit,
}: {
  pendingEdit: PendingEditQueryOutput;
}) => {
  const images = pendingEdit.pendingImagesToAdd;
  const imagesToDelete = pendingEdit.pendingImagesToDelete;

  return (
    <div className="border border-gray-100 rounded-md">
      <h3 className="text-xl font-bold bg-gray-100 p-4 flex justify-between">
        <Link href={`/study-spot/${pendingEdit.studySpot.slug}`}>
          Edit request for {pendingEdit.studySpot.name}
        </Link>
        <div className="flex gap-2">
          <AcceptEditButton pendingEditId={pendingEdit.id} />
          <DeclineEditButton pendingEditId={pendingEdit.id} />
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
                key === "pendingImagesToAdd" ||
                key === "pendingImagesToDelete"
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
                {images.map(({ image }) => (
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
                {imagesToDelete.map(({ image }) => (
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

const AcceptEditButton = ({ pendingEditId }: { pendingEditId: string }) => {
  const apiUtils = api.useContext();
  const { mutate: acceptEdit, isLoading } =
    api.studySpots.acceptPendingEdit.useMutation({
      onSuccess: () => {
        void apiUtils.studySpots.getAllPendingEdits.invalidate();
      },
    });

  return (
    <Button
      variant="outline"
      disabled={isLoading}
      onClick={() => acceptEdit({ id: pendingEditId })}
    >
      {isLoading ? "Loading..." : "Accept Edit"}
    </Button>
  );
};

const DeclineEditButton = ({ pendingEditId }: { pendingEditId: string }) => {
  const apiUtils = api.useContext();
  const { mutate: declineEdit, isLoading } =
    api.studySpots.declinePendingEdit.useMutation({
      onSuccess: () => {
        void apiUtils.studySpots.getAllPendingEdits.invalidate();
      },
    });

  return (
    <Button
      variant="outline"
      disabled={isLoading}
      onClick={() => declineEdit({ id: pendingEditId })}
    >
      {isLoading ? "Loading..." : "Decline Edit"}
    </Button>
  );
};
