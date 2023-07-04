import React from "react";
import { TRPCClientError } from "@trpc/client";
import { SubmitHandler, useForm } from "react-hook-form";

import * as Form from "@radix-ui/react-form";

import { api } from "~/utils/api";
import { uploadImagesToS3UsingPresignedUrls } from "~/utils/helpers";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/Card";
import {
  Button,
  Flex,
  FormField,
  FormLabel,
  FormMessage,
  FormRoot,
  Input,
} from "~/components/ui/Form";
import Checkbox from "~/components/ui/Checkbox";
import FileUpload from "~/components/ui/FileUpload";

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
      apiUtils.studySpots.getNotValidated.invalidate();
      reset();
    },
  });

  /** Error Handling */
  const clientError =
    error instanceof TRPCClientError && JSON.parse(error?.message);
  const errorMessage: string[] | null = clientError
    ? clientError.map(
        (err: { path: string[]; message: string }) =>
          `${err.path.slice(-1)} - ${err.message}}`
      )
    : null;

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
    <Card>
      <FormRoot onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>New Study Spot</CardTitle>
          <CardDescription>
            Add a new study spot to SadFrogs ✍️.
          </CardDescription>
        </CardHeader>

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
            <FormLabel htmlFor="hasWifi">Has WiFi</FormLabel>
            <Checkbox name="hasWifi" control={control} />
          </FormField>

          <Flex>
            <FormField name="latitude">
              <Flex>
                <FormLabel>Latitude</FormLabel>
                <FormMessage match="valueMissing">
                  Please fill out 😡
                </FormMessage>
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
                <FormMessage match="valueMissing">
                  Please fill out 😡
                </FormMessage>
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
          </Flex>

          <FileUpload control={control} name="images" setValue={setValue} />
        </CardContent>

        <CardFooter>
          <Form.Submit asChild>
            <Button>Post question</Button>
          </Form.Submit>
          {errorMessage && (
            <div style={{ textTransform: `capitalize` }}>
              {errorMessage.map((errMsg) => (
                <div key={errMsg}>{errMsg}</div>
              ))}
            </div>
          )}
          {createIsLoading ||
            (presignedUrlsIsLoading && <div>Creating...</div>)}
        </CardFooter>
      </FormRoot>
    </Card>
  );
};

export default CreateStudySpotForm;
