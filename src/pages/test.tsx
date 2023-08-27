import imageCompression from "browser-image-compression";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const TestPage = () => {
  const compressImages = async (acceptedFiles: File[]) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedFilePromises = acceptedFiles.map(
      async (file) => await imageCompression(file, options)
    );

    const compressedFiles = await Promise.all(compressedFilePromises);

    return compressedFiles;
  };

  const [images, setImages] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 8,
    maxSize: 80000000, // 10mb
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/webp": [".webp"],
    },
    onDrop: (acceptedFiles) => {
      setImages([]);
      // IIFE signals clearly that this is a "fire and forget" operation and that the callback itself doesn't do anything special with the async code return value
      void (async () => {
        const compressed = await compressImages(acceptedFiles);
        if (!compressed) return;
        setImages(compressed);
      })();
    },
  });

  return (
    <div className="pt-44">
      <div className="rounded-md bg-gray-50 border border-dashed border-gray-300">
        <div
          className={`rounded-md flex-row h-24 gap-4 p-4 justify-center border-dashed border-gray-300 flex items-center w-full cursor-pointer`}
          {...getRootProps()}
        >
          <input type="hidden" {...getInputProps()} />
          Drop here
        </div>

        <div className="flex flex-wrap">
          {images.map((x) => (
            <img src={URL.createObjectURL(x)} key={x.name} className="w-40" />
          ))}
        </div>
      </div>
    </div>
  );
};
export default TestPage;
