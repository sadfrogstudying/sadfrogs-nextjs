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
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Something went wrong uploading image to storage");
    }
  });

  await Promise.all(promises);

  const imageUrls = presignedUrls.map((url) => {
    const imageUrl = url.split("?")[0];
    if (typeof imageUrl !== "string")
      throw new Error("Something went wrong getting image url");

    return imageUrl;
  });

  return imageUrls;
};
