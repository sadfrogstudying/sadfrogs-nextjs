import axios from "axios";

/** Returns the urls of the uploaded images */
export const uploadImagesToS3UsingPresignedUrls = async ({
  presignedUrls,
  acceptedFiles,
}: {
  presignedUrls: string[];
  acceptedFiles: File[];
}) => {
  const promises = presignedUrls.map(async (url, i) => {
    try {
      const res = await axios.put(url, acceptedFiles[i]);

      console.log(res);
      console.log("Successfully uploaded ", acceptedFiles[i]?.name);
    } catch (error) {
      console.log(error);
    }
  });

  await Promise.all(promises);

  const imageUrls = presignedUrls.map((url) => url.split("?")[0]!);
  return imageUrls;
};
