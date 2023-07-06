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
} from "~/components/UI/alert-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/UI/button";

const DeleteAlertDialog = ({
  deleteHandler,
  isDeleting,
}: {
  deleteHandler: () => void;
  isDeleting: boolean;
}) => (
  <>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full" disabled={isDeleting} variant="destructive">
          {isDeleting ? (
            "Deleting..."
          ) : (
            <>
              Delete <Trash2 className="h-4 ml-1" />
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Study
            Spot and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteHandler}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
);

export default DeleteAlertDialog;
