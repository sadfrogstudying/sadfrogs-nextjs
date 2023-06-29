import axios from "axios";
import sharp from "sharp";

const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

/**
 *
 * @param input array of image urls
 * @returns
 */
export const getImagesMeta = async (input: string[]) => {
  const allImagesWithMeta = await Promise.all(
    input.map(async (url) => {
      // Download Image & use Buffer as Input
      const response = await axios({
        url,
        responseType: "arraybuffer",
      });

      const input = response.data as Buffer;

      // Extract relevant metadata using sharp library
      const sharpInput = sharp(input);
      const { width, height } = await sharpInput.metadata();
      const { dominant } = await sharpInput.stats();
      const { r, g, b } = dominant;
      const aspectRatio =
        width && height && parseFloat((width / height).toFixed(8));

      const metadata = {
        dimensions: {
          width: width,
          height: height,
          aspectRatio: aspectRatio,
        },
        dominantColour: rgbToHex(r, g, b),
      };

      return {
        url,
        metadata: metadata,
      };
    })
  );

  return allImagesWithMeta;
};
