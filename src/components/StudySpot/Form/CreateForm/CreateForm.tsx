import { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import {
  parseZodClientError,
  uploadImagesToS3UsingPresignedUrls,
} from "~/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/UI/Button";
import { Form } from "~/components/UI/Form";
import StudySpotInputsGeneral from "~/components/StudySpot/Form/SharedInputs/InputsGeneral";
import StudySpotInputsLocation from "~/components/StudySpot/Form/SharedInputs/InputsLocation";
import StudySpotInputsMisc from "~/components/StudySpot/Form/SharedInputs/InputsMisc";
import StudySpotInputsImage from "~/components/StudySpot/Form/SharedInputs/InputsImage";

import {
  createOneInputSchema,
  type StudySpotFormInputs,
} from "~/schemas/study-spots";
import { FileListImagesSchema } from "~/schemas/utility";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallbackRender from "../ErrorBoundaryFallbackRender";

const createOneFormInputSchema = createOneInputSchema.extend({
  images: FileListImagesSchema({ minFiles: 1 }),
});

/**
 *
 * This component is single source of truth for form data and handles submission.
 * Input fields are rendered in children.
 * Eventually error logic and component will be refactored out.
 *
 */
const CreateStudySpotForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const form = useForm<StudySpotFormInputs>({
    resolver: zodResolver(createOneFormInputSchema),
    defaultValues: {
      name: "",
      website: "",
      wifi: false,
      powerOutlets: false,
      description: "",
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
      canStudyForLong: undefined,
      comfort: "",
      views: "",
      sunlight: undefined,
      temperature: "",
      music: "",
      lighting: "",
      distractions: "",
      crowdedness: "",
      proximityToAmenities: "",
      drinks: undefined,
      food: undefined,
      studyBreakFacilities: "",
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
      const formValues = form.getValues();

      const imageUrls = await uploadImagesToS3UsingPresignedUrls({
        presignedUrls: presignedUrls,
        acceptedFiles: formValues.images,
      });

      createStudySpot({
        ...formValues,
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
    // console.log("------------");
    // console.log(data.description);
    // return;
    checkIfNameExists({ name: data.name });
  });

  const isLoading = createIsLoading || getUrlsIsLoading || nameExistsLoading;
  const submitDisabled = isLoading;
  const zodErrorMessages = parseZodClientError(createError?.data?.zodError);

  const getButtonText = () => {
    if (createIsLoading) return "Creating...";
    if (getUrlsIsLoading) return "Uploading images...";
    if (nameExistsLoading) return "Checking name...";
    return "Submit";
  };

  return (
    <Form {...form}>
      <ErrorBoundary
        fallbackRender={ErrorBoundaryFallbackRender}
        onReset={() => {
          form.reset();
        }}
      >
        <form onSubmit={submitHandler} className="space-y-16 m-auto font-mono">
          <StudySpotInputsGeneral form={form} />
          <StudySpotInputsImage form={form} />
          <StudySpotInputsLocation form={form} />
          <StudySpotInputsMisc form={form} />
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
          <div className="space-y-4 pb-4">
            <Button
              type="submit"
              disabled={submitDisabled}
              className="disabled:cursor-not-allowed"
            >
              {getButtonText()}
            </Button>
          </div>
        </form>
      </ErrorBoundary>
    </Form>
  );
};

export default CreateStudySpotForm;
