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
import FileInput from "~/components/UI/FileInput";

import type { StudySpotInputV2 } from "~/schemas/study-spots";

interface Props {
  form: UseFormReturn<StudySpotInputV2>;
}

const CreateFormInputsGeneral = ({ form }: Props) => {
  return (
    <div className="space-y-8">
      <FormSectionHeader
        title="General"
        description="This section must be filled out."
      />

      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} minLength={1} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input
                  placeholder="0"
                  {...field}
                  type="number"
                  onChange={(event) => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="noiseLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Noise Level</FormLabel>
              <FormControl>
                <Input
                  placeholder="Loud at peak hours"
                  {...field}
                  minLength={2}
                  required
                />
              </FormControl>
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
                <Input placeholder={`Cafe`} {...field} minLength={1} required />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <FileInput
                  isSuccess={false}
                  setValue={(files) => form.setValue("images", files)}
                  value={field.value}
                />
              </FormControl>
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

export default CreateFormInputsGeneral;
