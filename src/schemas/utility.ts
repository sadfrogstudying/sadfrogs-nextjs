import * as z from "zod";

interface Args {
  maxFiles?: number;
  minFiles?: number;
  maxFileSize?: number;
  acceptedImageTypes?: string[];
}

/**
 * By default allows any length of images
 * I assume, if we upload images, it should validate the file type still
 */
const FileListImagesSchema = ({
  maxFiles = 8,
  minFiles = 0,
  maxFileSize = 1024 * 1024 * 2,
  acceptedImageTypes = [
    "image/webp",
    "image/png",
    "image/svg",
    "image/jpg",
    "image/jpeg",
  ],
}: Args = {}) =>
  z.custom<File[]>().superRefine((files, ctx) => {
    if (!files)
      throw new Error(
        "Nothing was provided to this function, perhaps the property doesn't exist or was named incorrectly."
      );

    if (files.length < minFiles) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Must be at least ${minFiles} image(s)`,
      });
      return false;
    }

    if (files.length > maxFiles) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Must be less than ${maxFiles} images`,
      });
      return false;
    }

    for (const file of files) {
      if (!acceptedImageTypes.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File must be a valid image type",
        });
        return false;
      }

      if (file.size > maxFileSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File must be less than 2MB",
        });
        return false;
      }
    }

    return true;
  });

export { FileListImagesSchema };
