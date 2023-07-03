import React, { useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import * as Form from "@radix-ui/react-form";
import { CheckIcon } from "@radix-ui/react-icons";

import { api } from "~/utils/api";

import { useDropzone } from "react-dropzone";

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
  CheckboxIndicator,
  CheckboxRoot,
  DropzoneFilesPreview,
  DropzoneRoot,
  Flex,
  FormField,
  FormLabel,
  FormMessage,
  FormRoot,
  Input,
} from "~/components/ui/Form";
import { uploadImagesToS3UsingPresignedUrls } from "~/utils/helpers";
import { TRPCClientError } from "@trpc/client";

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
    onSuccess: () => apiUtils.studySpots.getNotValidated.invalidate(),
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
    reset();
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
            <CheckboxComponent name="hasWifi" control={control} />
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

          <FileUploadV2 control={control} name="images" setValue={setValue} />
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

const CheckboxComponent = ({
  name,
  ...props
}: {
  name: string;
  [x: string]: any;
}) => (
  <Controller
    name={name}
    {...props}
    render={({ field }) => (
      <CheckboxRoot
        {...field}
        id={name}
        value={undefined}
        checked={field.value}
        onCheckedChange={field.onChange}
        style={{
          width: 30,
          height: 30,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
      </CheckboxRoot>
    )}
  />
);

function FileUploadV2({
  control,
  name,
  setValue,
}: {
  name: string;
  control: any;
  setValue: any;
}) {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      maxFiles: 8,
      maxSize: 4000000, // 4mb
      onDrop: (acceptedFiles) => {
        setValue(name, acceptedFiles);
      },
    });

  const renderedFiles = useMemo(() => {
    return acceptedFiles.map((file) => (
      <li key={file.name}>
        <img src={URL.createObjectURL(file)} />
      </li>
    ));
  }, [acceptedFiles]);

  return (
    <FormField name={name}>
      <FormLabel>Images</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <DropzoneRoot
            style={{
              backgroundColor: isDragActive ? `#e5e5e5` : "#f5f5f5",
              height: "100px",
            }}
            {...getRootProps()}
          >
            <Input
              type={"hidden"}
              {...getInputProps({
                onBlur,
                onChange,
              })}
            />
            <p style={{ margin: `auto` }}>
              {isDragActive
                ? "Fire in the hole!"
                : "Drag some files here, or click to select"}
            </p>
          </DropzoneRoot>
        )}
      />
      {acceptedFiles.length ? (
        <aside>
          <h3 style={{ marginBottom: `0.5rem` }}>Files pending upload:</h3>
          <DropzoneFilesPreview>{renderedFiles}</DropzoneFilesPreview>
        </aside>
      ) : null}
    </FormField>
  );
}
