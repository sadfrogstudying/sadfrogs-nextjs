import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getImagesMeta } from "~/utils/server-helpers";
import { v4 as uuidv4 } from "uuid";
import { extension } from "mime-types";

// https://blog.nickramkissoon.com/posts/t3-s3-presigned-urls

export const s3Router = createTRPCRouter({
  /**
   * list all the objects in our S3 bucket. This will be used to display
   * the files that have already been uploaded to the bucket.
   */
  getObjects: publicProcedure.query(async ({ ctx }) => {
    const { s3 } = ctx;

    const listObjectsOutput = await s3.listObjectsV2({
      Bucket: env.BUCKET_NAME,
    });

    return listObjectsOutput.Contents ?? [];
  }),
  /**
   * list all the objects in our S3 bucket. This will be used to display
   * the files that have already been uploaded to the bucket.
   */
  getAllImages: publicProcedure.query(async ({ ctx }) => {
    const { s3 } = ctx;

    const listObjectsOutput = await s3.listObjectsV2({
      Bucket: env.BUCKET_NAME,
    });

    const allImages =
      listObjectsOutput.Contents?.map((object, i) => ({
        key: object.Key || "",
        url: `https://${env.BUCKET_NAME}.s3.${env.REGION}.amazonaws.com/${
          object.Key || ""
        }`,
      })) || [];

    return allImages ?? [];
  }),
  /**
   * create a presigned URL that can be used to upload a file with a specific
   * key to our S3 bucket. This will be used for regular uploads, where the
   * entire file is uploaded in a single request.
   */
  getPresignedUrls: publicProcedure
    .meta({ openapi: { method: "POST", path: "/s3.getPresignedUrls" } })
    .input(
      z.object({
        files: z.object({ contentType: z.string() }).array(),
      })
    )
    .output(z.string().array())
    .mutation(async ({ ctx, input }) => {
      const { s3 } = ctx;

      const signedUrlPromises = input.files.map(async (file) => {
        const fileExtension = extension(file.contentType) || "";

        const putObjectCommand = new PutObjectCommand({
          Bucket: env.BUCKET_NAME,
          Key: `${uuidv4()}.${fileExtension}`,
          ContentType: file.contentType,
        });

        return await getSignedUrl(s3, putObjectCommand);
      });

      return await Promise.all(signedUrlPromises);
    }),
  /**
   * This should belong on another route
   */
  createImages: publicProcedure
    .meta({ openapi: { method: "POST", path: "/s3.createImages" } })
    .input(z.object({ urls: z.string().array() }))
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      const newImages = await getImagesMeta(input.urls);

      const createRecords = newImages.map(async (image) => {
        await ctx.prisma.image.create({
          data: {
            url: image.url,
            metadata: {
              create: {
                dominantColor: image.metadata.dominantColour,
                dimensions: {
                  create: {
                    width: image.metadata.dimensions.width,
                    height: image.metadata.dimensions.height,
                    aspectRatio: image.metadata.dimensions.aspectRatio,
                  },
                },
              },
            },
          },
        });
      });

      await Promise.all(createRecords);
    }),
});
