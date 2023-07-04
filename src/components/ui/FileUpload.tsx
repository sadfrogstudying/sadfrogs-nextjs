import React, { useMemo } from "react";
import { Controller } from "react-hook-form";

import { useDropzone } from "react-dropzone";

import {
  DropzoneFilesPreview,
  DropzoneRoot,
  FormField,
  FormLabel,
  Input,
} from "~/components/ui/Form";

const FileUpload = ({
  control,
  name,
  setValue,
}: {
  name: string;
  control: any;
  setValue: any;
}) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      maxFiles: 8,
      maxSize: 4000000, // 4mb
      onDrop: (acceptedFiles) => {
        setValue(name, acceptedFiles);
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
    <FormField name={name}>
      <FormLabel>Images</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
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
    </FormField>
  );
};

export default FileUpload;
