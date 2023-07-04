import React, { useMemo } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";

import { useDropzone } from "react-dropzone";

import {
  DropzoneFilesPreview,
  DropzoneRoot,
  Input,
} from "~/components/UI/Form";

const FileUpload = <T extends FieldValues>({
  control,
  name,
  setValue,
}: {
  name: Path<T>;
  control: Control<T, any>;
  setValue: (file: File[]) => void;
}) => {
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
    return acceptedFiles.map((file) => (
      <li key={file.name}>
        <img src={URL.createObjectURL(file)} />
      </li>
    ));
  }, [acceptedFiles]);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur } }) => (
          <DropzoneRoot
            style={{
              backgroundColor: isDragActive ? `#e5e5e5` : "#f5f5f5",
              height: "100px",
            }}
            {...getRootProps()}
          >
            <Input
              type={"hidden"}
              {...getInputProps({
                onBlur,
                onChange,
              })}
            />
            <p style={{ margin: `auto` }}>
              {isDragActive
                ? "Fire in the hole!"
                : "Drag some files here, or click to select"}
            </p>
          </DropzoneRoot>
        )}
      />
      {acceptedFiles.length ? (
        <aside>
          <h3 style={{ marginBottom: `0.5rem` }}>Files pending upload:</h3>
          <DropzoneFilesPreview>{renderedFiles}</DropzoneFilesPreview>
        </aside>
      ) : null}
    </>
  );
};

export default FileUpload;
