import { ViewMapType } from "@/components/ViewWrapper";
import { InteractiveButton } from "@/components/InteractiveButton";
import { LazyLoad } from "@/components/LazyLoad";
import { useProjectConfigHook } from "@/hooks/useProjectConfigHook";
import { useRef } from "react";

interface UploadConfigProps {
  view?: ViewMapType["value"];
}

const UploadConfig = ({}: UploadConfigProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileChange, configuration, handleDeleteConfig } =
    useProjectConfigHook();

  return (
    <>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden mt-4 w-full"
      />

      <div className="flex flex-col gap-4 items-center justify-center">
        {!configuration?.settings?.model_namespace ? (
          <div className="flex flex-col gap-4 items-center justify-center">
            <LazyLoad>
              <InteractiveButton
                className="!px-5 !h-[3rem] !text-[1.5rem]"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Config
              </InteractiveButton>
            </LazyLoad>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="text-2xl font-bold">
              {configuration.settings?.model_namespace}
            </div>
            <LazyLoad>
              <InteractiveButton
                className="!px-5 !h-[3rem] !text-[1.5rem] !bg-red-500 !shadow-red-500"
                onClick={() => {
                  handleDeleteConfig();
                }}
              >
                Delete Config
              </InteractiveButton>
            </LazyLoad>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadConfig;
