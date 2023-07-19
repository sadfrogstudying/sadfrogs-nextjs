import { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import {
  parseZodClientError,
  uploadImagesToS3UsingPresignedUrls,
} from "~/utils/helpers";

import { Button } from "~/components/UI/Button";
import { Form } from "~/components/UI/Form";
import CreateFormInputsGeneral from "~/components/StudySpot/CreateForm/CreateFormInputsGeneral";
import CreateFormInputsLocation from "~/components/StudySpot/CreateForm/CreateFormInputsLocation";

import type { StudySpotInputV2 } from "~/schemas/study-spots";

/**
 *
 * This component is single source of truth for form data and handles submission.
 * Input fields are rendered in children.
 * Eventually error logic and component will be refactored out.
 *
 */
const CreateStudySpotForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const form = useForm<StudySpotInputV2>({
    defaultValues: {
      name: "",
      rating: 0,
      wifi: false,
      powerOutlets: false,
      noiseLevel: "",
      venueType: "",
      images: [],

      placeId: "",
      latitude: 0,
      longitude: 0,
      address: "",
      country: "",
      city: "",
      state: "",
    },
  });

  const apiUtils = api.useContext();
  const {
    mutate: createStudySpot,
    error: createError,
    isLoading: createIsLoading,
  } = api.studySpots.createOne.useMutation({
    onSuccess: () => {
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
      const {
        name,
        rating,
        wifi,
        powerOutlets,
        noiseLevel,
        venueType,
        images,
      } = form.getValues();

      const imageUrls = await uploadImagesToS3UsingPresignedUrls({
        presignedUrls: presignedUrls,
        acceptedFiles: images,
      });

      createStudySpot({
        name,
        rating,
        wifi,
        powerOutlets,
        noiseLevel,
        venueType,
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

  const submitHandler = form.handleSubmit((data) => {
    console.log(form.getValues());
    // checkIfNameExists({ name: data.name });
  });

  const isLoading = createIsLoading || getUrlsIsLoading || nameExistsLoading;
  const submitDisabled = isLoading || !form.watch("images").length;
  const zodErrorMessages = parseZodClientError(createError?.data?.zodError);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submitHandler();
        }}
        className="space-y-8 m-auto"
      >
        <CreateFormInputsGeneral form={form} />
        <CreateFormInputsLocation form={form} />
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
