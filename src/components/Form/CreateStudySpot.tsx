import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import * as Form from "@radix-ui/react-form";
import { type CheckedState } from "@radix-ui/react-checkbox";

import { api } from "~/utils/api";
import {
  // parseClientError,
  uploadImagesToS3UsingPresignedUrls,
} from "~/utils/helpers";

import { CardContent, CardFooter } from "~/components/UI/Card";
import {
  Button,
  Flex,
  FormField,
  FormLabel,
  FormMessage,
  FormRoot,
  Input,
} from "~/components/UI/Form";
import FileUpload from "~/components/UI/FileUpload";
import Checkbox from "~/components/UI/Checkbox";

const CreateStudySpotForm = () => {
  interface FormInput {
    name: string;
    hasWifi: boolean;
    latitude: number;
    longitude: number;
    images: File[];
  }

  const { register, handleSubmit, control, setValue, getValues, reset } =
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
  } = api.studySpots.createOne.useMutation({
    onSuccess: () => {
      reset();
      void apiUtils.studySpots.getNotValidated.invalidate();
    },
  });

  // const errorMessages = parseClientError(error);

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

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    const filesToSubmit = data.images.map((file) => file.type);
    getPresignedUrls({ contentTypes: filesToSubmit });
  };

  return (
    <FormRoot onSubmit={() => handleSubmit(onSubmit)}>
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
          />
        </FormField>
      </CardContent>

      <CardFooter>
        <Form.Submit asChild>
          <Button>Post question</Button>
        </Form.Submit>
        {/* {errorMessages && (
          <div style={{ textTransform: `capitalize` }}>
            {errorMessages.map((errMsg) => (
              <div key={errMsg}>{errMsg}</div>
            ))}
          </div>
        )} */}
        {createIsLoading || (presignedUrlsIsLoading && <div>Creating...</div>)}
      </CardFooter>
    </FormRoot>
  );
};

export default CreateStudySpotForm;
