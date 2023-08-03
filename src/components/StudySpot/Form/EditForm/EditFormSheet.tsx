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
import type { GetOneOutput } from "~/schemas/study-spots";

const EditStudySpotForm = dynamic(() => import("./EditForm"), {
  loading: () => <Loading />,
  ssr: false,
});

const Loading = () => <div className="font-mono">Loading the form...</div>;

function EditFormSheet({ studySpot }: { studySpot: GetOneOutput }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className="pointer-events-auto font-mono">
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="pt-14 w-full overflow-scroll">
        <div className="h-full w-full rounded-md">
          <div className="space-y-8 p-4">
            <SheetHeader aria-hidden className="sr-only">
              <SheetTitle>Edit Spot</SheetTitle>
              <SheetDescription>Edit the details of this spot</SheetDescription>
            </SheetHeader>
            <div className="font-mono space-y-4">
              <div className="text-3xl">Edit spot</div>
              <Separator />
            </div>
            <EditStudySpotForm
              onSuccess={() => setOpen(false)}
              studySpot={studySpot}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EditFormSheet;
