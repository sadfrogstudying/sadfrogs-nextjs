import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

// https://blog.nickramkissoon.com/posts/t3-s3-presigned-urls

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(6, "1 m"),
  analytics: true,
});

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
      listObjectsOutput.Contents?.map((object) => ({
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
   *
   * @params an array of all the contentTypes of the files we want to upload
   */
  getPresignedUrls: publicProcedure
    .meta({ openapi: { method: "POST", path: "/s3.getPresignedUrls" } })
    .input(
      z.object({
        files: z
          .object({
            contentLength: z.number(),
            contentType: z.string(),
          })
          .array(),
      })
    )
    .output(z.string().array())
    .mutation(async ({ ctx, input }) => {
      // Rate limit
      const { success } = await ratelimit.limit(ctx.ip);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });

      // Limit to 8 files
      if (input.files.length > 8)
        throw new TRPCError({
          code: "PAYLOAD_TOO_LARGE",
          message: "Too many files, limit to 8",
        });

      const { s3 } = ctx;

      const signedUrlPromises = input.files.map(async (file) => {
        if (file.contentLength > 1024 * 1024 * 2)
          throw new TRPCError({
            code: "PAYLOAD_TOO_LARGE",
            message: "File too large, limit to 2MB",
          });

        const putObjectCommand = new PutObjectCommand({
          Bucket: env.BUCKET_NAME,
          Key: uuidv4(),
          ContentType: file.contentType,
          ContentLength: file.contentLength,
        });

        return await getSignedUrl(s3, putObjectCommand);
      });

      return await Promise.all(signedUrlPromises);
    }),
});
