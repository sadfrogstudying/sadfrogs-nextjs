import { Button } from "~/components/UI/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/UI/Sheet";
import CreateStudySpotForm from "./CreateForm";
import { useState } from "react";
import { ScrollArea } from "~/components/UI/ScrollArea";

function CreateStudySpotFormSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-full w-full rounded-md">
          <div className="space-y-8 pr-4">
            <SheetHeader>
              <SheetTitle>Create New Spot</SheetTitle>
              <SheetDescription>
                Add a new study spot to SadFrogs ✍️.
              </SheetDescription>
            </SheetHeader>
            <CreateStudySpotForm onSuccess={() => setOpen(false)} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default CreateStudySpotFormSheet;
