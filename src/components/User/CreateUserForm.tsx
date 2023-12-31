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
import { FileListImagesSchema } from "~/schemas/utility";
import { useRouter } from "next/router";

const defaultValues = {
  username: "",
  image: [],
  description: "",
};

type CreateUserInput = z.infer<typeof createUserInput>;
type FormInput = Omit<CreateUserInput, "image"> & {
  image: File[];
};
const createUserFormInputSchema = createUserInput.extend({
  image: FileListImagesSchema({ maxFiles: 1 }),
});

const CreateUserForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const form = useForm<FormInput>({
    resolver: zodResolver(createUserFormInputSchema),
    defaultValues,
  });

  const apiUtils = api.useContext();
  const router = useRouter();

  const {
    mutate: createUser,
    error: createError,
    isLoading: createIsLoading,
  } = api.user.createUser.useMutation({
    onSuccess: () => {
      void apiUtils.user.getCurrentUser.invalidate();
      void router.push(`/user/${form.getValues("username")}`);
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

      createUser({
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
            description="You need to create an account to add new spots and edit existing ones"
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
          <div className="flex justify-between items-center pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Submit"}
            </Button>

            <a className="pointer-events-auto" href="/api/auth/logout">
              Logout
            </a>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateUserForm;
