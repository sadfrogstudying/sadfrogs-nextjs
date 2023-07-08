import { Prisma, StudySpot } from "@prisma/client";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/UI/Card";
import Image from "~/components/UI/Image";

type StudySpotComplete = Prisma.StudySpotGetPayload<{
  include: {
    location: true;
    images: true;
  };
}>;

const StudySpotPage = ({ studySpot }: { studySpot: StudySpotComplete }) => {
  const {
    createdAt,
    hasWifi,
    id,
    isValidated,
    locationId,
    name,
    slug,
    updatedAt,
    images,
    location,
  } = studySpot;

  return (
    <main className="p-4 pt-20 space-y-6">
      <div>
        <h1 className="text-4xl">{name}</h1>
        <h2 className="text-xl">Individual page for {name}</h2>
      </div>
      <div className="grid grid-cols-5">
        {studySpot.images?.map((image) => (
          <div className="overflow-hidden" key={image.url}>
            <Image
              image={{ ...image }}
              alt={`Image of ${studySpot.name}`}
              objectFit="cover"
            />
          </div>
        ))}
      </div>
      <div className="w-96">
        <div className="flex">
          <strong>Created at: </strong> <div>{createdAt.toString()}</div>
        </div>
        <div className="flex">
          <strong>Has Wifi: </strong> <div>{hasWifi.toString()}</div>
        </div>
        <div className="flex">
          <strong>Id: </strong> <div>{id}</div>
        </div>
        <div className="flex">
          <strong>Is Validated: </strong> <div>{isValidated}</div>
        </div>
        <div className="flex">
          <strong>Location Id: </strong> <div>{locationId}</div>
        </div>
        <div className="flex">
          <strong>Slug: </strong> <div>{slug}</div>
        </div>
        <div className="flex">
          <strong>Updated At: </strong> <div>{updatedAt.toString()}</div>
        </div>
      </div>
    </main>
  );
};

export default StudySpotPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug = "" } = context.params!;

  const { data } = await axios.get<StudySpotComplete>(
    "http://localhost:3000/api/studyspots.getOne",
    {
      params: {
        slug: slug,
      },
    }
  );

  return {
    props: {
      studySpot: data,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get<string[]>(
    "http://localhost:3000/api/studyspots.getAllPaths"
  );

  return {
    paths: data.map((path) => {
      return { params: { slug: path } };
    }),
    fallback: false,
  };
};
