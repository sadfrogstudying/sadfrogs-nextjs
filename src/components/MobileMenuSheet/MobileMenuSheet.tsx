import { Button } from "~/components/UI/Button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/UI/Sheet";
import { useState } from "react";

import Link from "next/link";
import { cn } from "~/lib/utils";
import Navigation from "../Navigation";

function MobileMenuSheet({
  className,
  username,
}: {
  className?: string;
  username: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn("pointer-events-auto", className)}
        >
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent className={cn("pt-14 w-full font-mono flex flex-col")}>
        <SheetTitle aria-hidden className="sr-only">
          Mobile Menu
        </SheetTitle>
        <nav className="flex flex-col ml-auto justify-end items-end space-y-2">
          <h1
            onClick={close}
            className={`pointer-events-auto font-serif tracking-tight text-3xl mb-4`}
          >
            <Link href="/">Sad Frogs Studying</Link>
          </h1>
          <Navigation
            forMobile
            onLinkClick={() => setOpen(false)}
            username={username}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenuSheet;
