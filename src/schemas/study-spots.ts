import * as z from "zod";

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
    .nullish()
    .optional(),
});
const createOneInputSchema = z.object({
  name: z.string().max(100).min(1, { message: "Required" }),
  rating: z.number().max(5).min(1),
  website: z.string().max(100).optional(),
  wifi: z.boolean(),
  powerOutlets: z.boolean(),
  description: z.string().max(2000),
  noiseLevel: z.string().max(100),
  venueType: z.string().max(100).min(1, { message: "Required" }),
  /** URLs in array */
  images: z
    .string()
    .array()
    .min(1, { message: "At least one image is required." }),
  placeId: z.string().max(100).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  canStudyForLong: z.boolean().optional(),
  comfort: z.string().max(100).optional(),
  views: z.string().max(100).optional(),
  sunlight: z.boolean().optional(),
  temperature: z.string().max(100).optional(),
  music: z.string().max(100).optional(),
  lighting: z.string().max(100).optional(),
  distractions: z.string().max(100).optional(),
  crowdedness: z.string().max(100).optional(),
  proximityToAmenities: z.string().max(100).optional(),
  drinks: z.boolean().optional(),
  food: z.boolean().optional(),
  studyBreakFacilities: z.string().max(100).optional(),
  imagesToDelete: z.number().array().optional(),
});
const studySpotSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isValidated: z.boolean(),
  slug: z.string(),
  name: z.string(),
  rating: z.number().max(5).min(1),
  website: z.string(),
  wifi: z.boolean(),
  powerOutlets: z.boolean(),
  description: z.string().max(2000),
  noiseLevel: z.string(),
  venueType: z.string(),
  images: imageSchema.array(),
  placeId: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string(),
  country: z.string(),
  city: z.string(),
  state: z.string(),
  canStudyForLong: z.boolean().nullable(),
  comfort: z.string(),
  views: z.string(),
  sunlight: z.boolean().nullable(),
  temperature: z.string(),
  music: z.string(),
  lighting: z.string(),
  distractions: z.string(),
  crowdedness: z.string(),
  proximityToAmenities: z.string(),
  drinks: z.boolean().nullable(),
  food: z.boolean().nullable(),
  studyBreakFacilities: z.string(),
});

// Router Output Schemas
const getOneSchema = studySpotSchema.extend({
  author: z
    .object({
      profilePicture: imageSchema.nullable(),
      username: z.string().max(100),
    })
    .nullable(),
});
const getValidatedOutputSchema = studySpotSchema
  .pick({
    name: true,
    slug: true,
    id: true,
    address: true,
    country: true,
    state: true,
    venueType: true,
    wifi: true,
    music: true,
    powerOutlets: true,
    images: true,
  })
  .array();
const getNotValidatedOutputSchema = getValidatedOutputSchema;
const getNotValidatedForMapOutputSchema = studySpotSchema
  .pick({
    name: true,
    address: true,
    latitude: true,
    longitude: true,
    slug: true,
    images: true,
  })
  .array();
const creatependingEditInputSchema = createOneInputSchema.partial().extend({
  studySpotId: z.number(),
  images: z.string().array().optional(),
});
const pendingEditOutputSchema = studySpotSchema.partial().extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().max(100).nullable(),
  slug: z.string().max(100).nullable(),
  rating: z.number().max(5).min(1).nullable(),
  website: z.string().max(100).nullable(),
  wifi: z.boolean().nullable(),
  powerOutlets: z.boolean().nullable(),
  description: z.string().max(2000).nullable(),
  noiseLevel: z.string().max(100).nullable(),
  venueType: z.string().max(100).nullable(),
  placeId: z.string().max(100).nullable(),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  address: z.string().max(100).nullable(),
  country: z.string().max(100).nullable(),
  city: z.string().max(100).nullable(),
  state: z.string().max(100).nullable(),
  canStudyForLong: z.boolean().nullable(),
  comfort: z.string().max(100).nullable(),
  views: z.string().max(100).nullable(),
  sunlight: z.boolean().nullable(),
  temperature: z.string().max(100).nullable(),
  music: z.string().max(100).nullable(),
  lighting: z.string().max(100).nullable(),
  distractions: z.string().max(100).nullable(),
  crowdedness: z.string().max(100).nullable(),
  proximityToAmenities: z.string().max(100).nullable(),
  drinks: z.boolean().nullable(),
  food: z.boolean().nullable(),
  studyBreakFacilities: z.string().max(100).nullable(),
  studySpotId: z.number(),
  studySpot: z.object({ name: z.string().max(100), slug: z.string().max(100) }),
  pendingImagesToAdd: imageSchema.array(),
  pendingImagesToDelete: z.object({ image: imageSchema }).array(),
});

type StudySpotQueryInput = z.infer<typeof createOneInputSchema>;
type StudySpotFormInputs = Omit<StudySpotQueryInput, "images"> & {
  images: File[];
  studySpotId?: number;
};
type GetOneOutput = z.infer<typeof studySpotSchema>;
type GetNotValidatedOutput = z.infer<typeof getNotValidatedOutputSchema>;
type GetNotValidatedElementOutput = z.infer<
  typeof getNotValidatedOutputSchema.element
>;
type GetNotValidatedForMapOutput = z.infer<
  typeof getNotValidatedForMapOutputSchema
>;
type Image = z.infer<typeof imageSchema>;
type PendingEditQueryOutput = z.infer<typeof pendingEditOutputSchema>;

export {
  // Study Spot Schemas
  createOneInputSchema,
  studySpotSchema,
  getOneSchema,
  getValidatedOutputSchema,
  getNotValidatedOutputSchema,
  getNotValidatedForMapOutputSchema,
  // Pending Study Spot Schemas
  creatependingEditInputSchema,
  pendingEditOutputSchema,
};
export type {
  StudySpotFormInputs,
  GetOneOutput,
  GetNotValidatedOutput,
  GetNotValidatedElementOutput,
  GetNotValidatedForMapOutput,
  Image,
  PendingEditQueryOutput,
};
