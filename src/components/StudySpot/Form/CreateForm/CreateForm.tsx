import { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import {
  parseZodClientError,
  uploadImagesToS3UsingPresignedUrls,
} from "~/utils/helpers";

import { Button } from "~/components/UI/Button";
import { Form } from "~/components/UI/Form";
import StudySpotInputsGeneral from "~/components/StudySpot/Form/CreateInputs/InputsGeneral";
import StudySpotInputsLocation from "~/components/StudySpot/Form/CreateInputs/InputsLocation";
import StudySpotInputsMisc from "~/components/StudySpot/Form/CreateInputs/InputsMisc";
import StudySpotInputsImage from "~/components/StudySpot/Form/CreateInputs/InputsImage";

import type { StudySpotFormInputs } from "~/schemas/study-spots";

const defaultValues = {
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

  openingHours: [],

  canStudyForLong: "",

  vibe: "",
  comfort: "",
  views: "",
  sunlight: false,
  temperature: "",
  music: "",
  lighting: "",

  distractions: "",
  crowdedness: "",

  naturalSurroundings: "",
  proximityToAmenities: "",

  drinks: false,
  food: false,
  studyBreakFacilities: "",
};

/**
 *
 * This component is single source of truth for form data and handles submission.
 * Input fields are rendered in children.
 * Eventually error logic and component will be refactored out.
 *
 */
const CreateStudySpotForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const form = useForm<StudySpotFormInputs>({
    defaultValues,
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
    checkIfNameExists({ name: data.name });
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
        className="space-y-16 m-auto font-mono"
      >
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
            {isLoading ? "Creating..." : "Submit"}
          </Button>
          {submitDisabled && (
            <p className="text-sm bg-orange-100 rounded px-2">
              Please fill out the general and image sections.
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CreateStudySpotForm;
