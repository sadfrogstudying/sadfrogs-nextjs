import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogPortal,
  AlertDialogOverlay,
} from "~/components/UI/AlertDialog";
import { TrashIcon } from "@radix-ui/react-icons";
import Button from "../UI/Button";

const DeleteAlertDialog = ({
  deleteHandler,
  isDeleting,
}: {
  deleteHandler: () => void;
  isDeleting: boolean;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button>
        {isDeleting ? (
          "Deleting..."
        ) : (
          <>
            Delete <TrashIcon />
          </>
        )}
      </Button>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the Study
          Spot and remove the data from our servers.
        </AlertDialogDescription>
        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
          <AlertDialogCancel asChild>
            <Button>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={deleteHandler}>Yes, delete Study Spot</Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialog>
);

export default DeleteAlertDialog;
