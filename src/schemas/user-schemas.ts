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
  username: z.string().min(1, { message: "Username is required." }),
  image: z.string().optional(),
  description: z.string(),
});

export { getCurrentUserOutput, createUserInput };
