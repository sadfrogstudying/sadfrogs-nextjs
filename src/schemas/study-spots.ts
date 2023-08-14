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
const studySpotInputSchema = z.object({
  name: z.string().min(1),
  rating: z.number().max(5),
  wifi: z.boolean(),
  powerOutlets: z.boolean(),
  noiseLevel: z.string().min(1),
  venueType: z.string().min(1),
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
  canStudyForLong: z.string().optional(),
  vibe: z.string().optional(),
  comfort: z.string().optional(),
  views: z.string().optional(),
  sunlight: z.boolean().optional(),
  temperature: z.string().optional(),
  music: z.string().optional(),
  lighting: z.string().optional(),
  distractions: z.string().optional(),
  crowdedness: z.string().optional(),
  naturalSurroundings: z.string().optional(),
  proximityToAmenities: z.string().optional(),
  drinks: z.boolean().optional(),
  food: z.boolean().optional(),
  studyBreakFacilities: z.string().optional(),
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
  canStudyForLong: z.string(),
  vibe: z.string(),
  comfort: z.string(),
  views: z.string(),
  sunlight: z.boolean(),
  temperature: z.string(),
  music: z.string(),
  lighting: z.string(),
  distractions: z.string(),
  crowdedness: z.string(),
  naturalSurroundings: z.string(),
  proximityToAmenities: z.string(),
  drinks: z.boolean(),
  food: z.boolean(),
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
const pendingEditInputSchema = studySpotInputSchema.partial().extend({
  images: z.string().array().optional(),
  studySpotId: z.number().optional(),
  imagesToDelete: z.number().array().optional(),
});
const pendingEditOutputSchema = studySpotSchema.partial().extend({
  id: z.string(),
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
  canStudyForLong: z.string().nullable(),
  vibe: z.string().nullable(),
  comfort: z.string().nullable(),
  views: z.string().nullable(),
  sunlight: z.boolean().nullable(),
  temperature: z.string().nullable(),
  music: z.string().nullable(),
  lighting: z.string().nullable(),
  distractions: z.string().nullable(),
  crowdedness: z.string().nullable(),
  naturalSurroundings: z.string().nullable(),
  proximityToAmenities: z.string().nullable(),
  drinks: z.boolean().nullable(),
  food: z.boolean().nullable(),
  studyBreakFacilities: z.string().nullable(),
  studySpotId: z.number(),
  studySpot: z.object({ name: z.string(), slug: z.string() }),
  pendingImagesToAdd: imageSchema.array(),
  pendingImagesToDelete: z.object({ image: imageSchema }).array(),
});

type StudySpotQueryInput = z.infer<typeof studySpotInputSchema>;
type StudySpotFormInputs = Omit<StudySpotQueryInput, "images"> & {
  images: File[];
};
type GetOneOutput = z.infer<typeof studySpotSchema>;
type GetNotValidatedOutput = z.infer<typeof getNotValidatedOutputSchema>;
type GetNotValidatedElementOutput = z.infer<
  typeof getNotValidatedOutputSchema.element
>;
type Image = z.infer<typeof imageSchema>;
type PendingEditQueryInput = z.infer<typeof pendingEditInputSchema>;
type PendingEditFormInputs = Omit<PendingEditQueryInput, "images"> & {
  images: File[];
};
type PendingEditQueryOutput = z.infer<typeof pendingEditOutputSchema>;

export {
  // Study Spot Schemas
  studySpotInputSchema,
  studySpotSchema,
  getValidatedOutputSchema,
  getNotValidatedOutputSchema,
  getNotValidatedForMapOutputSchema,
  // Pending Study Spot Schemas
  pendingEditInputSchema,
  pendingEditOutputSchema,
};
export type {
  StudySpotFormInputs,
  GetOneOutput,
  GetNotValidatedOutput,
  GetNotValidatedElementOutput,
  Image,
  PendingEditFormInputs,
  PendingEditQueryOutput,
};
