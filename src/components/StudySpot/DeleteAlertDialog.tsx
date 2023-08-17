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
} from "~/components/UI/AlertDialog";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/UI/Button";
import { api } from "~/utils/api";
import { useState } from "react";

const DeleteAlertDialog = ({ id }: { id: number }) => {
  const [token] = useState(sessionStorage.getItem("sadfrogs_admin") || "");
  const apiUtils = api.useContext();
  const { mutate: deleteStudyspot, isLoading: isDeleting } =
    api.studySpots.deleteOne.useMutation({
      onSuccess: () => apiUtils.studySpots.getNotValidated.invalidate(),
    });

  const deleteHandler = () => deleteStudyspot({ id, token });

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="h-7" disabled={isDeleting} variant="secondary">
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
              This action cannot be undone. This will permanently delete the
              Study Spot and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteHandler}>
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteAlertDialog;
