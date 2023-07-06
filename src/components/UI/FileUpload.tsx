import React, { useEffect, useMemo } from "react";

import { useDropzone } from "react-dropzone";

import Image from "next/image";
import { Input } from "~/components/UI/Input";

interface Props {
  setValue: (file: File[]) => void;
  value: File[];
  isSuccess: boolean;
}

const FileUpload = React.forwardRef<HTMLInputElement, Props>(
  ({ setValue, value, isSuccess, ...props }: Props, ref) => {
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
      useDropzone({
        maxFiles: 8,
        maxSize: 4000000, // 4mb
        accept: {
          "image/png": [".png"],
          "image/jpeg": [".jpeg", ".jpg"],
          "image/webp": [".webp"],
        },
        onDrop: (acceptedFiles) => {
          setValue(acceptedFiles);
        },
      });

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
    }, [isSuccess]);

    return (
      <>
        <div
          className="rounded-md border border-dashed border-gray-300 flex justify-center items-center h-24 w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{
            backgroundColor: isDragActive ? `#e5e5e5` : "#f5f5f5",
          }}
          {...getRootProps()}
        >
          <Input
            type="hidden"
            {...getInputProps()}
            {...props}
            value=""
            ref={ref}
          />
          <p style={{ margin: `auto` }}>
            {isDragActive
              ? "Fire in the hole!"
              : "Drag some files here, or click to select"}
          </p>
        </div>

        {acceptedFiles.length ? (
          <aside>
            <h3 style={{ marginBottom: `0.5rem` }}>Files pending upload:</h3>
            <div className="grid grid-cols-3 gap-4">{renderedFiles}</div>
          </aside>
        ) : null}
      </>
    );
  }
);
FileUpload.displayName = "FileUpload";

export default FileUpload;
