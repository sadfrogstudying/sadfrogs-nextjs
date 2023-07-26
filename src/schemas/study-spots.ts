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

const studySpotOutputSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isValidated: z.boolean(),
  slug: z.string(),

  // general (if people submit a study spot they must fill these out)
  name: z.string(),
  rating: z.number(),
  wifi: z.boolean(),
  powerOutlets: z.boolean(),
  noiseLevel: z.string(),
  venueType: z.string(),
  images: z
    .object({
      id: z.number(),
      url: z.string(),
      dominantColour: z.string(),
      width: z.number(),
      height: z.number(),
      aspectRatio: z.number(),
    })
    .array(),

  // location
  placeId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  country: z.string(),
  city: z.string(),
  state: z.string(),

  // hours
  openingHours: z
    .object({
      id: z.number(),
      day: z.number(),
      openingTime: z.string(),
      closingTime: z.string(),
    })
    .array(),

  // etiquette
  canStudyForLong: z.string(),

  // ambiance
  vibe: z.string(),
  comfort: z.string(),
  views: z.string(),
  sunlight: z.boolean(),
  temperature: z.string(),
  music: z.string(),
  lighting: z.string(),

  // crowdedness
  distractions: z.string(),
  crowdedness: z.string(),

  // surroundings
  naturalSurroundings: z.string(),
  proximityToAmenities: z.string(),

  // amenities
  drinks: z.boolean(),
  food: z.boolean(),
  studyBreakFacilities: z.string(),
});

type StudySpotInput = z.infer<typeof studySpotInputSchema>;
type StudySpotInputV2 = Omit<StudySpotInput, "images"> & { images: File[] };

export { studySpotInputSchema, studySpotOutputSchema };
export type { StudySpotInputV2 };
