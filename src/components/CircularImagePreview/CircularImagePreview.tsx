import { memo, useState } from "react";
import { Modal } from "@/components/Modal";
import { LazyLoad } from "@/components/LazyLoad";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";
interface CircularImagePreviewProps {
  className?: string;
  image: string;
}

const CircularImagePreview = ({
  className,
  image,
}: CircularImagePreviewProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);

  const imageContainerStyles = {
    borderColor: THEME_COLORS[mode].BORDER,
  };

  return (
    <>
      {image ? (
        <>
          <div
            onClick={() => setShowImagePreviewModal(true)}
            className={`h-[3rem] w-[3rem] cursor-pointer overflow-hidden rounded-full border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
            style={imageContainerStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = THEME_COLORS[mode].PRIMARY;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = THEME_COLORS[mode].BORDER;
            }}
          >
            <img src={image} className="object-cover h-full w-full" alt="" />
          </div>
        </>
      ) : null}

      <LazyLoad>
        <Modal
          isOpen={showImagePreviewModal}
          modalCloseClick={() => setShowImagePreviewModal(false)}
          title="Image Preview"
          modalHeader
          classes={{
            modalDialog:
              "max-h-[90%] h-fit min-h-fit overflow-clip !w-full md:!w-[29.0625rem]",
            modal: "h-full",
            modalContent: "h-full w-full flex items-center",
          }}
        >
          {showImagePreviewModal && (
            <LazyLoad>
              <img
                className="max-h-auto min-h-auto h-auto w-full"
                src={image}
                alt="preview"
              />
            </LazyLoad>
          )}
        </Modal>
      </LazyLoad>
    </>
  );
};

export default memo(CircularImagePreview);
