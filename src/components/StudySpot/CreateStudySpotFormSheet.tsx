import { useState } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetRoot,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "~/components/UI/Sheet";
import CreateStudySpotForm from "~/components/Form/CreateStudySpot";

const CreateStudySpotFormSheet = () => {
  const [open, setOpen] = useState(false);

  return (
    <SheetRoot open={open} onOpenChange={setOpen}>
      <SheetTrigger>Create New Spot</SheetTrigger>
      <SheetPortal>
        <SheetOverlay />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Study Spot</SheetTitle>
            <SheetDescription>
              Add a new study spot to SadFrogs ✍️.
            </SheetDescription>
          </SheetHeader>
          <CreateStudySpotForm onSuccess={() => setOpen(false)} />
          <SheetClose>
            <Cross1Icon />
          </SheetClose>
        </SheetContent>
      </SheetPortal>
    </SheetRoot>
  );
};

export default CreateStudySpotFormSheet;
