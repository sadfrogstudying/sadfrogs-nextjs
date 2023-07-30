import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import slugify from "slugify";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getImagesMeta } from "~/utils/server-helpers";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";
import {
  pendingEditInputSchema,
  pendingEditOutputSchema,
  studySpotInputSchema,
  studySpotOutputSchema,
} from "~/schemas/study-spots";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(6, "1 m"),
  analytics: true,
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
    .output(studySpotOutputSchema.array())
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
    .output(studySpotOutputSchema.array())
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
    .input(studySpotInputSchema)
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.ip);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });

      try {
        const newImages = await getImagesMeta(input.images);
        const slug = slugify(input.name, {
          remove: /[*+~.()'"!:@]/g,
          lower: true,
          strict: true,
        });

        await ctx.prisma.studySpot.create({
          data: {
            name: input.name,
            slug: slug,
            wifi: input.wifi,
            rating: input.rating,
            powerOutlets: input.powerOutlets,
            noiseLevel: input.noiseLevel,
            venueType: input.venueType,
            images: {
              createMany: {
                data: newImages,
              },
            },

            placeId: input.placeId,
            latitude: input.latitude,
            longitude: input.longitude,
            address: input.address,
            country: input.country,
            city: input.city,
            state: input.state,

            ...(input.openingHours && {
              openingHours: {
                createMany: {
                  data: input.openingHours,
                },
              },
            }),

            canStudyForLong: input.canStudyForLong,

            vibe: input.vibe,
            comfort: input.comfort,
            views: input.views,
            sunlight: input.sunlight,
            temperature: input.temperature,
            music: input.music,
            lighting: input.lighting,

            distractions: input.distractions,
            crowdedness: input.crowdedness,

            naturalSurroundings: input.naturalSurroundings,
            proximityToAmenities: input.proximityToAmenities,

            drinks: input.drinks,
            food: input.food,
            studyBreakFacilities: input.studyBreakFacilities,
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
    .output(studySpotOutputSchema)
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
  /**
   *
   * Pending Edits: Get all
   *
   */
  getAllPendingEdits: publicProcedure
    .meta({
      openapi: { method: "GET", path: "/studyspots.getAllPendingEdits" },
    })
    .input(z.void())
    .output(pendingEditOutputSchema.array())
    .query(async ({ ctx }) => {
      const allPendingEdits = await ctx.prisma.pendingEditStudySpot.findMany({
        include: {
          images: true,
          openingHours: true,
          imagesToDelete: true,
          studySpot: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      });

      return allPendingEdits;
    }),
  /**
   *
   * Pending Edits: Create One
   *
   */
  createPendingEdit: publicProcedure
    .meta({
      openapi: { method: "POST", path: "/studyspots.createPendingEdit" },
    })
    .input(pendingEditInputSchema)
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.ip);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });

      try {
        let newImages;
        let slug;

        if (input.images?.length !== 0 && input.images)
          newImages = await getImagesMeta(input.images);
        if (input.name)
          slug = slugify(input.name, {
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: true,
          });

        await ctx.prisma.pendingEditStudySpot.create({
          data: {
            name: input.name,
            slug: slug,
            wifi: input.wifi,
            rating: input.rating,
            powerOutlets: input.powerOutlets,
            noiseLevel: input.noiseLevel,
            venueType: input.venueType,

            images: {
              createMany: newImages && { data: newImages },
            },

            placeId: input.placeId,
            latitude: input.latitude,
            longitude: input.longitude,
            address: input.address,
            country: input.country,
            city: input.city,
            state: input.state,

            openingHours: {
              createMany: input.openingHours && {
                data: input.openingHours,
              },
            },

            canStudyForLong: input.canStudyForLong,

            vibe: input.vibe,
            comfort: input.comfort,
            views: input.views,
            sunlight: input.sunlight,
            temperature: input.temperature,
            music: input.music,
            lighting: input.lighting,

            distractions: input.distractions,
            crowdedness: input.crowdedness,

            naturalSurroundings: input.naturalSurroundings,
            proximityToAmenities: input.proximityToAmenities,

            drinks: input.drinks,
            food: input.food,
            studyBreakFacilities: input.studyBreakFacilities,

            studySpot: {
              connect: {
                id: input.studySpotId,
              },
            },
            imagesToDelete: {
              connect: input.imagesToDelete?.map((id) => ({ id })),
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
  acceptPendingEdit: publicProcedure
    .meta({
      openapi: { method: "POST", path: "/studyspots.acceptPendingEdit" },
    })
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pendingEdit = await ctx.prisma.pendingEditStudySpot.findUnique({
        where: {
          id: input.id,
        },
        include: {
          images: true,
          openingHours: true,
          imagesToDelete: true,
          studySpot: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!pendingEdit) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.$transaction([
        ctx.prisma.studySpot.update({
          where: {
            id: pendingEdit.studySpot.id,
          },
          data: {
            name: pendingEdit.name || undefined,
            slug: pendingEdit.slug || undefined,
            wifi: pendingEdit.wifi || undefined,
            rating: pendingEdit.rating || undefined,
            powerOutlets: pendingEdit.powerOutlets || undefined,
            noiseLevel: pendingEdit.noiseLevel || undefined,
            venueType: pendingEdit.venueType || undefined,
            images: {
              connect: pendingEdit.images.map((image) => ({ id: image.id })),
              disconnect: pendingEdit.imagesToDelete.map((image) => ({
                id: image.id,
              })),
            },

            placeId: pendingEdit.placeId || undefined,
            latitude: pendingEdit.latitude || undefined,
            longitude: pendingEdit.longitude || undefined,
            address: pendingEdit.address || undefined,
            country: pendingEdit.country || undefined,
            city: pendingEdit.city || undefined,
            state: pendingEdit.state || undefined,

            ...(pendingEdit.openingHours && {
              openingHours: {
                createMany: {
                  data: pendingEdit.openingHours || undefined,
                },
              },
            }),

            canStudyForLong: pendingEdit.canStudyForLong || undefined,

            vibe: pendingEdit.vibe || undefined,
            comfort: pendingEdit.comfort || undefined,
            views: pendingEdit.views || undefined,
            sunlight: pendingEdit.sunlight || undefined,
            temperature: pendingEdit.temperature || undefined,
            music: pendingEdit.music || undefined,
            lighting: pendingEdit.lighting || undefined,

            distractions: pendingEdit.distractions || undefined,
            crowdedness: pendingEdit.crowdedness || undefined,

            naturalSurroundings: pendingEdit.naturalSurroundings || undefined,
            proximityToAmenities: pendingEdit.proximityToAmenities || undefined,

            drinks: pendingEdit.drinks || undefined,
            food: pendingEdit.food || undefined,
            studyBreakFacilities: pendingEdit.studyBreakFacilities || undefined,
          },
        }),
        ctx.prisma.pendingEditStudySpot.update({
          where: {
            id: input.id,
          },
          data: {
            images: {
              set: [],
            },
            imagesToDelete: {
              set: [],
            },
          },
        }),
        ctx.prisma.pendingEditStudySpot.delete({
          where: {
            id: input.id,
          },
        }),
      ]);

      if (pendingEdit.imagesToDelete.length > 0) {
        // Delete uploaded images in s3
        const { s3 } = ctx;
        try {
          await Promise.all(
            pendingEdit.imagesToDelete.map(async (image) => {
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

        await Promise.all(
          pendingEdit.imagesToDelete.map(async (image) => {
            await ctx.prisma.image.delete({
              where: {
                id: image.id,
              },
            });
          })
        );
      }

      return true;
    }),
});
