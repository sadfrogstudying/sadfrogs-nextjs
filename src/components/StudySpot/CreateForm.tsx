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
import FileInput from "../UI/FileInput";
import { api } from "~/utils/api";
import {
  parseClientError,
  uploadImagesToS3UsingPresignedUrls,
} from "~/utils/helpers";

interface FormInput {
  name: string;
  hasWifi: boolean;
  latitude: number;
  longitude: number;
  images: File[];
}

const CreateStudySpotForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const form = useForm<FormInput>({
    defaultValues: {
      name: "",
      hasWifi: false,
      images: [],
      latitude: 0,
      longitude: 0,
    },
  });

  const apiUtils = api.useContext();
  const {
    mutate,
    error,
    isLoading: createIsLoading,
    isSuccess: createIsSuccess,
  } = api.studySpots.createOne.useMutation({
    onSuccess: () => {
      form.reset();
      void apiUtils.studySpots.getNotValidated.invalidate();
      onSuccess?.();
    },
  });

  const errorMessages = parseClientError(error?.data?.zodError);

  const { mutate: getPresignedUrls, isLoading: presignedUrlsIsLoading } =
    api.s3.getPresignedUrls.useMutation({
      onSuccess: async (presignedUrls) => {
        if (!presignedUrls.length) return;
        const { name, hasWifi, latitude, longitude, images } = form.getValues();

        const imageUrls = await uploadImagesToS3UsingPresignedUrls({
          presignedUrls: presignedUrls,
          acceptedFiles: images,
        });

        mutate({
          name,
          hasWifi,
          imageUrls,
          location: {
            latitude,
            longitude,
          },
        });
      },
    });

  const submitHandler = form.handleSubmit((data) => {
    const filesToSubmit = data.images.map((file) => file.type);
    getPresignedUrls({ contentTypes: filesToSubmit });
  });

  const isLoading = createIsLoading || presignedUrlsIsLoading;
  const submitDisabled =
    isLoading || !form.watch("images").length || !form.watch("name");

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submitHandler();
        }}
        className="space-y-8"
      >
        <ul className="text-sm text-destructive">
          {errorMessages.map((x) => (
            <li key={x[0]}>
              <strong className="capitalize">{x[0]}</strong>: {x[1]}
            </li>
          ))}
        </ul>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
                <FileInput
                  isSuccess={false}
                  setValue={(files) => form.setValue("images", files)}
                  {...field}
                />
              </FormControl>
              <FormDescription>Images you want to upload</FormDescription>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={submitDisabled}
          className="disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateStudySpotForm;
