import * as z from "zod";

const studySpotInputSchema = z.object({
  // general (if people submit a study spot they must fill these out)
  name: z.string().min(1),
  rating: z.number(),
  wifi: z.boolean(),
  powerOutlets: z.boolean(),
  noiseLevel: z.string().min(1),
  venueType: z.string().min(1),
  images: z
    .string()
    .array()
    .min(1, { message: "At least one image is required." }),

  // location
  placeId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),

  // hours
  openingHours: z
    .object({
      day: z.number(),
      openingTime: z.string(),
      closingTime: z.string(),
    })
    .array()

    .optional(),

  // etiquette
  canStudyForLong: z.string().optional(),

  // ambiance
  vibe: z.string().optional(),
  comfort: z.string().optional(),
  views: z.string().optional(),
  sunlight: z.boolean().optional(),
  temperature: z.string().optional(),
  music: z.string().optional(),
  lighting: z.string().optional(),

  // crowdedness
  distractions: z.string().optional(),
  crowdedness: z.string().optional(),

  // surroundings
  naturalSurroundings: z.string().optional(),
  proximityToAmenities: z.string().optional(),

  // amenities
  drinks: z.boolean().optional(),
  food: z.boolean().optional(),
  studyBreakFacilities: z.string().optional(),
});

const studySpotSchema = studySpotInputSchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isValidated: z.boolean(),
  slug: z.string(),

  // general
  images: z
    .object({
      id: z.number(),
      studySpotId: z.number().nullable(),
      url: z.string(),
      dominantColour: z.string(),
      width: z.number(),
      height: z.number(),
      aspectRatio: z.number(),
    })
    .array(),

  // hours
  openingHours: z
    .object({
      id: z.number(),
      day: z.number(),
      openingTime: z.string(),
      closingTime: z.string(),
    })
    .array(),
});

const studySpotInputSchemaV2 = z.object({
  // general (if people submit a study spot they must fill these out)
  name: z.string(),
  rating: z.number(),
  wifi: z.boolean(),
  powerOutlets: z.boolean(),
  noiseLevel: z.string(),
  venueType: z.string(),
  images: z.string().array(),

  // // location
  placeId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),

  // hours
  openingHours: z
    .object({
      day: z.number(),
      openingTime: z.string(),
      closingTime: z.string(),
    })
    .array()
    .optional(),

  // etiquette
  canStudyForLong: z.string().optional(),

  // ambiance
  vibe: z.string().optional(),
  comfort: z.string().optional(),
  views: z.string().optional(),
  sunlight: z.boolean().optional(),
  temperature: z.string().optional(),
  music: z.string().optional(),
  lighting: z.string().optional(),

  // crowdedness
  distractions: z.string().optional(),
  crowdedness: z.string().optional(),

  // surroundings
  naturalSurroundings: z.string().optional(),
  proximityToAmenities: z.string().optional(),

  // amenities
  drinks: z.boolean().optional(),
  food: z.boolean().optional(),
  studyBreakFacilities: z.string().optional(),
});

type StudySpotInput = z.infer<typeof studySpotInputSchemaV2>;
type StudySpotInputV2 = Omit<StudySpotInput, "images"> & { images: File[] };

export { studySpotInputSchema, studySpotSchema };
export type { StudySpotInputV2 };
