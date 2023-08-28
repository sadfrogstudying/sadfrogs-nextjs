import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/UI/Form";
import { Input } from "~/components/UI/Input";

import type { StudySpotFormInputs } from "~/schemas/study-spots";
import { Checkbox } from "~/components/UI/Checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/UI/Collapsible";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "~/components/UI/Seperator";

interface Props {
  form: UseFormReturn<StudySpotFormInputs>;
}

const StudySpotInputsMisc = ({ form }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible className="space-y-8" open={open}>
      <CollapsibleTrigger
        className="w-full text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <h3 className="text-2xl font-bold mb-1 flex gap-4">
            Misc {open ? <ChevronUp /> : <ChevronDown />}
          </h3>
          <p className="text-sm text-muted-foreground">Optional Information</p>
          <Separator className="mt-3" />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="noiseLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Noise Level</FormLabel>
              <FormControl>
                <Input placeholder="Loud at peak hours" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comfort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comfort</FormLabel>
              <FormControl>
                <Input placeholder="Comfy chairs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="views"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Views</FormLabel>
              <FormControl>
                <Input placeholder="City streets" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature</FormLabel>
              <FormControl>
                <Input placeholder="Really cold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="music"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Music</FormLabel>
              <FormControl>
                <Input placeholder="Soft Jazz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lighting"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lighting</FormLabel>
              <FormControl>
                <Input placeholder="Well lit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="distractions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distractions</FormLabel>
              <FormControl>
                <Input placeholder="Constant loud coffee machines" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="crowdedness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crowdedness</FormLabel>
              <FormControl>
                <Input placeholder="Very crowded after work" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proximityToAmenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proximity To Amenities</FormLabel>
              <FormControl>
                <Input placeholder="Many restaurants on street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="studyBreakFacilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Study Break Facilities</FormLabel>
              <FormControl>
                <Input placeholder="Smoking Area" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="canStudyForLong"
          render={({ field }) => (
            <FormItem
              className={`flex flex-row space-x-3 space-y-0 rounded-md ${
                field.value == undefined ? "opacity-40" : ""
              }`}
            >
              <FormControl>
                <Checkbox
                  checked={field.value || undefined}
                  onCheckedChange={(v) => form.setValue("canStudyForLong", !!v)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Can study for long?
                  <FormDescription>
                    Can you study for long here?
                  </FormDescription>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="drinks"
          render={({ field }) => (
            <FormItem
              className={`flex flex-row space-x-3 space-y-0 rounded-md ${
                field.value == undefined ? "opacity-40" : ""
              }`}
            >
              <FormControl>
                <Checkbox
                  checked={field.value || undefined}
                  onCheckedChange={(v) => form.setValue("drinks", !!v)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Drinks
                  <FormDescription>
                    Does the spot have/sell drinks?
                  </FormDescription>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sunlight"
          render={({ field }) => (
            <FormItem
              className={`flex flex-row space-x-3 space-y-0 rounded-md ${
                field.value == undefined ? "opacity-40" : ""
              }`}
            >
              <FormControl>
                <Checkbox
                  checked={field.value || undefined}
                  onCheckedChange={(v) => form.setValue("sunlight", !!v)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Sunlight
                  <FormDescription>
                    Does the spot have sunlight?
                  </FormDescription>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="food"
          render={({ field }) => (
            <FormItem
              className={`flex flex-row space-x-3 space-y-0 rounded-md ${
                field.value == undefined ? "opacity-40" : ""
              }`}
            >
              <FormControl>
                <Checkbox
                  checked={field.value || undefined}
                  onCheckedChange={(v) => form.setValue("food", !!v)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Food
                  <FormDescription>
                    Does the spot have/sell food?
                  </FormDescription>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default StudySpotInputsMisc;
