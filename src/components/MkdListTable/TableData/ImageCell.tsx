import { LazyLoad } from "@/components/LazyLoad";
import { MkdPopover } from "@/components/MkdPopover";
import { memo } from "react";
import { MdPhoto } from "react-icons/md";

interface ImageCellProps {
  src: string;
  onPopoverStateChange: (state: boolean) => void;
}

const ImageCell = memo(({ src, onPopoverStateChange }: ImageCellProps) => (
  <LazyLoad>
    <MkdPopover
      display={<MdPhoto className="peer h-8 w-8" />}
      openOnClick={false}
      zIndex={999999999999999}
      onPopoverStateChange={onPopoverStateChange}
      place="left-start"
      tooltipClasses={`whitespace-nowrap h-fit min-h-[1rem] max-h-fit w-[18.75rem] !rounded-lg border border-[#a8a8a8] !bg-white p-2 text-sm text-[#525252] shadow-md`}
    >
      <LazyLoad
        className={`h-[18.75rem] w-[18.75rem] whitespace-nowrap !rounded-lg border border-[#a8a8a8] !bg-white p-2 text-sm text-[#525252] shadow-md`}
      >
        <img src={src} className="w-[18.75rem]" alt="" />
      </LazyLoad>
    </MkdPopover>
  </LazyLoad>
));

export default ImageCell;
