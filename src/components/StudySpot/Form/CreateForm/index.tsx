import dynamic from "next/dynamic";
import { Button } from "~/components/UI/Button";

const CreateStudySpotFormSheet = dynamic(
  () => import("~/components/StudySpot/CreateForm/CreateFormSheet"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

const Loading = () => (
  <Button variant="outline" disabled>
    Create
  </Button>
);

export default CreateStudySpotFormSheet;
