import { useEffect } from "react";
import { useState } from "react";

interface ImagePreviewModalProps {
  file: File[];
  handleFileUpload: () => void;
  cancelFileUpload: () => void;
}

const ImagePreviewModal = ({
  file,
  handleFileUpload,
  cancelFileUpload,
}: ImagePreviewModalProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (file.length > 0) {
      setImageSrc(URL.createObjectURL(file[0]));
    }
  }, [file]);

  return (
    <>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div
          className="fixed inset-0 h-full w-full bg-black opacity-40"
          onClick={cancelFileUpload}
        ></div>
        <div className="flex min-h-screen items-center px-4 py-8">
          <div className="relative mx-auto w-full max-w-lg rounded-md bg-white p-4 shadow-lg">
            <div className="mt-3 sm:flex">
              <div className="mt-2 text-center sm:ml-4 sm:text-left">
                <h4 className="text-lg font-medium text-gray-800">
                  Send Image{file.length > 1 && "s"}
                </h4>
                <img className="block" src={imageSrc} />
                <div className="mt-3 items-center gap-2 sm:flex">
                  <button
                    className="mr-4 mt-2 w-full flex-1 whitespace-nowrap rounded-md bg-blue-600 p-2.5 text-white outline-none ring-blue-600 ring-offset-2 focus:ring-2"
                    onClick={handleFileUpload}
                  >
                    Send Message
                  </button>
                  <button
                    className="mt-2 w-full flex-1 rounded-md border p-2.5 text-gray-800 outline-none ring-indigo-600 ring-offset-2 focus:ring-2"
                    onClick={cancelFileUpload}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImagePreviewModal;
