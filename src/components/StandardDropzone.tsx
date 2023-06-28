import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { api } from "../utils/api";

export const StandardDropzone = () => {
  const [presignedUrls, setPresignedUrls] = useState<string[]>([]);
  const { mutateAsync: fetchPresignedUrls } =
    api.s3.getPresignedUrls.useMutation();
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

  const handleSubmit = useCallback(async () => {
    const keys = acceptedFiles.map((file) => file.name);

    fetchPresignedUrls({ keys: keys })
      .then(async (urls) => {
        if (acceptedFiles[0] && urls[0]) {
          const promises = urls.map(async (url, i) => {
            await axios
              .put(url, acceptedFiles[i], {
                headers: { "Content-Type": acceptedFiles[i]?.type },
              })
              .then((response) => {
                console.log(response);
                console.log("Successfully uploaded ", acceptedFiles[i]?.name);
              })
              .catch((err) => console.error(err));
          });

          await Promise.all(promises);

          setSubmitDisabled(true);
          await apiUtils.s3.getObjects.invalidate();
        }
      })
      .catch((err) => console.error(err));
  }, [acceptedFiles, apiUtils.s3.getObjects]);

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
