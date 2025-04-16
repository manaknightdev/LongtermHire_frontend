import React, { memo, useEffect, useRef, useState } from "react";
import { Spinner } from "@/assets/svgs";
import { useSDK } from "@/hooks/useSDK";
import { useContexts } from "@/hooks/useContexts";
import { ToastStatusEnum } from "@/utils/Enums";

interface CameraToUploadProps {
  onSave?: (e?: any) => void;
  uploadSuccess?: (uploadResults: any[]) => void;
}

const CameraToUpload = ({
  onSave = undefined,
  uploadSuccess = undefined
}: CameraToUploadProps) => {
  const { sdk } = useSDK();
  const { showToast, tokenExpireError } = useContexts();

  const photoTrayRef = useRef(null) as any;
  const videoRef = useRef(null) as any;
  const canvasRef = useRef(null) as any;
  const [submitLoading, setSubmitLoading] = useState(false) as unknown as [
    boolean,
    (value: boolean) => void
  ];
  const [showCamera, setShowCamera] = useState(false) as unknown as [
    boolean,
    (value: boolean) => void
  ];
  const [useFrontCam, setUseFrontCam] = useState(true) as unknown as [
    boolean,
    (value: boolean) => void
  ];
  const [photos, setPhotos] = useState([]) as any;

  const constraints = {
    video: {
      facingMode: { exact: useFrontCam ? "user" : "environment" },
      advanced: [{ zoom: 1 }]
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const aspectRatio = video?.videoWidth / video?.videoHeight;

    // Calculate the aspect ratio of the video
    let canvasWidth = video?.offsetWidth;
    let canvasHeight = canvasWidth / aspectRatio;

    if (canvasHeight > video?.offsetHeight) {
      canvasHeight = video?.offsetHeight;
      canvasWidth = canvasHeight * aspectRatio;
    }

    // Set the canvas size based on the aspect ratio of the video
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw the current video frame on the canvas
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvasWidth, canvasHeight);

    // Convert the canvas data to a blob
    canvas.toBlob((blob: any) => {
      // Upload the blob to the server
      setPhotos((prev: any) => [...prev, blob]);
      if (!photos.length) {
        photoTrayRef.current.style.maxHeight = `200px`;
      }
    });
  };

  const handleStream = (stream: MediaStream) => {
    const video = videoRef.current;
    video.style.display = "block";
    video.srcObject = stream;
    video.play();
  };
  async function uploadFunction(formData: FormData) {
    try {
      let uploadResult = await sdk.uploadImage(formData);

      if (!uploadResult.error) {
        return uploadResult?.url; // Return the response data from the server
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  const handleUpload = async () => {
    if (!uploadSuccess) {
      throw new Error("uploadSuccess is not a function");
    }
    setSubmitLoading(true);
    try {
      if (photos && photos.length) {
        const uploadPromises = photos.map(async (item: string | Blob) => {
          let formData = new FormData();
          formData.append("file", item);

          // Perform the upload operation for 'item' and return the result
          return uploadFunction(formData); // Replace 'uploadFunction' with your actual upload logic
        });
        const uploadResults = await Promise.all(uploadPromises);
        // Process uploadResults if needed
        showToast("Upload Successful", 5000, ToastStatusEnum.SUCCESS);
        uploadSuccess(uploadResults);
      }
      setSubmitLoading(false);
    } catch (error: any) {
      setSubmitLoading(false);
      const errorMessage = error?.response?.data?.message
        ? error?.response?.data?.message
        : error?.message;

      tokenExpireError(errorMessage);
      showToast(errorMessage, 5000, ToastStatusEnum.ERROR);
      // Handle errors
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(photos);
    }
  };

  const handleError = (error: unknown) => {
    console.error("Error accessing camera:", error);
  };

  const startCapture = async () => {
    try {
      // Request access to the camera
      const stream = await navigator.mediaDevices.getUserMedia(
        constraints as MediaStreamConstraints
      );

      setShowCamera(true);
      // Display the camera feed on the video element
      handleStream(stream);
    } catch (error) {
      handleError(error);
    }
  };

  const stopCapture = () => {
    // Stop all tracks in the stream
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject
        .getTracks()
        .forEach((track: { stop: () => any }) => track.stop());
    }
    setPhotos(() => []);
    setShowCamera(false);
    // Release the camera resources
    videoRef.current.srcObject = null;
  };
  const removeItem = (index: number) => {
    const tempPhotos = [...photos];
    tempPhotos.splice(index, 1);
    setPhotos(() => [...tempPhotos]);
  };

  useEffect(() => {
    if (photos.length === 0) {
      photoTrayRef.current.style.maxHeight = null;
    }
  }, [photos.length]);

  return (
    <>
      <fieldset
        className={`cus-input mt-5 block w-full cursor-pointer md:w-[23rem] `}
      >
        <div className="relative mb-2 flex  h-[4.125rem] w-full items-center  rounded-[1.25rem_1.25rem_0rem_1.25rem] border border-blue-600 ">
          <div
            id="profile_picture"
            // {...register("profile_picture")}
            className={`flex h-full grow items-center justify-center rounded-[1.25rem]  bg-white text-[1.375rem] text-black`}
          >
            <span className="block md:hidden">Take picture now</span>
            <span className="hidden text-xs md:block">
              Switch to Mobile to take picture
            </span>
          </div>
          <div
            onClick={() => startCapture()}
            className={`flex h-full w-[5.625rem] min-w-[5.625rem] items-center justify-center rounded-[0rem_1.25rem] bg-blue-600 md:hidden`}
          >
            camera
          </div>
        </div>
        <p className="text-field-error mb-5 italic text-red-500"></p>
      </fieldset>

      <div
        className={`${
          showCamera
            ? "fixed left-0 right-0 top-0 z-[99999999] m-auto block h-screen w-full"
            : "hidden"
        }`}
      >
        <div className={`relative h-screen w-full  bg-black`}>
          <video
            ref={videoRef}
            className={`relative z-[99999999] h-screen w-full  object-cover`}
            style={{ transform: "rotateY(180deg)" }}
          />
          <div
            className={`${
              submitLoading ? "flex" : "hidden"
            } absolute inset-0 z-[999999992] m-auto h-full w-full items-center justify-center `}
          >
            <Spinner size={100} color="#0EA5E9" />
          </div>
          {!submitLoading ? (
            <div
              className={`absolute inset-x-0 top-0 z-[999999991] m-auto flex h-fit w-full cursor-pointer flex-col flex-wrap items-center justify-center gap-5 pr-2 text-[2rem] text-black`}
            >
              <div
                onClick={() => stopCapture()}
                className={`relative flex h-[50px] w-[50px] cursor-pointer flex-col items-center justify-center self-end rounded-[50%] bg-white text-lg leading-[50px] text-black`}
              >
                x
              </div>
              <div className="flex w-full justify-end gap-5">
                <div
                  className={`${
                    photos.length && onSave ? "block" : "hidden"
                  } text-sm`}
                  onClick={() => handleSave()}
                >
                  save {photos.length > 1 ? "photos" : "photo"}
                </div>
                <div
                  className={`${photos.length ? "block" : "hidden"} text-sm`}
                  onClick={() => handleUpload()}
                >
                  upload {photos.length > 1 ? "photos" : "photo"}
                </div>
                <div
                  className={`${photos.length ? "block" : "hidden"} text-sm`}
                  onClick={() => setPhotos(() => [])}
                >
                  clear
                </div>
                <div
                  className="text-sm"
                  onClick={() => setUseFrontCam(!useFrontCam)}
                >
                  {useFrontCam ? "Use Rare Cam" : "Use Front Cam"}
                </div>
              </div>
            </div>
          ) : null}

          <div
            onClick={() => handleCapture()}
            className={`absolute inset-x-0 ${
              photos.length ? "bottom-[6.5625rem]" : "bottom-8"
            } z-[999999991] m-auto flex h-[3.75rem] w-[3.75rem] cursor-pointer items-center justify-center rounded-[50%] bg-white text-[1rem] text-black transition-all`}
          >
            <div
              className={`relative inset-x-0 z-[999999991] m-auto flex h-[50%] w-[50%] cursor-pointer items-center justify-center rounded-md bg-black`}
            ></div>
          </div>
          <div
            ref={photoTrayRef}
            className={`absolute bottom-0 left-0 right-0 z-[999999991] m-auto flex max-h-0 w-full items-center justify-start gap-2 overflow-x-auto overflow-y-hidden  transition-all`}
          >
            {photos.length
              ? photos.map(
                  (
                    photo: Blob | MediaSource,
                    photoKey: React.Key | null | undefined
                  ) => (
                    <div
                      key={photoKey}
                      className="relative h-fit w-[5rem] min-w-[5rem] max-w-[5rem] rounded-md bg-white"
                    >
                      <img
                        style={{ transform: "rotateY(180deg)" }}
                        className="w-full rounded-md"
                        src={URL.createObjectURL(photo)}
                      />
                      {!submitLoading ? (
                        <div
                          onClick={() => removeItem(photoKey as number)}
                          className={`absolute right-0 top-0 z-[999999991] m-auto flex h-[1rem] w-[1rem] cursor-pointer items-center justify-center rounded-[50%] text-sm leading-[0.5rem_!important] text-red-600`}
                        >
                          x
                        </div>
                      ) : null}
                    </div>
                  )
                )
              : null}
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        style={{ display: "none", transform: "rotateY(180deg)" }}
      />
    </>
  );
};

export default memo(CameraToUpload);
