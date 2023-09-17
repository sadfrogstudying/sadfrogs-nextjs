import type { z } from "zod";
import { createUserInput } from "~/schemas/user-schemas";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSectionHeader,
} from "~/components/UI/Form";
import { Input } from "~/components/UI/Input";
import FileInput from "../UI/FileInput";
import { Button } from "../UI/Button";
import { api } from "~/utils/api";
import {
  parseZodClientError,
  uploadImagesToS3UsingPresignedUrls,
} from "~/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";

type CreateUserInput = z.infer<typeof createUserInput>;
type FormInput = Omit<CreateUserInput, "image"> & {
  image: File[];
};

import { FileListImagesSchema } from "~/schemas/utility";
import { useRouter } from "next/router";

const editUserInput = createUserInput.extend({
  image: FileListImagesSchema(),
});

const EditUserForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const apiUils = api.useContext();
  const loggedInUser = apiUils.user.getCurrentUser.getData();

  const router = useRouter();

  const form = useForm<FormInput>({
    resolver: zodResolver(editUserInput),
    defaultValues: {
      username: loggedInUser?.username || "",
      description: loggedInUser?.description || "",
      image: [],
    },
  });

  const apiUtils = api.useContext();

  const getPresignedUrlsHandler = () => {
    const filesToSubmit = form.getValues("image").map((file) => ({
      contentLength: file.size,
      contentType: file.type,
    }));

    getPresignedUrls({ files: filesToSubmit });
  };

  const usernameDifferent = () => {
    const formValues = form.getValues();
    return loggedInUser?.username !== formValues.username;
  };

  const {
    mutate: updateUser,
    error: createError,
    isLoading: createIsLoading,
  } = api.user.updateCurrentUser.useMutation({
    onSuccess: () => {
      void apiUtils.user.getCurrentUser.invalidate();
      void apiUtils.user.getUserByUsername.invalidate();
      if (usernameDifferent()) {
        void router.push(`/user/${form.getValues("username")}`);
      }
      onSuccess?.();
      form.reset();
    },
  });

  const {
    mutate: getPresignedUrls,
    error: getUrlsError,
    isLoading: getUrlsIsLoading,
  } = api.s3.getPresignedUrls.useMutation({
    onSuccess: async (presignedUrls) => {
      const formValues = form.getValues();

      const imageUrls = await uploadImagesToS3UsingPresignedUrls({
        presignedUrls: presignedUrls,
        acceptedFiles: formValues.image,
      });

      updateUser({
        ...formValues,
        image: imageUrls[0] || undefined,
      });
    },
  });

  const {
    mutate: checkIfUsernameExists,
    error: nameExistsError,
    isLoading: nameExistsLoading,
  } = api.user.checkIfUsernameExists.useMutation({
    onSuccess: () => {
      getPresignedUrlsHandler();
    },
  });

  const submitHandler = form.handleSubmit((data) => {
    if (usernameDifferent()) {
      return checkIfUsernameExists({ username: data.username });
    }

    getPresignedUrlsHandler();
  });

  const isLoading = createIsLoading || getUrlsIsLoading || nameExistsLoading;
  const zodErrorMessages = parseZodClientError(createError?.data?.zodError);

  return (
    <Form {...form}>
      <form onSubmit={submitHandler}>
        <div className="space-y-4">
          <FormSectionHeader
            title="Update account"
            description="Use this form to update your account"
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileInput
                    setValue={(files) => form.setValue("image", files)}
                    value={field.value}
                    maxFiles={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
            disabled={isLoading}
            className="disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditUserForm;
