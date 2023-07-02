import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getImagesMeta } from "~/utils/server-helpers";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const studySpotsRouter = createTRPCRouter({
  /**
   *
   * Get all
   *
   */
  getAll: publicProcedure
    .meta({ openapi: { method: "GET", path: "/studyspots.getall" } })
    .input(z.void())
    .output(
      z
        .object({
          id: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
          name: z.string(),
          hasWifi: z.boolean(),
          isValidated: z.boolean(),
          location: z.object({
            id: z.number(),
            lat: z.number(),
            lng: z.number(),
          }),
          images: z
            .object({
              url: z.string(),
              dominantColour: z.string(),
              width: z.number(),
              height: z.number(),
              aspectRatio: z.number(),
            })
            .array(),
        })
        .array()
    )
    .query(async ({ ctx }) => {
      const studySpots = await ctx.prisma.studySpot.findMany({
        where: {
          isValidated: true,
        },
        include: {
          location: true,
          images: true,
        },
      });

      return studySpots;
    }),
  /**
   *
   * Get getUnvalidated
   *
   */
  getNotValidated: publicProcedure
    .meta({ openapi: { method: "GET", path: "/studyspots.getNotValidated" } })
    .input(z.void())
    .output(
      z
        .object({
          id: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
          name: z.string(),
          hasWifi: z.boolean(),
          isValidated: z.boolean(),
          location: z.object({
            id: z.number(),
            lat: z.number(),
            lng: z.number(),
          }),
          images: z
            .object({
              url: z.string(),
              dominantColour: z.string(),
              width: z.number(),
              height: z.number(),
              aspectRatio: z.number(),
            })
            .array(),
        })
        .array()
    )
    .query(async ({ ctx }) => {
      const studySpots = await ctx.prisma.studySpot.findMany({
        where: {
          isValidated: false,
        },
        include: {
          location: true,
          images: true,
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
    .meta({ openapi: { method: "POST", path: "/studyspots.createone" } })
    .input(
      z.object({
        name: z.string().min(2),
        hasWifi: z.boolean(),
        location: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
        imageUrls: z.string().array(),
      })
    )
    .output(
      z.object({
        id: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),
        name: z.string(),
        hasWifi: z.boolean(),
        location: z.object({
          id: z.number(),
          lat: z.number(),
          lng: z.number(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.ip);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const newImages = await getImagesMeta(input.imageUrls);

      const newStudySpot = await ctx.prisma.studySpot.create({
        data: {
          name: input.name,
          hasWifi: input.hasWifi,
          location: {
            create: {
              lat: input.location.lat,
              lng: input.location.lng,
            },
          },
          images: {
            createMany: {
              data: newImages,
            },
          },
        },
        include: {
          location: true, // Include all location in the returned object
        },
      });

      return newStudySpot;
    }),
  /**
   *
   * Get One
   *
   */
  getOne: publicProcedure
    .meta({ openapi: { method: "GET", path: "/studyspots.getone" } })
    .input(z.object({ id: z.number() }))
    .output(
      z.object({
        id: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),
        name: z.string(),
        hasWifi: z.boolean(),
        location: z.object({
          id: z.number(),
          lat: z.number(),
          lng: z.number(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const studySpot = await ctx.prisma.studySpot.findUnique({
        where: {
          id: input.id,
        },
        include: {
          location: true,
        },
      });

      if (!studySpot)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return studySpot;
    }),
  /**
   *
   * Delete One
   *
   */
  deleteOne: publicProcedure
    .meta({ openapi: { method: "DELETE", path: "/studyspots.deleteone" } })
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

      // Delete associated location
      await ctx.prisma.location.delete({
        where: {
          id: deletedStudySpot.locationId,
        },
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

      return true;
    }),
});
