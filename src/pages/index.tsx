import Head from "next/head";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "~/utils/api";
import { uploadImagesToS3UsingPresignedUrls } from "~/utils/helpers";

export default function Home() {
  const [name, setName] = useState("");
  const [hasWifi, setHasWifi] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const studySpots = api.studySpots.getNotValidated.useQuery();
  const apiUtils = api.useContext();
  const { mutate, error } = api.studySpots.createOne.useMutation({
    onSuccess: () => apiUtils.studySpots.getNotValidated.invalidate(),
  });
  const nameError = error?.data?.zodError?.fieldErrors.name;
  const errorMessage = error?.message;

  const {
    mutate: deleteStudyspot,
    isLoading: isDeleting,
    data: deletedData,
  } = api.studySpots.deleteOne.useMutation({
    onSuccess: () => apiUtils.studySpots.getNotValidated.invalidate(),
  });
  const { mutate: getPresignedUrls } = api.s3.getPresignedUrls.useMutation({
    onSuccess: async (presignedUrls) => {
      if (!presignedUrls.length) return;

      const imageUrls = await uploadImagesToS3UsingPresignedUrls({
        presignedUrls: presignedUrls,
        acceptedFiles: acceptedFiles,
      });

      mutate({
        name,
        hasWifi,
        imageUrls,
        location: {
          lat,
          lng,
        },
      });
    },
  });

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      maxFiles: 8,
      maxSize: 4000000, // 4mb
    });

  const files = useMemo(() => {
    return acceptedFiles.map((file) => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));
  }, [acceptedFiles]);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filesToSubmit = acceptedFiles.map((file) => file.type);
    getPresignedUrls({ contentTypes: filesToSubmit });
  };

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
      <main style={{ padding: `1rem` }}>
        <form onSubmit={submitHandler}>
          <div>
            <label>
              Name:{" "}
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={hasWifi}
                onChange={() => setHasWifi((x) => !x)}
              />
            </label>
            hasWifi
          </div>
          <div>
            <label>
              lat:{" "}
              <input
                type="number"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
              />
            </label>
          </div>
          <div>
            <label>
              lng:{" "}
              <input
                type="number"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
              />
            </label>
          </div>

          <div
            {...getRootProps()}
            className="dropzone-container"
            style={{ width: `200px`, height: `200px`, background: `lightgray` }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex h-full items-center justify-center font-semibold">
                <p>Drop the file here...</p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center font-semibold">
                <p>Drag n drop file here, or click to select files</p>
              </div>
            )}
          </div>
          <aside className="my-2">
            <h4 className="font-semibold text-zinc-400">
              Files pending upload:
            </h4>
            <ul>{files}</ul>
          </aside>

          <input type="submit" />
        </form>

        {nameError && <div>{nameError}</div>}
        {errorMessage && <div>{errorMessage}</div>}

        <br />
        <hr />
        <div>
          <h2>Study Spots</h2>
          <div
            style={{
              display: `grid`,
              gridTemplateColumns: `repeat(3,1fr)`,
              gap: `1rem`,
            }}
          >
            {studySpots.data?.map((studySpot) => (
              <div
                key={studySpot.id}
                style={{
                  outline: `1px solid #333`,
                  background: `#f8f8f8`,
                }}
              >
                <div style={{ padding: `1rem` }}>
                  <div
                    style={{
                      fontSize: `3rem`,
                      fontWeight: 600,
                      fontFamily: "fantasy",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {studySpot.name}
                  </div>
                  <div>has wifi: {studySpot.hasWifi}</div>
                  <div>
                    lat: {studySpot.location.lat}, long:{" "}
                    {studySpot.location.lng}
                  </div>
                  <button onClick={() => deleteStudyspot({ id: studySpot.id })}>
                    {!isDeleting ? "Delete" : "Deleting"}
                  </button>
                </div>
                <div
                  style={{
                    display: `flex`,
                    flexWrap: `wrap`,
                    borderTop: `1px dashed black`,
                    padding: `1rem`,
                  }}
                >
                  {studySpot.images.map((image) => (
                    <img
                      src={image.url}
                      key={image.url}
                      alt="study spot"
                      style={{
                        maxWidth: `200px`,
                        width: `100%`,
                        alignSelf: "center",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
