import dynamic from "next/dynamic";
import { Button } from "~/components/UI/Button";

const EditStudySpotFormSheet = dynamic(
  () => import("~/components/StudySpot/Form/EditForm/EditFormSheet"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

const Loading = () => (
  <Button variant="secondary" disabled className="font-mono">
    Edit
  </Button>
);

export default EditStudySpotFormSheet;
