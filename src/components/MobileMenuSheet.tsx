import { Button } from "~/components/UI/Button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/UI/Sheet";
import { useState } from "react";

import Link from "next/link";
import CreateStudySpotFormSheet from "./StudySpot/Form/CreateForm/CreateFormSheet";
import { cn } from "~/lib/utils";

function MobileMenuSheet({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn("pointer-events-auto font-mono m-4", className)}
        >
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent className={cn("pt-14 w-full font-mono flex flex-col")}>
        <SheetTitle aria-hidden className="sr-only">
          Mobile Menu
        </SheetTitle>
        <nav className="flex flex-col ml-auto justify-end items-end">
          <h1
            onClick={close}
            className={`pointer-events-auto font-serif tracking-tight text-3xl mb-4`}
          >
            <Link href="/">Sad Frogs Studying</Link>
          </h1>
          <Link
            onClick={close}
            href="/about"
            className="pointer-events-auto h-fit py-2"
          >
            About
          </Link>

          <Link
            onClick={close}
            href="/map"
            className="pointer-events-auto h-fit py-2 mb-2"
          >
            Map
          </Link>

          <CreateStudySpotFormSheet />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenuSheet;
