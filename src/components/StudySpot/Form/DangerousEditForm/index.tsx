import dynamic from "next/dynamic";
import { Button } from "~/components/UI/Button";

/**
 * 🚨🚨🚨
 * This EditForm doesn't use PendingEdits, it will immediately update the spot with the new data.
 * Only using this in the early stages to reduce user friction.
 */
const EditStudySpotFormSheet = dynamic(
  () => import("~/components/StudySpot/Form/DangerousEditForm/EditFormSheet"),
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
