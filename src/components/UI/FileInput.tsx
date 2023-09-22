import React, { forwardRef, Fragment, memo, type ReactNode } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { type FileRejection, useDropzone } from "react-dropzone";
import { Input } from "~/components/UI/Input";
import { Button } from "./Button";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CircleDashed,
  Upload,
} from "lucide-react";
import { useErrorBoundary, withErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallbackRender from "../StudySpot/Form/ErrorBoundaryFallbackRender";

interface Props {
  setValue: (images: File[]) => void;
  value: File[];
  maxFiles?: number;
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> &
  Props;

const UploadIcon = () => <Upload className="flex-shrink-0 w-5" />;
const CheckCircleIcon = () => <CheckCircle className="flex-shrink-0 w-5" />;
const CircleDashedIcon = () => (
  <CircleDashed className="flex-shrink-0 w-5 animate-ping" />
);

const FileInputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ setValue, value, maxFiles = 8, ...props }, ref) => {
    const [error, setError] = React.useState<string | null>(null);
    const [compressionProgress, setCompressionProgress] = React.useState<
      number[]
    >([]);

    const { getRootProps, getInputProps, isDragActive, fileRejections } =
      useDropzone({
        maxFiles: maxFiles,
        maxSize: 30000000, // 10mb
        accept: {
          "image/png": [".png"],
          "image/jpeg": [".jpeg", ".jpg"],
          "image/webp": [".webp"],
        },
        onDrop: (acceptedFiles) => {
          // IIFE signals clearly that this is a "fire and forget" operation and that the callback itself doesn't do anything special with the async code return value
          void (async () => {
            const compressed = await compressImages(acceptedFiles);
            if (!compressed) return;
            setValue(compressed);
          })();
        },
      });

    const { showBoundary } = useErrorBoundary();

    const compressImages = async (acceptedFiles: File[]) => {
      setCompressionProgress(Array(acceptedFiles.length).fill(0));
      setError(null);

      try {
        const compressedFilePromises = acceptedFiles.map(
          async (file, i) => await handleImageCompression(file, i)
        );
        const compressedFiles = await Promise.all(compressedFilePromises);
        return compressedFiles;
      } catch (error) {
        showBoundary(error);

        if (error instanceof Error) {
          void setError(error.message);
        }
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

      return await imageCompression(image, options);
    };

    const getDropzoneText = (): ReactNode => {
      if (fileRejections.length) return "Error...";
      if (
        compressionProgress.length > 0 &&
        compressionProgress.some((x) => x < 100)
      )
        return (
          <>
            <CircleDashedIcon /> Compressing images
          </>
        );
      if (value.length)
        return (
          <>
            <CheckCircleIcon /> Images ready to upload
          </>
        );
      if (isDragActive)
        return (
          <>
            <UploadIcon /> Fire in the hole!
          </>
        );
      return (
        <>
          <UploadIcon /> Drag files or click here to choose
        </>
      );
    };

    const getDropzoneColor = () => {
      if (fileRejections.length) return "bg-red-200";
      if (
        compressionProgress.length > 0 &&
        compressionProgress.some((x) => x < 100)
      )
        return "bg-yellow-200";
      if (value.length) return "bg-green-200";
      if (isDragActive) return "bg-blue-200";
      return "bg-gray-100";
    };

    return (
      <div className="space-y-4">
        <div className="rounded-md bg-gray-50 border border-dashed border-gray-300">
          <div
            className={`rounded-md flex-row h-24 gap-4 p-4 justify-center ${getDropzoneColor()} ${
              !!value.length ? "border-b" : ""
            } border-dashed border-gray-300 flex items-center w-full cursor-pointer`}
            {...getRootProps()}
            ref={ref}
          >
            <Input type="file" {...props} {...getInputProps()} multiple />

            {getDropzoneText()}
          </div>
          <RenderedFiles values={value} setValues={setValue} />
        </div>

        <CompressionProgress compressionProgress={compressionProgress} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <ReactDropzoneFileRejectionErrors fileRejections={fileRejections} />
      </div>
    );
  }
);

FileInputComponent.displayName = "FileInputComponent";
const FileInput = withErrorBoundary(FileInputComponent, {
  fallbackRender: ErrorBoundaryFallbackRender,
});

export default FileInput;

const ReactDropzoneFileRejectionErrors = ({
  fileRejections,
}: {
  fileRejections: FileRejection[];
}) => {
  const fileRejectionErrors = fileRejections.flatMap(({ errors }) => {
    return errors.flatMap(({ message }) => message);
  });
  const fileRejectionUniqueErrors = Array.from(new Set(fileRejectionErrors));

  return (
    <p className="text-sm text-red-500">
      {fileRejectionUniqueErrors.join(", ")}
    </p>
  );
};

const CompressionProgress = ({
  compressionProgress,
}: {
  compressionProgress: number[];
}) => {
  return (
    <aside className="space-y-4 text-sm">
      <div>
        {compressionProgress.length !== 0 &&
          compressionProgress.map((p, i) => {
            return (
              <div
                key={`${i}-${p}`}
                className={p === 100 ? "text-green-500" : "text-yellow-400"}
              >
                {p === 100 && <CheckCircle className="inline w-4 mr-2" />}
                {p === 100 ? "Compressed" : "Compressing"} Image {i + 1}: {p}%
              </div>
            );
          })}
      </div>
    </aside>
  );
};

const RenderedFiles = memo(
  ({
    values,
    setValues,
  }: {
    values: File[];
    setValues: (images: File[]) => void;
  }) => {
    const moveItemHandler = (amountToMove: number, index: number) => {
      const moveItem = <T,>(array: T[], to: number, from: number) => {
        const item = array[from];

        if (to === from) return array;
        if (!item) return array;

        array.splice(from, 1);
        array.splice(to, 0, item);
        return array;
      };

      if (amountToMove < 0) {
        // increase order
        const moveTo = index === 0 ? values.length - 1 : index + amountToMove;
        setValues(moveItem(values, moveTo, index));
      } else {
        // decrease order
        const moveTo = index === values.length - 1 ? 0 : index + amountToMove;
        setValues(moveItem(values, moveTo, index));
      }
    };

    if (!values.length) return null;

    return (
      <div className="overflow-x-auto grid grid-cols-[1fr_2fr_1fr] justify-items-center items-center">
        <div className="p-4 font-bold text-center">Order</div>
        <div className="p-4 font-bold w-full text-center">Image</div>
        <div className="p-4 font-bold text-center">Control</div>
        {values.map((file, i) => (
          <Fragment key={URL.createObjectURL(file)}>
            <div className="p-4 font-medium">{i + 1}</div>
            <div className="p-4">
              <div className="relative w-24 h-24">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Photos waiting to be uploaded"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="p-4 flex gap-4">
              <Button
                type="button"
                onClick={() => moveItemHandler(1, i)}
                variant="ghost"
                className="text-gray-500 p-0 w-6 md:w-4"
              >
                <ChevronDown />
              </Button>
              <Button
                type="button"
                onClick={() => moveItemHandler(-1, i)}
                variant="ghost"
                className="text-gray-500 p-0 w-6 md:w-4"
              >
                <ChevronUp />
              </Button>
            </div>
          </Fragment>
        ))}
      </div>
    );
  }
);
RenderedFiles.displayName = "RenderedFiles";
