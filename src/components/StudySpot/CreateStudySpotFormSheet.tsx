import React from "react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetRoot,
  SheetTitle,
  SheetTrigger,
} from "~/components/UI/Sheet";
import CreateStudySpotForm from "~/components/Form/CreateStudySpot";

const CreateStudySpotFormSheet = () => {
  return (
    <SheetRoot>
      <SheetTrigger asChild>
        <button>Create New Spot</button>
      </SheetTrigger>

      <SheetPortal>
        <SheetOverlay />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Study Spot</SheetTitle>
            <SheetDescription>
              Add a new study spot to SadFrogs ✍️.
            </SheetDescription>
          </SheetHeader>
          <CreateStudySpotForm />
        </SheetContent>
      </SheetPortal>
    </SheetRoot>
  );
};

export default CreateStudySpotFormSheet;
