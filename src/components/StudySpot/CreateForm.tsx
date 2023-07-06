import { Button } from "~/components/UI/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/UI/Form";
import { Input } from "~/components/UI/Input";
import { useForm } from "react-hook-form";
import { Checkbox } from "../UI/Checkbox";
import FileUpload from "../UI/FileUpload";

interface FormInput {
  name: string;
  hasWifi: boolean;
  latitude: number;
  longitude: number;
  images: File[];
}

const CreateStudySpotFormV2 = ({ onSuccess }: { onSuccess?: () => void }) => {
  const form = useForm<FormInput>({
    defaultValues: {
      name: "",
      hasWifi: false,
      images: [],
      latitude: 0,
      longitude: 0,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormInput) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={() => void form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter Name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hasWifi"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => form.setValue("hasWifi", !!v)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Wifi</FormLabel>
                <FormDescription>
                  Does this study spot have wifi?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input placeholder="Enter Latitude" {...field} type="number" />
              </FormControl>
              <FormDescription>
                This is the latitude of the study spot
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input placeholder="Enter Longitude" {...field} type="number" />
              </FormControl>
              <FormDescription>
                This is the longitude of the study spot
              </FormDescription>
              <FormMessage />
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
                <FileUpload
                  isSuccess={false}
                  setValue={(files) => form.setValue("images", files)}
                  {...field}
                />
              </FormControl>
              <FormDescription>Images you want to upload</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateStudySpotFormV2;
