import { z } from "zod";

const imageSchema = z.object({
  id: z.number(),
  name: z.string(),
  dominantColour: z.string(),
  width: z.number(),
  height: z.number(),
  aspectRatio: z.number(),
  url: z.string(),
});

const getCurrentUserOutput = z.object({
  id: z.string(),
  username: z.string(),
  profilePicture: imageSchema.nullable(),
  description: z.string(),
  email: z.string(),
});

const createUserInput = z.object({
  username: z.string().max(30).min(1, { message: "Username is required." }),
  image: z.string().optional(),
  description: z.string().max(100),
});

const getUserByUsernameOutput = z
  .object({
    username: z.string(),
    profilePicture: imageSchema.nullable(),
    description: z.string(),
  })
  .nullable();

export { getCurrentUserOutput, createUserInput, getUserByUsernameOutput };
