import { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import {
  parseZodClientError,
  uploadImagesToS3UsingPresignedUrls,
} from "~/utils/helpers";

import { Button } from "~/components/UI/Button";
import { Form } from "~/components/UI/Form";
import StudySpotInputsGeneral from "~/components/StudySpot/Form/SharedInputs/InputsGeneral";
import StudySpotInputsImage from "~/components/StudySpot/Form/SharedInputs/InputsImage";
import StudySpotInputsLocation from "~/components/StudySpot/Form/SharedInputs/InputsLocation";
import StudySpotInputsMisc from "~/components/StudySpot/Form/SharedInputs/InputsMisc";

import {
  creatependingEditInputSchema,
  type StudySpotFormInputs,
  type GetOneOutput,
} from "~/schemas/study-spots";
import { differenceWith, isEqual, toPairs } from "lodash";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileListImagesSchema } from "~/schemas/utility";

const createPendingEditFormInputSchema = creatependingEditInputSchema.extend({
  images: FileListImagesSchema(),
});

/**
 *
 * This component is single source of truth for form data and handles submission.
 * Input fields are rendered in children.
 * Eventually error logic and component will be refactored out.
 *
 */
const EditStudySpotForm = ({
  onSuccess,
  studySpot,
}: {
  onSuccess?: () => void;
  studySpot: GetOneOutput;
}) => {
  const form = useForm<StudySpotFormInputs>({
    resolver: zodResolver(createPendingEditFormInputSchema),
    defaultValues: {
      ...studySpot,
      // Remember that checkbox value cannot be null, but can be undefined
      // However, in the DB it can be null
      canStudyForLong: studySpot.canStudyForLong === null && undefined,
      sunlight: studySpot.sunlight === null && undefined,
      drinks: studySpot.drinks === null && undefined,
      food: studySpot.food === null && undefined,
      images: [],
      imagesToDelete: [],
    },
  });

  const getChangedFormValues = () => {
    const existingValues = studySpot; // 35
    const newValues = form.getValues();

    const changes = differenceWith(
      toPairs(newValues),
      toPairs(existingValues),
      isEqual
    );
    const changesObj = Object.fromEntries(changes); // the only fields that changed

    // checks if the keys in changesObj are a subset of StudySpotFormInputs
    function partiallyConformsToStudySpotFormInputs(
      obj: object
    ): obj is Partial<StudySpotFormInputs> {
      const changeKeys = Object.keys(changesObj);
      return changeKeys.every((key) => key in obj);
    }

    if (!partiallyConformsToStudySpotFormInputs(changesObj)) return;

    return changesObj;
  };

  const {
    mutate: createPendingEdit,
    error: createError,
    isLoading: createIsLoading,
  } = api.studySpots.createPendingEdit.useMutation({
    onSuccess: () => {
      console.log("success");
      form.reset();
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
      const changesObj = getChangedFormValues();

      if (!changesObj || !changesObj.images) return;

      const imageUrls = await uploadImagesToS3UsingPresignedUrls({
        presignedUrls: presignedUrls,
        acceptedFiles: changesObj.images,
      });

      createPendingEdit({
        ...changesObj,
        images: imageUrls,
        studySpotId: studySpot.id,
      });
    },
  });

  const getPresignedUrlsHandler = () => {
    const filesToSubmit = form.getValues("images").map((file) => ({
      contentLength: file.size,
      contentType: file.type,
    }));

    getPresignedUrls({ files: filesToSubmit });
  };

  const {
    mutate: checkIfNameExists,
    error: nameExistsError,
    isLoading: nameExistsLoading,
  } = api.studySpots.checkIfNameExists.useMutation({
    onSuccess: () => {
      const changesObj = getChangedFormValues();
      if (changesObj?.images && changesObj.images.length !== 0)
        return getPresignedUrlsHandler();

      return createPendingEdit({
        ...changesObj,
        images: [],
        studySpotId: studySpot.id,
      });
    },
  });

  const submitHandler = form.handleSubmit(() => {
    const existingValues = studySpot; // 35
    const changesObj = getChangedFormValues();

    if (!changesObj) return;

    if (changesObj.name && changesObj.name !== existingValues.name)
      return checkIfNameExists({ name: changesObj.name });

    if (changesObj.images && changesObj.images.length !== 0)
      return getPresignedUrlsHandler();

    return createPendingEdit({
      ...changesObj,
      images: [],
      studySpotId: studySpot.id,
    });
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
      <form onSubmit={submitHandler} className="space-y-16 m-auto font-mono">
        <StudySpotInputsGeneral form={form} />
        <StudySpotInputsImage form={form} existingImages={studySpot.images} />
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
        <Button
          type="submit"
          disabled={submitDisabled}
          className="disabled:cursor-not-allowed"
        >
          {getButtonText()}
        </Button>
      </form>
    </Form>
  );
};

export default EditStudySpotForm;
