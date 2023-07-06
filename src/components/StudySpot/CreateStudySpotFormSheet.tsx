import { Button } from "~/components/UI/Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/UI/Sheet";
import CreateStudySpotFormV2 from "../Form/CreateStudySpotV2";
import { useState } from "react";
import { ScrollArea } from "~/components/UI/ScrollArea";

function CreateStudySpotFormSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-full w-full rounded-md">
          <SheetHeader>
            <SheetTitle>Create New Spot</SheetTitle>
            <SheetDescription>
              Add a new study spot to SadFrogs ✍️.
            </SheetDescription>
          </SheetHeader>
          {/* <CreateStudySpotForm onSuccess={() => setOpen(false)} /> */}
          <CreateStudySpotFormV2
          // onSuccess={() => setOpen(false)}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default CreateStudySpotFormSheet;
