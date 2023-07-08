import { TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";
import sharp from "sharp";
import { env } from "~/env.mjs";

const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

/**
 * @description this function also serves to validate that the images are from the bucket and not some other dog
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
    const allImagesWithMeta = await Promise.all(
      input.map(async (url) => {
        if (url.startsWith(`${env.BUCKET_NAME}.s3.${env.REGION}`))
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Image url is not from the bucket",
          });

        // Download Image & use Buffer as Input
        const response = await axios<Record<string, never>, Response>({
          url,
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
          url,
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
