import * as z from "zod";

const FileListImagesSchema = z.custom<File[]>().superRefine((files, ctx) => {
  if (files.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Image must be provided",
    });
    return false;
  }

  const MAX_FILES = 8;
  const MAX_FILE_SIZE = 1024 * 1024 * 2;
  const ACCEPTED_IMAGE_TYPES = [
    "image/webp",
    "image/png",
    "image/svg",
    "image/jpg",
    "image/jpeg",
  ];

  if (files.length > MAX_FILES) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Must be less than ${MAX_FILES} images`,
    });
    return false;
  }

  for (const file of files) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File must be a valid image type",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
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
