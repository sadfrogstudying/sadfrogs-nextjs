import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import slugify from "slugify";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  deleteImagesFromBucket,
  getBucketObjectNameFromUrl,
  getImagesMeta,
} from "~/utils/server-helpers";
import {
  getNotValidatedForMapOutputSchema,
  getNotValidatedOutputSchema,
  creatependingEditInputSchema,
  pendingEditOutputSchema,
  createOneInputSchema,
  getOneSchema,
} from "~/schemas/study-spots";
import { returnValueIfNotUndefined } from "~/utils/helpers";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(6, "1 m"),
  analytics: true,
});

const LOCAL_TOKEN =
  "MfMIbnUFvj0b4E+tK8TEi5LIU7eXSpV/4V3glScQ/Y5S1HVaJ3dR4XriSRvWH59dybAKMROQ9WdLO0gVJR/s3/fUqzHNzLezcDPUO5/cZeOffb0rJyAy2iXn5NZ4A3nT74OiNNxqDhyBWInrP5y6FV/LsRqdqA5LthcMCywtsp8ogz4vR9y4V2I3duG4H8/4s+JYosWofSt7VH1J1PM7JuP5k4sZMWt9qr3ExQ==%";

export const studySpotsRouter = createTRPCRouter({
  /**
   *
   * Get all
   *
   */
  getAll: publicProcedure
    .meta({ openapi: { method: "GET", path: "/studyspots.getAll" } })
    .input(
      z.object({
        cursor: z.number().optional(),
      })
    )
    .output(getNotValidatedOutputSchema)
    .query(async ({ ctx, input }) => {
      const studySpots = await ctx.prisma.studySpot.findMany({
        ...(input.cursor && { skip: 1, cursor: { id: input.cursor } }),

        take: 2,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          isValidated: false,
        },
        select: {
          name: true,
          slug: true,
          id: true,
          address: true,
          country: true,
          state: true,
          venueType: true,
          wifi: true,
          music: true,
          powerOutlets: true,
          images: true,
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
    .input(
      z.object({
        cursor: z.number().optional(),
        wifi: z.boolean().optional(),
        powerOutlets: z.boolean().optional(),
      })
    )
    .output(getNotValidatedOutputSchema)
    .query(async ({ ctx, input }) => {
      const studySpots = await ctx.prisma.studySpot.findMany({
        ...(input.cursor && { skip: 1, cursor: { id: input.cursor } }),
        take: 8,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          isValidated: false,
          wifi: input.wifi,
          powerOutlets: input.powerOutlets,
        },
        select: {
          name: true,
          slug: true,
          id: true,
          address: true,
          country: true,
          state: true,
          venueType: true,
          wifi: true,
          music: true,
          powerOutlets: true,
          images: true,
        },
      });

      return studySpots;
    }),
  /**
   *
   * Get not validated
   *
   */
  getNotValidatedForMap: publicProcedure
    .meta({
      openapi: { method: "GET", path: "/studyspots.getNotValidatedForMap" },
    })
    .input(z.void())
    .output(getNotValidatedForMapOutputSchema)
    .query(async ({ ctx }) => {
      const studySpots = await ctx.prisma.studySpot.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          isValidated: false,
        },
        select: {
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          slug: true,
          images: { take: 1 },
        },
      });

      return studySpots;
    }),
  /**
   *
   * Create One
   *
   */
  createOne: privateProcedure
    .meta({ openapi: { method: "POST", path: "/studyspots.createOne" } })
    .input(createOneInputSchema)
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

        const author = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.currentUser.email,
          },
        });

        await ctx.prisma.studySpot.create({
          data: {
            name: input.name,
            slug: slug,
            author: {
              connect: {
                email: ctx.currentUser.email,
              },
            },
            wifi: input.wifi,
            rating: input.rating,
            website: input.website,
            powerOutlets: input.powerOutlets,
            description: input.description,
            noiseLevel: input.noiseLevel,
            venueType: input.venueType,
            images: {
              createMany: {
                data: newImages.map((x) => ({
                  ...x,
                  authorId: author?.id,
                })),
              },
            },

            placeId: input.placeId,
            latitude: input.latitude,
            longitude: input.longitude,
            address: input.address,
            country: input.country,
            city: input.city,
            state: input.state,

            canStudyForLong: input.canStudyForLong,

            comfort: input.comfort,
            views: input.views,
            sunlight: input.sunlight,
            temperature: input.temperature,
            music: input.music,
            lighting: input.lighting,

            distractions: input.distractions,
            crowdedness: input.crowdedness,

            proximityToAmenities: input.proximityToAmenities,

            drinks: input.drinks,
            food: input.food,
            studyBreakFacilities: input.studyBreakFacilities,
          },
        });

        return true;
      } catch (error: unknown) {
        // Delete uploaded images in s3, this is unoptimal, but shouldn't happen often
        await deleteImagesFromBucket(
          input.images.map((url) => getBucketObjectNameFromUrl(url)),
          ctx.s3
        );

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
    .output(getOneSchema)
    .query(async ({ ctx, input }) => {
      const studySpot = await ctx.prisma.studySpot.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          images: {
            select: {
              id: true,
              aspectRatio: true,
              height: true,
              width: true,
              name: true,
              dominantColour: true,
              url: true,
            },
          },
          author: {
            select: {
              profilePicture: true,
              username: true,
            },
          },
        },
      });

      if (!studySpot)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return studySpot;
    }),
  /** Throws an error if name exists */
  checkIfNameExists: privateProcedure
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
  deleteOne: privateProcedure
    .meta({ openapi: { method: "DELETE", path: "/studyspots.deleteOne" } })
    .input(z.object({ id: z.number(), token: z.string() }))
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      if (input.token !== LOCAL_TOKEN)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      const deletedStudySpot = await ctx.prisma.studySpot.delete({
        where: {
          id: input.id,
        },
        include: {
          images: {
            select: {
              name: true,
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
      await deleteImagesFromBucket(
        deletedStudySpot.images.map(({ name }) => name),
        s3
      );

      // Delete associated images
      await ctx.prisma.image.deleteMany({
        where: {
          studySpotId: deletedStudySpot.id,
        },
      });

      return true;
    }),
  /**
   *
   * Pending Edits: Get all
   *
   */
  getAllPendingEdits: privateProcedure
    .meta({
      openapi: { method: "GET", path: "/studyspots.getAllPendingEdits" },
    })
    .input(z.object({ token: z.string() }))
    .output(pendingEditOutputSchema.array())
    .query(async ({ ctx, input }) => {
      if (input.token !== LOCAL_TOKEN)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      const allPendingEdits = await ctx.prisma.pendingEdit.findMany({
        include: {
          pendingImagesToAdd: true,
          pendingImagesToDelete: {
            select: {
              image: true,
            },
          },
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
  updateOne: privateProcedure
    .meta({
      openapi: { method: "POST", path: "/studyspots.updateOne" },
    })
    .input(creatependingEditInputSchema)
    .output(
      z.object({
        success: z.boolean(),
        newSlug: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.ip);

      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });

      const studySpot = await ctx.prisma.studySpot.findUnique({
        where: {
          id: input.studySpotId,
        },
        include: {
          images: true,
        },
      });

      // Prevent removing all images
      if (
        input.imagesToDelete?.length === studySpot?.images?.length &&
        input.images?.length === 0
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot remove all images",
        });
      }

      const slug =
        input.name &&
        slugify(input.name, {
          remove: /[*+~.()'"!:@]/g,
          lower: true,
          strict: true,
        });

      try {
        const newImages =
          input.images?.length && (await getImagesMeta(input.images));

        await ctx.prisma.studySpot.update({
          where: {
            id: input.studySpotId,
          },
          data: {
            name: input.name || undefined,
            slug: slug || undefined,
            rating: input.rating || undefined,
            description: input.description || undefined,
            noiseLevel: input.noiseLevel || undefined,
            venueType: input.venueType || undefined,

            images: {
              ...(newImages && {
                createMany: {
                  data: newImages,
                },
              }),
              ...(input.imagesToDelete?.length !== 0 &&
                input.imagesToDelete && {
                  disconnect: input.imagesToDelete.map((id) => ({
                    id,
                  })),
                }),
            },

            placeId: input.placeId || undefined,
            latitude: input.latitude || undefined,
            longitude: input.longitude || undefined,
            address: input.address || undefined,
            country: input.country || undefined,
            city: input.city || undefined,
            state: input.state || undefined,

            wifi: returnValueIfNotUndefined(input.wifi),
            powerOutlets: returnValueIfNotUndefined(input.powerOutlets),
            canStudyForLong: returnValueIfNotUndefined(input.canStudyForLong),
            sunlight: returnValueIfNotUndefined(input.sunlight),
            drinks: returnValueIfNotUndefined(input.drinks),
            food: returnValueIfNotUndefined(input.food),

            comfort: input.comfort || undefined,
            views: input.views || undefined,
            temperature: input.temperature || undefined,
            music: input.music || undefined,
            lighting: input.lighting || undefined,

            distractions: input.distractions || undefined,
            crowdedness: input.crowdedness || undefined,

            proximityToAmenities: input.proximityToAmenities || undefined,

            studyBreakFacilities: input.studyBreakFacilities || undefined,
          },
        });

        if (input.imagesToDelete?.length !== 0 && input.imagesToDelete) {
          const imageRowsToDelete = await ctx.prisma.image.findMany({
            where: {
              id: {
                in: input.imagesToDelete.map((id) => id),
              },
            },
          });

          await ctx.prisma.image.deleteMany({
            where: {
              id: {
                in: input.imagesToDelete.map((id) => id),
              },
            },
          });

          const { s3 } = ctx;

          await deleteImagesFromBucket(
            imageRowsToDelete.map(({ name }) => name),
            s3
          );
        }
      } catch (error: unknown) {
        if (input.images) {
          // Delete uploaded images in s3, this is unoptimal, but shouldn't happen often
          await deleteImagesFromBucket(
            input.images.map((url) => getBucketObjectNameFromUrl(url)),
            ctx.s3
          );
        }

        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong attempting to update a study spot.",
        });
      }

      if (slug) {
        return { success: true, newSlug: slug };
      }

      return { success: true };
    }),
  /**
   *
   * Pending Edits: Create One
   *
   */
  createPendingEdit: privateProcedure
    .meta({
      openapi: { method: "POST", path: "/studyspots.createPendingEdit" },
    })
    .input(creatependingEditInputSchema)
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.ip);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });

      try {
        const newImages =
          input.images?.length && (await getImagesMeta(input.images));
        const slug =
          input.name &&
          slugify(input.name, {
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: true,
          });

        const newPendingEdit = await ctx.prisma.pendingEdit.create({
          data: {
            name: input.name,
            slug: slug,
            wifi: input.wifi,
            rating: input.rating,
            author: {
              connect: {
                email: ctx.currentUser.email,
              },
            },
            powerOutlets: input.powerOutlets,
            description: input.description,
            noiseLevel: input.noiseLevel,
            venueType: input.venueType,

            placeId: input.placeId,
            latitude: input.latitude,
            longitude: input.longitude,
            address: input.address,
            country: input.country,
            city: input.city,
            state: input.state,

            canStudyForLong: input.canStudyForLong,

            comfort: input.comfort,
            views: input.views,
            sunlight: input.sunlight,
            temperature: input.temperature,
            music: input.music,
            lighting: input.lighting,

            distractions: input.distractions,
            crowdedness: input.crowdedness,

            proximityToAmenities: input.proximityToAmenities,

            drinks: input.drinks,
            food: input.food,
            studyBreakFacilities: input.studyBreakFacilities,

            ...(newImages && {
              pendingImagesToAdd: {
                createMany: {
                  data: newImages,
                },
              },
            }),

            studySpot: {
              connect: {
                id: input.studySpotId,
              },
            },
          },
        });

        // Images to remove
        if (input.imagesToDelete?.length !== 0 && input.imagesToDelete) {
          await ctx.prisma.pendingImageToDelete.createMany({
            data: input.imagesToDelete.map((imageId) => ({
              pendingEditId: newPendingEdit.id,
              imageId: imageId,
            })),
          });
        }

        return true;
      } catch (error: unknown) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong creating a study spot",
        });
      }
    }),
  acceptPendingEdit: privateProcedure
    .meta({
      openapi: { method: "POST", path: "/studyspots.acceptPendingEdit" },
    })
    .input(z.object({ id: z.number() }))
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const pendingEdit = await ctx.prisma.pendingEdit.findUnique({
        where: {
          id: input.id,
        },
        include: {
          pendingImagesToAdd: {
            select: {
              id: true,
              pendingEditId: true,
            },
          },
          pendingImagesToDelete: {
            select: {
              pendingEditId: true,
              image: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          studySpot: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!pendingEdit) throw new TRPCError({ code: "NOT_FOUND" });

      const { pendingImagesToAdd, pendingImagesToDelete } = pendingEdit;

      // REMOVE IMAGES
      if (pendingImagesToDelete.length > 0) {
        await ctx.prisma.$transaction([
          ctx.prisma.pendingImageToDelete.deleteMany({
            where: {
              OR: [
                { pendingEditId: pendingEdit.id },
                // if another pending edit has the same image, delete it
                {
                  imageId: {
                    in: pendingImagesToDelete.map(({ image }) => image.id),
                  },
                },
              ],
            },
          }),
          ctx.prisma.image.deleteMany({
            where: {
              id: {
                in: pendingImagesToDelete.map(({ image }) => image.id),
              },
            },
          }),
        ]);

        const { s3 } = ctx;
        await deleteImagesFromBucket(
          pendingImagesToDelete.map(({ image }) => image.name),
          s3
        );
      }

      // UPDATE EXISTING STUDY SPOT
      await ctx.prisma.studySpot.update({
        where: {
          id: pendingEdit.studySpot.id,
        },
        data: {
          name: pendingEdit.name || undefined,
          slug: pendingEdit.slug || undefined,
          rating: pendingEdit.rating || undefined,
          description: pendingEdit.description || undefined,
          noiseLevel: pendingEdit.noiseLevel || undefined,
          venueType: pendingEdit.venueType || undefined,
          images: {
            connect: pendingImagesToAdd.map((image) => ({ id: image.id })),
            disconnect: pendingImagesToDelete.map(({ image }) => ({
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

          wifi: returnValueIfNotUndefined(pendingEdit.wifi) || undefined,
          powerOutlets:
            returnValueIfNotUndefined(pendingEdit.powerOutlets) || undefined,
          canStudyForLong:
            returnValueIfNotUndefined(pendingEdit.canStudyForLong) || undefined,
          sunlight:
            returnValueIfNotUndefined(pendingEdit.sunlight) || undefined,
          drinks: returnValueIfNotUndefined(pendingEdit.drinks) || undefined,
          food: returnValueIfNotUndefined(pendingEdit.food) || undefined,

          comfort: pendingEdit.comfort || undefined,
          views: pendingEdit.views || undefined,
          temperature: pendingEdit.temperature || undefined,
          music: pendingEdit.music || undefined,
          lighting: pendingEdit.lighting || undefined,

          distractions: pendingEdit.distractions || undefined,
          crowdedness: pendingEdit.crowdedness || undefined,

          proximityToAmenities: pendingEdit.proximityToAmenities || undefined,

          studyBreakFacilities: pendingEdit.studyBreakFacilities || undefined,
        },
      });

      // REMOVE PENDING EDITS
      await ctx.prisma.pendingEdit.delete({
        where: {
          id: input.id,
        },
      });

      return true;
    }),
  declinePendingEdit: privateProcedure
    .meta({
      openapi: { method: "POST", path: "/studyspots.declinePendingEdit" },
    })
    .input(z.object({ id: z.number() }))
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const pendingEdit = await ctx.prisma.pendingEdit.findUnique({
        where: {
          id: input.id,
        },
        include: {
          pendingImagesToAdd: {
            select: {
              pendingEditId: true,
              id: true,
              name: true,
            },
          },
          pendingImagesToDelete: {
            select: {
              pendingEditId: true,
              image: true,
            },
          },
          studySpot: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!pendingEdit) throw new TRPCError({ code: "NOT_FOUND" });

      const { pendingImagesToAdd, pendingImagesToDelete } = pendingEdit;

      // REMOVE IMAGES
      if (pendingImagesToAdd.length > 0) {
        await ctx.prisma.image.deleteMany({
          where: {
            pendingEditId: pendingEdit.id,
          },
        });
        await ctx.prisma.image.deleteMany({
          where: {
            id: {
              in: pendingImagesToAdd.map((image) => image.id),
            },
          },
        });

        const { s3 } = ctx;
        await deleteImagesFromBucket(
          pendingImagesToAdd.map(({ name }) => name),
          s3
        );
      }

      if (pendingImagesToDelete.length > 0) {
        await ctx.prisma.pendingImageToDelete.deleteMany({
          where: {
            pendingEditId: pendingEdit.id,
          },
        });
      }

      // REMOVE PENDING EDITS
      await ctx.prisma.pendingEdit.delete({
        where: {
          id: input.id,
        },
      });

      return true;
    }),
  getHeroImages: publicProcedure
    .meta({
      openapi: { method: "GET", path: "/studyspots.getHeroImages" },
    })
    .input(z.void())
    .output(getNotValidatedOutputSchema)
    .query(async ({ ctx }) => {
      const studySpots = await ctx.prisma.studySpot.findMany({
        take: 4,
        include: {
          images: true,
        },
        where: {
          OR: [
            { slug: "gan-dan-cafe" },
            { slug: "leible-coffee-north-sydney" },
            { slug: "darling-square-library" },
            { slug: "the-calyx" },
          ],
        },
      });

      return studySpots;
    }),
});
