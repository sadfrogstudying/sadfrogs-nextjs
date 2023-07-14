import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import slugify from "slugify";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getImagesMeta } from "~/utils/server-helpers";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(6, "1 m"),
  analytics: true,
});

const studySpotSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isValidated: z.boolean(),

  // general (if people submit a study spot they must fill these out)
  name: z.string(),
  slug: z.string(),
  rating: z.number(),
  wifi: z.boolean(),
  powerOutlets: z.string(),
  noiseLevel: z.string(),
  venueType: z.string(),
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

  // location
  placeId: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  address: z.string().nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),

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
  canStudyForLong: z.string().nullable(),

  // ambiance
  vibe: z.string().nullable(),
  comfort: z.string().nullable(),
  views: z.string().nullable(),
  sunlight: z.boolean().nullable(),
  temperature: z.string().nullable(),
  music: z.string().nullable(),
  lighting: z.string().nullable(),

  // crowdedness
  distractions: z.string().nullable(),
  crowdedness: z.string().nullable(),

  // surroundings
  naturalSurroundings: z.string().nullable(),
  proximityToAmenities: z.string().nullable(),

  // amenities
  drinks: z.boolean().nullable(),
  food: z.boolean().nullable(),
  studyBreakFacilities: z.string().nullable(),
});

export const studySpotsRouter = createTRPCRouter({
  /**
   *
   * Get all
   *
   */
  getAll: publicProcedure
    .meta({ openapi: { method: "GET", path: "/studyspots.getAll" } })
    .input(z.void())
    .output(studySpotSchema.array())
    .query(async ({ ctx }) => {
      const studySpots = await ctx.prisma.studySpot.findMany({
        where: {
          isValidated: true,
        },
        include: {
          images: true,
          openingHours: true,
        },
      });

      return studySpots;
    }),
  /**
   *
   * Get not validated
   *
   */
  getNotValidated: publicProcedure
    .meta({ openapi: { method: "GET", path: "/studyspots.getNotValidated" } })
    .input(z.void())
    .output(studySpotSchema.array())
    .query(async ({ ctx }) => {
      const studySpots = await ctx.prisma.studySpot.findMany({
        where: {
          isValidated: false,
        },
        include: {
          images: true,
          openingHours: true,
        },
      });

      return studySpots;
    }),
  /**
   *
   * Create One
   *
   */
  createOne: publicProcedure
    .meta({ openapi: { method: "POST", path: "/studyspots.createOne" } })
    .input(
      z.object({
        name: z.string().min(1),
        hasWifi: z.boolean(),
        location: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        imageUrls: z.string().array(),
      })
    )
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.ip);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });

      try {
        const newImages = await getImagesMeta(input.imageUrls);
        const slug = slugify(input.name, {
          remove: /[*+~.()'"!:@]/g,
          lower: true,
          strict: true,
        });

        await ctx.prisma.studySpot.create({
          data: {
            name: input.name,
            slug: slug,
            wifi: input.hasWifi,
            rating: 0,
            powerOutlets: "",
            noiseLevel: "",
            venueType: "",
            images: {
              createMany: {
                data: newImages,
              },
            },
          },
        });

        return true;
      } catch (error: unknown) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong creating a study spot",
        });
      }
    }),
  /**
   *
   * Get One
   *
   */
  getOne: publicProcedure
    .meta({ openapi: { method: "GET", path: "/studyspots.getOne" } })
    .input(z.object({ slug: z.string() }))
    .output(studySpotSchema)
    .query(async ({ ctx, input }) => {
      const studySpot = await ctx.prisma.studySpot.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          images: true,
          openingHours: true,
        },
      });

      if (!studySpot)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return studySpot;
    }),
  /** Throws an error if name exists */
  checkIfNameExists: publicProcedure
    .meta({
      openapi: { method: "POST", path: "/studyspots.checkIfNameExists" },
    })
    .input(z.object({ name: z.string() }))
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.ip);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });

      const studySpot = await ctx.prisma.studySpot.findUnique({
        where: {
          name: input.name,
        },
      });

      if (studySpot)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Study spot already exists",
        });

      return true;
    }),
  /**
   *
   * Delete One
   *
   */
  deleteOne: publicProcedure
    .meta({ openapi: { method: "DELETE", path: "/studyspots.deleteOne" } })
    .input(z.object({ id: z.number() }))
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const deletedStudySpot = await ctx.prisma.studySpot.delete({
        where: {
          id: input.id,
        },
        include: {
          images: {
            select: {
              url: true,
            },
          },
        },
      });

      if (!deletedStudySpot)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      // Delete uploaded images in s3
      const { s3 } = ctx;
      try {
        await Promise.all(
          deletedStudySpot.images.map(async (image) => {
            const key = image.url.split(".com/")[1]; // extract filename from s3 url, as long as not nested in folders
            const bucketParams = { Bucket: env.BUCKET_NAME, Key: key };
            const data = await s3.send(new DeleteObjectCommand(bucketParams));
            console.log("Success. Object deleted.", data);
            return data; // For unit tests.
          })
        );
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting image from bucket",
        });
      }

      // Delete associated images
      await ctx.prisma.image.deleteMany({
        where: {
          studySpotId: deletedStudySpot.id,
        },
      });

      // Delete associated opening hours
      await ctx.prisma.openingHours.deleteMany({
        where: {
          studySpotId: deletedStudySpot.id,
        },
      });

      return true;
    }),
  /**
   *
   * Get Paths
   *
   */
  getAllPaths: publicProcedure
    .meta({ openapi: { method: "GET", path: "/studyspots.getAllPaths" } })
    .input(z.void())
    .output(z.string().array())
    .query(async ({ ctx }) => {
      const studySpots = await ctx.prisma.studySpot.findMany({
        where: {
          isValidated: false,
        },
        select: {
          slug: true,
        },
      });

      return studySpots.map((studySpot) => studySpot.slug);
    }),
});
