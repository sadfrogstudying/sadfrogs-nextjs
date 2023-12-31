import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSectionHeader,
} from "~/components/UI/Form";
import { Input } from "~/components/UI/Input";
import { Checkbox } from "~/components/UI/Checkbox";

import type { StudySpotFormInputs } from "~/schemas/study-spots";

interface Props {
  form: UseFormReturn<StudySpotFormInputs>;
}

const StudySpotInputsGeneral = ({ form }: Props) => {
  return (
    <div className="space-y-8">
      <FormSectionHeader
        title="General 🔥"
        description="Please fill in this section"
      />

      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="venueType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Type</FormLabel>
              <FormControl>
                <Input placeholder="Cafe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wifi"
          render={({ field }) => (
            <FormItem className="flex flex-row space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => form.setValue("wifi", !!v)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Wifi</FormLabel>
                <FormDescription>Does the spot have wifi?</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="powerOutlets"
          render={({ field }) => (
            <FormItem className="flex flex-row space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => form.setValue("powerOutlets", !!v)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Power Outlets</FormLabel>
                <FormDescription>
                  Does this spot have power outlets?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StudySpotInputsGeneral;
