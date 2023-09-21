import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/UI/Dialog";
import EditUserForm from "~/components/User/EditUserForm";
import { Button } from "../UI/Button";

const EditUserFormDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] sm:max-h-[700px] font-mono h-full sm:h-auto overflow-x-auto">
        <EditUserForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserFormDialog;
