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
import { Separator } from "~/components/UI/Seperator";

import type { StudySpotInputV2 } from "~/schemas/study-spots";
import { Checkbox } from "~/components/UI/Checkbox";

interface Props {
  form: UseFormReturn<StudySpotInputV2>;
}

const CreateFormInputsMisc = ({ form }: Props) => {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Misc"
        description="Miscellaneous information about the Study Spot."
      />

      <div className="grid grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="canStudyForLong"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Can Study For Long?</FormLabel>
              <FormControl>
                <Input placeholder="Over 2 hours" {...field} />
              </FormControl>
              <FormDescription>
                How long do you think you can study for at this location?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vibe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vibe</FormLabel>
              <FormControl>
                <Input placeholder="Cozy" {...field} />
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
                <Input placeholder="" {...field} />
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
          name="naturalSurroundings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Natural Surroundings</FormLabel>
              <FormControl>
                <Input placeholder="Park closeby" {...field} />
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
          name="drinks"
          render={({ field }) => (
            <FormItem className="flex flex-row space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => form.setValue("drinks", !!v)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Drinks</FormLabel>
                <FormDescription>
                  Does the spot have/sell drinks?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sunlight"
          render={({ field }) => (
            <FormItem className="flex flex-row space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => form.setValue("sunlight", !!v)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Sunlight</FormLabel>
                <FormDescription>Does the spot have sunlight?</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="food"
          render={({ field }) => (
            <FormItem className="flex flex-row space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => form.setValue("food", !!v)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Food</FormLabel>
                <FormDescription>Does the spot have/sell food?</FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CreateFormInputsMisc;

const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <Separator className="mt-4" />
      </div>
    </>
  );
};
