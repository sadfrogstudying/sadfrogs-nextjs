import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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
          location: z.object({
            id: z.number(),
            lat: z.number(),
            lng: z.number(),
          }),
        })
        .array()
    )
    .query(async ({ ctx }) => {
      const studySpots = await ctx.prisma.studySpot.findMany({
        include: {
          location: true,
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
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
        });

      const newStudySpot = await ctx.prisma.studySpot.create({
        data: {
          name: input.name,
          hasWifi: input.hasWifi,
          location: {
            // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes
            create: {
              lat: input.location.lat,
              lng: input.location.lng,
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
      });

      if (!deletedStudySpot)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return true;
    }),
});
