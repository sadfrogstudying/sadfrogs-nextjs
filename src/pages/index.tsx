import Head from "next/head";
import { api } from "~/utils/api";
import CreateStudySpotForm from "~/components/CreateStudySpotForm";

export default function Home() {
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
        <CreateStudySpotForm />
        <StudySpotGrid />
      </main>
    </>
  );
}

const StudySpotGrid = () => {
  const studySpots = api.studySpots.getNotValidated.useQuery();
  const apiUtils = api.useContext();
  const {
    mutate: deleteStudyspot,
    isLoading: isDeleting,
    data: deletedData,
  } = api.studySpots.deleteOne.useMutation({
    onSuccess: () => apiUtils.studySpots.getNotValidated.invalidate(),
  });

  return (
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
                lat: {studySpot.location.latitude}, long:{" "}
                {studySpot.location.longitude}
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
  );
};
