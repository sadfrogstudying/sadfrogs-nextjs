import { useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "~/components/UI/Dialog";
import CreateUserForm from "~/components/User/CreateUserForm";

const CreateUserFormDialog = () => {
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-full sm:max-w-[525px] font-mono h-full sm:h-auto"
        hideClose
      >
        <CreateUserForm onSuccess={() => setOpen(false)} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserFormDialog;
