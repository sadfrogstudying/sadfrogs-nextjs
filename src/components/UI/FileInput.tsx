import React, { forwardRef, useEffect, useMemo } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";

import { Input } from "~/components/UI/Input";

interface Props {
  setValue: (file: File[]) => void;
  value: File[];
  isSuccess: boolean;
  maxFiles?: number;
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> &
  Props;

const FileInput = forwardRef<HTMLInputElement, InputProps>(
  ({ setValue, value, isSuccess, maxFiles = 8, ...props }, ref) => {
    const [error, setError] = React.useState<string[]>([]);
    const [compressionProgress, setCompressionProgress] = React.useState<
      number[]
    >([]);

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      acceptedFiles,
      fileRejections,
    } = useDropzone({
      maxFiles: maxFiles,
      maxSize: 30000000, // 10mb
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpeg", ".jpg"],
        "image/webp": [".webp"],
      },
      onDrop: (acceptedFiles) => {
        void compressImages(acceptedFiles);
      },
    });

    const fileRejectionErrors = fileRejections.flatMap(({ errors }) => {
      return errors.flatMap(({ message }) => message);
    });
    const fileRejectionUniqueErrors = Array.from(new Set(fileRejectionErrors));

    const compressImages = async (acceptedFiles: File[]) => {
      setValue([]);
      setError([]);
      setCompressionProgress(Array(acceptedFiles.length).fill(0));
      try {
        const compressedFilePromises = acceptedFiles.map(
          async (file, i) => await handleImageCompression(file, i)
        );
        const compressedFiles = await Promise.all(compressedFilePromises);
        setValue(compressedFiles);
      } catch (error) {
        if (error instanceof Error) void setError([error.message]);
      }
      setCompressionProgress([]);
    };

    const handleImageCompression = async (image: File, index: number) => {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        onProgress: (p: number) =>
          setCompressionProgress((progressArr) => {
            const newArr = [...progressArr];
            newArr[index] = p;
            return newArr;
          }),
      };

      try {
        return await imageCompression(image, options);
      } catch (error) {
        throw error;
      }
    };

    const renderedFiles = useMemo(() => {
      return value.map((file) => (
        <li key={file.name} className="relative overflow-hidden h-24 list-none">
          <Image
            src={URL.createObjectURL(file)}
            alt="Photos waiting to be uploaded"
            fill
            style={{ objectFit: `contain` }}
          />
        </li>
      ));
    }, [value]);

    useEffect(() => {
      if (isSuccess) setValue([]);
    }, [isSuccess, setValue]);

    return (
      <>
        <div
          className="p-4 rounded-md border border-dashed border-gray-300 flex justify-center items-center h-24 w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{
            backgroundColor: isDragActive ? `#e5e5e5` : "#f5f5f5",
          }}
          {...getRootProps()}
          {...props}
          ref={ref}
        >
          <Input
            type="hidden"
            {...getInputProps()}
            value=""
            onClick={() => setValue([])}
          />
          <p style={{ margin: `auto` }}>
            {isDragActive
              ? "Fire in the hole!"
              : "Drag some files here, or click to select"}
          </p>
        </div>

        {acceptedFiles.length ? (
          <aside className="space-y-4">
            <h3 style={{ marginBottom: `0.5rem` }}>Files pending upload:</h3>
            <div>
              {compressionProgress.length !== 0 &&
                compressionProgress.map((p, i) => (
                  <div
                    key={`${i}-${p}`}
                    className={p === 100 ? "text-green-500" : ""}
                  >
                    Compressing Image {i + 1}: {p}%
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-4">{renderedFiles}</div>
          </aside>
        ) : null}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {fileRejectionUniqueErrors.length ? (
          <p className="text-sm text-red-500">
            {fileRejectionUniqueErrors.join(", ")}
          </p>
        ) : null}
        <p className="text-sm text-gray-400">
          * Only png, jpeg, and webp files are allowed & max file size is 10mb.
        </p>
      </>
    );
  }
);

export default FileInput;
FileInput.displayName = "FileInput";
