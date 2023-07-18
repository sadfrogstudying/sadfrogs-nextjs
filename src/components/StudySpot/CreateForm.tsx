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
  parseZodClientError,
  uploadImagesToS3UsingPresignedUrls,
} from "~/utils/helpers";
import LocationSearchInput from "../LocationSearch";

interface FormInput {
  name: string;
  wifi: boolean;
  images: File[];
  latitude: number;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

const CreateStudySpotForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const form = useForm<FormInput>({
    defaultValues: {
      name: "",
      wifi: false,
      images: [],
      latitude: 0,
      location: {
        address: "",
        latitude: 0,
        longitude: 0,
      },
    },
  });

  const apiUtils = api.useContext();
  const {
    mutate: createStudySpot,
    error: createError,
    isLoading: createIsLoading,
  } = api.studySpots.createOne.useMutation({
    onSuccess: (data) => {
      form.reset();
      void apiUtils.studySpots.getNotValidated.invalidate();
      onSuccess?.();
    },
  });

  const {
    mutate: getPresignedUrls,
    error: getUrlsError,
    isLoading: getUrlsIsLoading,
  } = api.s3.getPresignedUrls.useMutation({
    onSuccess: async (presignedUrls) => {
      if (!presignedUrls.length) return;
      const { name, wifi, images, location } = form.getValues();
      const { latitude, longitude } = location;

      const imageUrls = await uploadImagesToS3UsingPresignedUrls({
        presignedUrls: presignedUrls,
        acceptedFiles: images,
      });

      createStudySpot({
        name,
        rating: 0,
        wifi,
        powerOutlets: "",
        noiseLevel: "",
        venueType: "",
        images: imageUrls,
      });
    },
  });

  const {
    mutate: checkIfNameExists,
    error: nameExistsError,
    isLoading: nameExistsLoading,
  } = api.studySpots.checkIfNameExists.useMutation({
    onSuccess: () => {
      const filesToSubmit = form.getValues("images").map((file) => ({
        contentLength: file.size,
        contentType: file.type,
      }));

      getPresignedUrls({ files: filesToSubmit });
    },
  });

  const submitHandler = form.handleSubmit((data) =>
    checkIfNameExists({ name: data.name })
  );

  const isLoading = createIsLoading || getUrlsIsLoading || nameExistsLoading;
  const submitDisabled =
    isLoading || !form.watch("images").length || !form.watch("name");
  const zodErrorMessages = parseZodClientError(createError?.data?.zodError);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submitHandler();
        }}
        className="space-y-8 max-w-lg m-auto"
      >
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
          name="wifi"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => form.setValue("wifi", !!v)}
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
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <LocationSearchInput />
                </FormControl>
                <FormDescription>Location of the study spot</FormDescription>
              </FormItem>
            );
          }}
        />

        <ul className="text-sm text-destructive">
          {zodErrorMessages.length !== 0 ? (
            <>
              {zodErrorMessages.map((x) => (
                <li key={x[0]}>
                  <strong className="capitalize">{x[0]}</strong>: {x[1]}
                </li>
              ))}
            </>
          ) : (
            <li>{createError?.message}</li>
          )}
          {nameExistsError?.message && <li>{nameExistsError?.message}</li>}
          {getUrlsError?.message && <li>{getUrlsError?.message}</li>}
        </ul>
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
