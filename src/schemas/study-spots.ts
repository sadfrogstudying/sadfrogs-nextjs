import * as z from "zod";

const imageSchema = z.object({
  id: z.number(),
  name: z.string(),
  dominantColour: z.string(),
  width: z.number(),
  height: z.number(),
  aspectRatio: z.number(),
  url: z.string(),
});
const openingHoursSchema = z.object({
  id: z.number(),
  day: z.number(),
  openingTime: z.string(),
  closingTime: z.string(),
});
const createOneInputSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  rating: z.number().max(5),
  wifi: z.boolean(),
  powerOutlets: z.boolean(),
  noiseLevel: z.string().min(1, { message: "Required" }),
  venueType: z.string().min(1, { message: "Required" }),
  images: z
    .string()
    .array()
    .min(1, { message: "At least one image is required." }),
  placeId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  openingHours: openingHoursSchema.array().optional(),
  canStudyForLong: z.boolean().nullable().optional(),
  comfort: z.string().optional(),
  views: z.string().optional(),
  sunlight: z.boolean().nullable().optional(),
  temperature: z.string().optional(),
  music: z.string().optional(),
  lighting: z.string().optional(),
  distractions: z.string().optional(),
  crowdedness: z.string().optional(),
  proximityToAmenities: z.string().optional(),
  drinks: z.boolean().nullable().optional(),
  food: z.boolean().nullable().optional(),
  studyBreakFacilities: z.string().optional(),
  imagesToDelete: z.number().array().optional(),
});
const studySpotSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isValidated: z.boolean(),
  slug: z.string(),
  name: z.string(),
  rating: z.number().max(5),
  wifi: z.boolean(),
  powerOutlets: z.boolean(),
  noiseLevel: z.string(),
  venueType: z.string(),
  images: imageSchema.array(),
  placeId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  country: z.string(),
  city: z.string(),
  state: z.string(),
  openingHours: openingHoursSchema.array(),
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
const getValidatedOutputSchema = studySpotSchema
  .pick({
    name: true,
    slug: true,
    id: true,
    address: true,
    wifi: true,
    music: true,
    powerOutlets: true,
    images: true,
    openingHours: true,
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
    openingHours: true,
  })
  .array();
const creatependingEditInputSchema = createOneInputSchema.partial().extend({
  images: z.string().array().optional(),
  studySpotId: z.number().optional(),
  imagesToDelete: z.number().array().optional(),
  canStudyForLong: z.boolean().nullable().optional(),
  sunlight: z.boolean().nullable().optional(),
  drinks: z.boolean().nullable().optional(),
  food: z.boolean().nullable().optional(),
});
const pendingEditOutputSchema = studySpotSchema.partial().extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().nullable(),
  slug: z.string().nullable(),
  rating: z.number().max(5).nullable(),
  wifi: z.boolean().nullable(),
  powerOutlets: z.boolean().nullable(),
  noiseLevel: z.string().nullable(),
  venueType: z.string().nullable(),
  placeId: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  address: z.string().nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  openingHours: openingHoursSchema.array(),
  canStudyForLong: z.boolean().nullable(),
  comfort: z.string().nullable(),
  views: z.string().nullable(),
  sunlight: z.boolean().nullable(),
  temperature: z.string().nullable(),
  music: z.string().nullable(),
  lighting: z.string().nullable(),
  distractions: z.string().nullable(),
  crowdedness: z.string().nullable(),
  proximityToAmenities: z.string().nullable(),
  drinks: z.boolean().nullable(),
  food: z.boolean().nullable(),
  studyBreakFacilities: z.string().nullable(),
  studySpotId: z.number(),
  studySpot: z.object({ name: z.string(), slug: z.string() }),
  pendingImagesToAdd: imageSchema.array(),
  pendingImagesToDelete: z.object({ image: imageSchema }).array(),
});

type StudySpotQueryInput = z.infer<typeof createOneInputSchema>;
type StudySpotFormInputs = Omit<StudySpotQueryInput, "images"> & {
  images: File[];
};
type GetOneOutput = z.infer<typeof studySpotSchema>;
type GetNotValidatedOutput = z.infer<typeof getNotValidatedOutputSchema>;
type GetNotValidatedElementOutput = z.infer<
  typeof getNotValidatedOutputSchema.element
>;
type Image = z.infer<typeof imageSchema>;
type PendingEditQueryOutput = z.infer<typeof pendingEditOutputSchema>;

export {
  // Study Spot Schemas
  createOneInputSchema,
  studySpotSchema,
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
  Image,
  PendingEditQueryOutput,
};
