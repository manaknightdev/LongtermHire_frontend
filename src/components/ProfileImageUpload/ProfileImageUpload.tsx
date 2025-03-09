import { Title } from "@/components/Title";
import { useRef } from "react";
import { CircularImagePreview } from "@/components/CircularImagePreview";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdButton } from "@/components/MkdButton";

interface ProfileImageUploadProps {
  image: string;
  className?: string;
  title?: string;
  onUpload?: (name: string, file: any, multiple: boolean) => void;
  name?: string;
  multiple?: boolean;
}

const ProfileImageUpload = ({
  image = "",
  className = "",
  title = "Image Upload",
  onUpload,
  name = "photo",
  multiple = false,
}: ProfileImageUploadProps) => {
  const inputRef = useRef(null) as any;

  return (
    <div className={`grid w-full grid-cols-1 gap-[1.5rem] ${className}`}>
      {/* <Title className={"!border-0 !p-0 !shadow-none "}>{title}</Title> */}

      <div className="flex w-full items-start justify-between gap-5 ">
        {image && (
          <div className="p-2">
            <LazyLoad>
              <CircularImagePreview
                image={image}
                className={"h-[5rem] w-[5rem]"}
              />
            </LazyLoad>
          </div>
        )}
        <div className="grid grow grid-cols-1 gap-2">
          <Title className={"!border-0 !p-0 !shadow-none "}>{title}</Title>
          <p className="font-inter text-[.875rem] font-[400] leading-[1.25rem]  tracking-[-0.6%] text-black">
            Min 400x400px, PNG or JPEG
          </p>
          <LazyLoad>
            <MkdButton
              className={`!shadow-0 !w-fit  !bg-white font-[700] !text-black`}
              showPlus={false}
              onClick={() => {
                inputRef?.current?.click();
              }}
            >
              <input
                hidden
                ref={inputRef}
                type="file"
                id={name}
                name={name}
                accept=".jpg,.jpeg,.png"
                multiple={multiple}
                style={{ display: "none" }}
                onChange={(e) => {
                  onUpload?.(name, e.target, multiple);
                  inputRef.current.value = "";
                }}
              />
              Upload
            </MkdButton>
          </LazyLoad>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
