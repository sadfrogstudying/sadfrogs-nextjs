import React from "react";
import { useForm } from "react-hook-form";

import * as Form from "@radix-ui/react-form";
import { type CheckedState } from "@radix-ui/react-checkbox";

import { api } from "~/utils/api";
import {
  parseClientError,
  uploadImagesToS3UsingPresignedUrls,
} from "~/utils/helpers";

import { CardContent, CardFooter } from "~/components/UI/Card";
import {
  FormButton,
  Flex,
  FormField,
  FormLabel,
  FormMessage,
  FormRoot,
  Input,
} from "~/components/UI/Form";
import FileUpload from "~/components/UI/FileUpload";
import Checkbox from "~/components/UI/Checkbox";

const CreateStudySpotForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  interface FormInput {
    name: string;
    hasWifi: boolean;
    latitude: number;
    longitude: number;
    images: File[];
  }

  const { register, handleSubmit, control, setValue, getValues, reset, watch } =
    useForm<FormInput>({
      defaultValues: {
        hasWifi: false,
        images: [],
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
      reset();
      void apiUtils.studySpots.getNotValidated.invalidate();
      onSuccess?.();
    },
  });

  const errorMessages = parseClientError(error?.data?.zodError);

  const { mutate: getPresignedUrls, isLoading: presignedUrlsIsLoading } =
    api.s3.getPresignedUrls.useMutation({
      onSuccess: async (presignedUrls) => {
        if (!presignedUrls.length) return;
        const { name, hasWifi, latitude, longitude, images } = getValues();

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

  const submitHandler = handleSubmit((data) => {
    const filesToSubmit = data.images.map((file) => file.type);
    getPresignedUrls({ contentTypes: filesToSubmit });
  });

  const isLoading = createIsLoading || presignedUrlsIsLoading;

  return (
    <FormRoot
      onSubmit={(e) => {
        e.preventDefault();
        void submitHandler();
      }}
    >
      <CardContent>
        <FormField name="name">
          <Flex>
            <FormLabel>Name</FormLabel>
            <FormMessage match="valueMissing">Please fill out 😡</FormMessage>
          </Flex>
          <Form.Control asChild placeholder="Name">
            <Input type="text" required {...register("name")} />
          </Form.Control>
        </FormField>

        <FormField name="hasWifi">
          <Flex>
            <FormLabel htmlFor="hasWifi">Has WiFi</FormLabel>
          </Flex>
          <Checkbox
            {...register("hasWifi")}
            setValue={(v: CheckedState) => setValue("hasWifi", !!v)}
          />
        </FormField>

        <FormField name="latitude">
          <Flex>
            <FormLabel>Latitude</FormLabel>
            <FormMessage match="valueMissing">Please fill out 😡</FormMessage>
          </Flex>
          <Form.Control asChild placeholder="Latitude">
            <Input
              type="number"
              required
              {...register("latitude", {
                valueAsNumber: true,
              })}
            />
          </Form.Control>
        </FormField>
        <FormField name="longitude">
          <Flex>
            <FormLabel>Longitude</FormLabel>
            <FormMessage match="valueMissing">Please fill out 😡</FormMessage>
          </Flex>
          <Form.Control asChild placeholder="Longitude">
            <Input
              type="number"
              required
              {...register("longitude", {
                valueAsNumber: true,
              })}
            />
          </Form.Control>
        </FormField>

        <FormField name="images">
          <FormLabel>Images</FormLabel>
          <FileUpload
            control={control}
            name="images"
            setValue={(file: File[]) => setValue("images", file)}
            isSuccess={createIsSuccess}
            value={watch("images")}
          />
        </FormField>
      </CardContent>

      <CardFooter>
        <Form.Submit asChild>
          <FormButton disabled={watch("images").length === 0}>
            {isLoading ? "Creating..." : "Post question"}
          </FormButton>
        </Form.Submit>
        {errorMessages && (
          <div style={{ textTransform: `capitalize` }}>
            {errorMessages.map((errMsg) => (
              <div key={errMsg}>{errMsg}</div>
            ))}
          </div>
        )}
      </CardFooter>
    </FormRoot>
  );
};

export default CreateStudySpotForm;