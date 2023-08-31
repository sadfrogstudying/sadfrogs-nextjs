import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "~/components/UI/Dialog";
import EditUserForm from "~/components/User/EditUserForm";
import { Button } from "../UI/Button";

const CreateUserFormDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] font-mono">
        <EditUserForm onSuccess={() => setOpen(false)} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserFormDialog;
