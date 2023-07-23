import { Button } from "~/components/UI/Button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/UI/Sheet";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger className="mt-96" asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>

      <SheetContent>
        <ScrollAreaDemo />
      </SheetContent>
    </Sheet>
  );
}

import * as React from "react";

import { ScrollArea } from "~/components/UI/ScrollArea";
import { Separator } from "~/components/UI/Seperator";

const tags = Array.from({ length: 50 }).map((x, i) => i);

function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <ComboboxDemo />
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm" key={tag}>
              {tag}
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}

import { ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/UI/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/UI/Popover";

function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          Select
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandItem>Hello</CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
