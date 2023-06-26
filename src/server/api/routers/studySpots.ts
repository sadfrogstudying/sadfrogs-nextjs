import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
    .meta({ openapi: { method: "PUT", path: "/studyspots.createone" } })
    .input(
      z.object({
        name: z.string(),
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
    .input(z.number())
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
          id: input,
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
    .input(z.number())
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const deletedStudySpot = await ctx.prisma.studySpot.delete({
        where: {
          id: input,
        },
      });

      if (!deletedStudySpot)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return true;
    }),
});
