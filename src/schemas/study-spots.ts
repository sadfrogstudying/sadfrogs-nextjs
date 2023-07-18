import { z } from "zod";

const studySpotInputSchema = z.object({
  // general (if people submit a study spot they must fill these out)
  name: z.string(),
  rating: z.number(),
  wifi: z.boolean(),
  powerOutlets: z.string(),
  noiseLevel: z.string(),
  venueType: z.string(),
  images: z.string().array(),

  // location
  placeId: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  address: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),

  // hours
  openingHours: z
    .object({
      day: z.number(),
      openingTime: z.string(),
      closingTime: z.string(),
    })
    .array()
    .nullable()
    .optional(),

  // etiquette
  canStudyForLong: z.string().nullable().optional(),

  // ambiance
  vibe: z.string().nullable().optional(),
  comfort: z.string().nullable().optional(),
  views: z.string().nullable().optional(),
  sunlight: z.boolean().nullable().optional(),
  temperature: z.string().nullable().optional(),
  music: z.string().nullable().optional(),
  lighting: z.string().nullable().optional(),

  // crowdedness
  distractions: z.string().nullable().optional(),
  crowdedness: z.string().nullable().optional(),

  // surroundings
  naturalSurroundings: z.string().nullable().optional(),
  proximityToAmenities: z.string().nullable().optional(),

  // amenities
  drinks: z.boolean().nullable().optional(),
  food: z.boolean().nullable().optional(),
  studyBreakFacilities: z.string().nullable().optional(),
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

export { studySpotInputSchema, studySpotSchema };
