import { TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";
import sharp from "sharp";
import { env } from "~/env.mjs";
import { type S3, DeleteObjectCommand } from "@aws-sdk/client-s3";

const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

/**
 * @description uses sharp to get image metadata.  Also serves to validate that the images are from the bucket and not some other dog
 * @param input array of image urls
 */
export const getImagesMeta = async (input: string[]) => {
  interface Response {
    request: {
      host: string;
    };
    data: Buffer;
  }

  try {
    if (input.length === 0)
      throw new TRPCError({
        code: "UNPROCESSABLE_CONTENT",
        message: "No images provided",
      });

    const allImagesWithMeta = await Promise.all(
      input.map(async (url) => {
        const bucketPath = `https://${env.BUCKET_NAME}.s3.${env.REGION}.amazonaws.com/`;

        if (!url.startsWith(bucketPath))
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Image url is not from the bucket",
          });

        const splitUrl = url.split("?")[0] || "";
        const imageName = splitUrl.substring(bucketPath.length);

        const imageUrl = `${env.CLOUDFRONT_URL}/${imageName}`;

        // Download Image & use Buffer as Input
        const response = await axios<Record<string, never>, Response>({
          url: imageUrl,
          responseType: "arraybuffer",
        });

        const input = response.data;

        // Extract relevant metadata using sharp library
        const sharpInput = sharp(input);
        const { width, height } = await sharpInput.metadata();
        const { dominant } = await sharpInput.stats();
        const { r, g, b } = dominant;
        const aspectRatio =
          width && height && parseFloat((width / height).toFixed(8));

        if (!width || !height || !aspectRatio)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong getting image metadata",
          });

        return {
          name: imageName,
          url: `${env.CLOUDFRONT_URL}/${imageName}`,
          width: width,
          height: height,
          aspectRatio: aspectRatio,
          dominantColour: rgbToHex(r, g, b),
        };
      })
    );

    return allImagesWithMeta;
  } catch (error) {
    const errorString = "Something went wrong getting image metadata";

    if (error instanceof TRPCError) throw error;

    if (error instanceof AxiosError) {
      if (error.code === "ECONNREFUSED")
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: `${errorString}: Could not connect to provided image url`,
        });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: errorString,
    });
  }
};

/**
 * @description deletes images from bucket
 * @param images array of objects that have image urls
 */
export const deleteImagesFromBucket = async <T extends { name: string }>(
  images: T[],
  s3: S3
) => {
  try {
    await Promise.all(
      images.map(async (image) => {
        const bucketParams = { Bucket: env.BUCKET_NAME, Key: image.name };
        const data = await s3.send(new DeleteObjectCommand(bucketParams));
        console.log("Success. Object deleted.", data);
        return data; // For unit tests.
      })
    );
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error deleting image from bucket",
    });
  }
};
