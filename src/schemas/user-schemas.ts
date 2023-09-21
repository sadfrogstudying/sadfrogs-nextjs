import { z } from "zod";

const imageSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  dominantColour: z.string().max(100),
  width: z.number(),
  height: z.number(),
  aspectRatio: z.number(),
  url: z.string().max(100),
  author: z
    .object({
      username: z.string().max(100),
    })
    .nullish(),
});
const getCurrentUserOutput = z.object({
  id: z.string(),
  username: z.string(),
  profilePicture: imageSchema.nullable(),
  description: z.string(),
  email: z.string(),
});
const usernameRegex = /^[a-zA-Z0-9._-]+$/;
const createUserInput = z.object({
  username: z
    .string()
    .max(30)
    .regex(usernameRegex, {
      message:
        "Invalid username.  Can only contain letters, numbers, periods (.), underscores (_), and hyphens (-)",
    })
    .min(1, { message: "Username is required." }),
  image: z.string().optional(),
  description: z.string().max(100).optional(),
});
const getUserByUsernameOutput = z
  .object({
    username: z.string(),
    profilePicture: imageSchema.nullable(),
    description: z.string(),
  })
  .nullable();

type GetUserByUsernameOutput = z.infer<typeof getUserByUsernameOutput>;

export { getCurrentUserOutput, createUserInput, getUserByUsernameOutput };
export type { GetUserByUsernameOutput };
