import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
   *
   * @params an array of all the contentTypes of the files we want to upload
   */
  getPresignedUrls: publicProcedure
    .meta({ openapi: { method: "POST", path: "/s3.getPresignedUrls" } })
    .input(
      z.object({
        contentTypes: z.string().array(),
      })
    )
    .output(z.string().array())
    .mutation(async ({ ctx, input }) => {
      const { s3 } = ctx;

      const signedUrlPromises = input.contentTypes.map(async (contentType) => {
        const fileExtension = extension(contentType) || "";

        const putObjectCommand = new PutObjectCommand({
          Bucket: env.BUCKET_NAME,
          Key: `${uuidv4()}.${fileExtension}`,
          ContentType: contentType,
        });

        return await getSignedUrl(s3, putObjectCommand);
      });

      return await Promise.all(signedUrlPromises);
    }),
});
