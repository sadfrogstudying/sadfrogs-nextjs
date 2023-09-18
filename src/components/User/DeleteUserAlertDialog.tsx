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
import { useRouter } from "next/router";

const DeleteUserAlertDialog = () => {
  const router = useRouter();
  const apiUtils = api.useContext();
  const { mutate: deleteUser, isLoading } =
    api.user.deleteCurrentUser.useMutation({
      onSuccess: () => {
        apiUtils.user.getCurrentUser.invalidate();
        void router.push(`/`);
      },
    });

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={isLoading} variant="destructive">
            {isLoading ? (
              "Deleting..."
            ) : (
              <>
                Delete <Trash2 className="h-4 ml-1" />
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="font-mono">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteUser()}>
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteUserAlertDialog;
