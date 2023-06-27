import { type NextPage } from "next";
import { StandardDropzone } from "../components/StandardDropzone";
import type { RouterOutputs } from "../utils/api";
import { api } from "../utils/api";

// Lists the objects that have been uploaded to S3
const UploadedObjects = ({
  objects,
}: {
  objects: RouterOutputs["s3"]["getObjects"];
}) => {
  if (!objects || objects.length === 0)
    return <div>No objects uploaded yet.</div>;

  return (
    <div>
      <h2>Uploaded Objects</h2>
      {objects.map((object) => (
        <div key={object.Key || ""}>
          <a
            href={`https://t3-app-dropzone-example.s3.amazonaws.com/${
              object.Key || ""
            }`}
            target="_blank"
            rel="noreferrer"
          >
            {object.Key || ""}
          </a>
        </div>
      ))}
    </div>
  );
};

const S3UploadTest: NextPage = () => {
  const { data, isLoading } = api.s3.getObjects.useQuery();
  const { data: allImages, isLoading: imagesLoading } =
    api.s3.getAllImages.useQuery();

  return (
    <>
      <main>
        <h1>
          create-t3-app dropzone examples with react-dropzone + axios + S3
          presigned URLs
        </h1>
        <p>Open DevTools to see logs and learn how these components work</p>
        <div>
          <StandardDropzone />
        </div>
        <div>{!isLoading && data && <UploadedObjects objects={data} />}</div>
        <div
          style={{
            display: `grid`,
            gridTemplateColumns: `repeat(3, 1fr)`,
            width: `100%`,
          }}
        >
          {!imagesLoading &&
            allImages &&
            allImages.map((image) => (
              <img
                key={image.key}
                src={image.url}
                alt={image.key}
                className="w-1/4"
              />
            ))}
        </div>
      </main>
    </>
  );
};

export default S3UploadTest;
