import React, { useState } from "react";
import { useSDK } from "@/hooks/useSDK";
import { MkdButton } from "@/components/MkdButton";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdInputV2HookFormExample } from "@/components/MkdInputV2";

const TestUpload = () => {
  const { sdk } = useSDK();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (file && sdk) {
      try {
        // let formData = new FormData();
        // formData.append("file", file);
        const result = await sdk.uploadImage(file);
        console.log("Upload successful:", result);
        // Handle successful upload (e.g., show success message, update UI)
      } catch (error) {
        console.error("Upload failed:", error);
        // Handle error (e.g., show error message)
      }
    }
  };

  return (
    <div className={`h-full min-h-full max-h-full overflow-auto`}>
      <div className="flex flex-col items-center space-y-4 p-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />{" "}
        <label
          htmlFor="fileInput"
          className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 max-w-full"
            />
          ) : (
            <div className="text-center">
              <p>Click to select an image</p>{" "}
              <p className="text-sm text-gray-500">or drag and drop here</p>
            </div>
          )}
        </label>{" "}
        <MkdButton onClick={handleUpload} disabled={!file} className="mt-4">
          Upload Image{" "}
        </MkdButton>
      </div>

      <LazyLoad>
        <MkdInputV2HookFormExample />
      </LazyLoad>
    </div>
  );
};

export default TestUpload;
