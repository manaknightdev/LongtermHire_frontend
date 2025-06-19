import React, { useState } from "react";
import { useSDK } from "@/hooks/useSDK";
// import { MkdButton } from "@/components/MkdButton";
// import { MkdInputV2HookFormExample } from "@/components/MkdInputV2";
// import MkdListTableWithQueryExample from "@/components/MkdListTable/MkdListTableWithQuery.example";

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
     
    </div>
  );
};

export default TestUpload;
