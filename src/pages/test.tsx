import imageCompression from "browser-image-compression";
import { ChangeEvent } from "react";

const TestPage = () => {
  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const imageFile = event.target.files[0];
    if (!imageFile) return;
    console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      //   await uploadToServer(compressedFile); // write your own logic
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="pt-44">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e)}
      />
    </div>
  );
};
export default TestPage;
