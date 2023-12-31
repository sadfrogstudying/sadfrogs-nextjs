import axios from "axios";
import type { typeToFlattenedError } from "zod";

/** Returns the urls of the uploaded images */
export const uploadImagesToS3UsingPresignedUrls = async ({
  presignedUrls,
  acceptedFiles,
}: {
  presignedUrls: string[];
  acceptedFiles: File[];
}) => {
  if (presignedUrls.length === 0) return [];

  try {
    const promises = presignedUrls.map(async (url, i) => {
      const res = await axios.put(url, acceptedFiles[i], {
        headers: {
          "Content-Type": acceptedFiles[i]?.type,
        },
      });

      console.log(res);
      console.log("Successfully uploaded ", acceptedFiles[i]?.name);
    });

    await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("Something went wrong uploading image to storage");
  }

  const imageUrls = presignedUrls.map((url) => {
    const imageUrl = url.split("?")[0];
    if (typeof imageUrl !== "string")
      throw new Error("Something went wrong getting image url");

    return imageUrl;
  });

  return imageUrls;
};

export const parseZodClientError = (
  zodError:
    | typeToFlattenedError<string[] | undefined, string>
    | null
    | undefined
) => {
  const fieldErrors = zodError?.fieldErrors;
  const fieldErrorsEntries = fieldErrors ? Object.entries(fieldErrors) : [];
  const errorMessages = fieldErrorsEntries.map(([key, value]) => [
    key,
    value && value[0] ? value[0] : "",
  ]);

  return errorMessages;
};

/*
 * Prevents props with "$" from being sent to the underlying DOM element
 * Without this, would get errors like: Warning: Received `false` for a non-boolean attribute `someAttribute`.
 */
export const transientOptions = {
  shouldForwardProp: (propName: string) => !propName.startsWith("$"),
};

export function returnValueIfNotUndefined<T>(x: T): T | undefined {
  if (x === undefined) return undefined;
  return x;
}
