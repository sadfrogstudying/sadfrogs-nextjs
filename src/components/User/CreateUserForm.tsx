import type { z } from "zod";
import type { createUserInput } from "~/schemas/user-schemas";
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

const defaultValues = {
  username: "",
  image: [],
  description: "",
};

type CreateUserInput = z.infer<typeof createUserInput>;
type FormInput = Omit<CreateUserInput, "image"> & {
  image: File[];
};

const CreateUserForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const form = useForm<FormInput>({
    defaultValues,
  });

  const apiUtils = api.useContext();

  const {
    mutate: createUser,
    error: createError,
    isLoading: createIsLoading,
  } = api.user.createUser.useMutation({
    onSuccess: () => {
      void apiUtils.user.getCurrentUser.invalidate();
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
      if (!presignedUrls.length) return;
      const formValues = form.getValues();

      const imageUrls = await uploadImagesToS3UsingPresignedUrls({
        presignedUrls: presignedUrls,
        acceptedFiles: formValues.image,
      });

      createUser({
        ...formValues,
        image: imageUrls[0],
      });
    },
  });

  const {
    mutate: checkIfUsernameExists,
    error: nameExistsError,
    isLoading: nameExistsLoading,
  } = api.user.checkIfUsernameExists.useMutation({
    onSuccess: () => {
      const filesToSubmit = form.getValues("image").map((file) => ({
        contentLength: file.size,
        contentType: file.type,
      }));

      getPresignedUrls({ files: filesToSubmit });
    },
  });

  const submitHandler = form.handleSubmit((data) => {
    checkIfUsernameExists({ username: data.username });
  });

  const isLoading = createIsLoading || getUrlsIsLoading || nameExistsLoading;
  const zodErrorMessages = parseZodClientError(createError?.data?.zodError);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submitHandler();
        }}
      >
        <div className="space-y-4">
          <FormSectionHeader
            title="Create an account"
            description="Use this form to create an account"
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
            {isLoading ? "Creating..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateUserForm;
