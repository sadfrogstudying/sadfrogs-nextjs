import Head from "next/head";
import { api } from "~/utils/api";
import CreateStudySpotForm from "~/components/CreateStudySpotForm";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";

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
    <div
      style={{
        display: `grid`,
        gridTemplateColumns: `repeat(3,1fr)`,
        gap: `1rem`,
      }}
    >
      {studySpots.data?.map((studySpot) => (
        <Card key={studySpot.id}>
          <CardHeader style={{ padding: `1rem` }}>
            <CardTitle
              style={{
                fontSize: `3rem`,
                fontWeight: 400,
                fontFamily: "serif",
                letterSpacing: "-0.04em",
              }}
            >
              {studySpot.name}
            </CardTitle>
            <div>has wifi: {studySpot.hasWifi ? "True" : "False"}</div>
            <div>
              lat: {studySpot.location.latitude}, long:{" "}
              {studySpot.location.longitude}
            </div>
            <button onClick={() => deleteStudyspot({ id: studySpot.id })}>
              {!isDeleting ? "Delete" : "Deleting"}
            </button>
          </CardHeader>
          <CardContent>
            <div
              style={{
                display: `grid`,
                gridTemplateColumns: `repeat(auto-fill, minmax(100px, 1fr))`,
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
