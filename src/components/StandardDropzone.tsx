import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { api } from "../utils/api";

export const StandardDropzone = () => {
  const { mutate: createImages } = api.s3.createImages.useMutation();
  const { mutate: getPresignedUrls } = api.s3.getPresignedUrls.useMutation({
    onSuccess: async (urls) => {
      if (!urls.length) return;

      const promises = urls.map(async (url, i) => {
        try {
          const res = await axios.put(url, acceptedFiles[i]);

          console.log(res);
          console.log("Successfully uploaded ", acceptedFiles[i]?.name);
        } catch (error) {
          console.log(error);
        }
      });

      await Promise.all(promises);

      const imageUrls = urls.map((url) => url.split("?")[0]!);

      createImages({ urls: imageUrls });

      setSubmitDisabled(true);
      await apiUtils.s3.getObjects.invalidate();
      await apiUtils.s3.getAllImages.invalidate();
    },
  });
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const apiUtils = api.useContext();

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      maxFiles: 8,
      maxSize: 4000000, // 4mb
      onDropAccepted: () => setSubmitDisabled(false),
    });

  const files = useMemo(() => {
    if (!submitDisabled)
      return acceptedFiles.map((file) => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ));

    return null;
  }, [acceptedFiles, submitDisabled]);

  const handleSubmit = () => {
    const filesToSubmit = acceptedFiles.map((file) => ({
      contentType: file.type,
    }));

    getPresignedUrls({ files: filesToSubmit });
  };

  return (
    <section>
      <h2 className="text-lg font-semibold">Standard Dropzone</h2>
      <p className="mb-3">Simple example for uploading one file at a time</p>
      <div
        {...getRootProps()}
        className="dropzone-container"
        style={{ width: `200px`, height: `200px`, background: `lightgray` }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex h-full items-center justify-center font-semibold">
            <p>Drop the file here...</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center font-semibold">
            <p>Drag n drop file here, or click to select files</p>
          </div>
        )}
      </div>
      <aside className="my-2">
        <h4 className="font-semibold text-zinc-400">Files pending upload</h4>
        <ul>{files}</ul>
      </aside>
      <button
        onClick={() => void handleSubmit()}
        disabled={acceptedFiles.length === 0 || submitDisabled}
        className="submit-button"
      >
        Upload
      </button>
    </section>
  );
};
