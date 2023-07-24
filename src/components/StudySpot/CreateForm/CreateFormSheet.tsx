import { Button } from "~/components/UI/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/UI/Sheet";
import { useState } from "react";

import dynamic from "next/dynamic";
import { Separator } from "~/components/UI/Seperator";
const CreateStudySpotForm = dynamic(() => import("./CreateForm"), {
  loading: () => <Loading />,
  ssr: false,
});

const Loading = () => <div className="font-mono">Loading the form...</div>;

function CreateStudySpotFormSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="pointer-events-auto">
          Create
        </Button>
      </SheetTrigger>
      <SheetContent className="pt-14 w-full overflow-scroll">
        <div className="h-full w-full rounded-md">
          <div className="space-y-8 p-4">
            <SheetHeader aria-hidden className="sr-only">
              <SheetTitle>Create New Spot</SheetTitle>
              <SheetDescription>
                Add a new study spot to SadFrogs ✍️.
              </SheetDescription>
            </SheetHeader>
            <div className="font-mono space-y-4">
              <div className="text-3xl">Add a new spot</div>
              <Separator />
            </div>
            <CreateStudySpotForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateStudySpotFormSheet;
