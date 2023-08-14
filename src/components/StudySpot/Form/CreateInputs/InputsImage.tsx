import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSectionHeader,
} from "~/components/UI/Form";
import FileInput from "~/components/UI/FileInput";

import type { Image, StudySpotFormInputs } from "~/schemas/study-spots";

interface EditProps {
  existingImages: Image[];
}
interface Props {
  form: UseFormReturn<StudySpotFormInputs>;
  edit?: EditProps;
}

const StudySpotInputsImage = ({ form }: Props) => {
  return (
    <div className="space-y-8">
      <FormSectionHeader
        title="Image"
        description="Please add at least one image"
      />

      <div className="grid grid-cols-1 gap-4">
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StudySpotInputsImage;
