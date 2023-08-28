import React, { forwardRef, memo, type ReactNode } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { type FileRejection, useDropzone } from "react-dropzone";
import { Input } from "~/components/UI/Input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/UI/Table";
import { Button } from "./Button";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CircleDashed,
  Upload,
} from "lucide-react";

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

const FileInput = forwardRef<HTMLInputElement, InputProps>(
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
      if (fileRejections.length) return "Only images are allowed";
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

export default FileInput;
FileInput.displayName = "FileInput";

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
      <Table>
        <TableCaption className="p-2">
          List of images pending to upload, order them here
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Order</TableHead>
            <TableHead className="w-full text-center">Image</TableHead>
            <TableHead className="w-2">Control</TableHead>
            <TableHead className="w-2 sr-only">Control</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {values.map((file, i) => (
            <TableRow key={file.name} className="h-28">
              <TableCell className="font-medium">{i + 1}</TableCell>
              <TableCell className="relative">
                <div className="relative w-24 h-24 mx-auto">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Photos waiting to be uploaded"
                    fill
                    className="object-contain w-auto"
                  />
                </div>
              </TableCell>
              <TableCell className="h-full text-center m-auto">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => moveItemHandler(-1, i)}
                    variant="ghost"
                    className="text-gray-500 p-0 w-6 md:w-4"
                  >
                    <ChevronUp />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => moveItemHandler(1, i)}
                    variant="ghost"
                    className="text-gray-500 p-0 w-6 md:w-4"
                  >
                    <ChevronDown />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
);
RenderedFiles.displayName = "RenderedFiles";
