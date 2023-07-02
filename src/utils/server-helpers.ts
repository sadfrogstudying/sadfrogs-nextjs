import axios from "axios";
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
        // Download Image & use Buffer as Input
        const response = await axios<Record<string, never>, Response>({
          url,
          responseType: "arraybuffer",
        });

        const host = response.request.host;
        if (host !== `${env.BUCKET_NAME}.s3.${env.REGION}.amazonaws.com`)
          throw new Error("The URLs provided are not from the bucket");

        const input = response.data;

        // Extract relevant metadata using sharp library
        const sharpInput = sharp(input);
        const { width, height } = await sharpInput.metadata();
        const { dominant } = await sharpInput.stats();
        const { r, g, b } = dominant;
        const aspectRatio =
          width && height && parseFloat((width / height).toFixed(8));

        if (!width || !height || !aspectRatio)
          throw new Error(
            "Something went wrong getting width/height for image metadata"
          );

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
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("Something went wrong getting image metadata");
  }
};
