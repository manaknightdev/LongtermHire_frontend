import { StringCaser } from "@/utils/utils";
import { memo, ReactNode, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";

export type ModalClassType = {
  modalDialog?: string;
  modal?: string;
  modalContent?: string;
};

interface ModalProps {
  isOpen: boolean;
  zIndex?: number;
  disableCancel?: boolean;
  children: ReactNode;
  title: ReactNode | string;
  modalCloseClick: () => void;
  modalHeader: boolean;
  classes: ModalClassType;
  page?: string;
}

const Modal = ({
  title,
  isOpen,
  zIndex,
  children,
  page = "",
  modalHeader,
  modalCloseClick,
  disableCancel = false,
  classes = { modal: "h-full", modalDialog: "h-[90%]", modalContent: "" },
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const stringCaser = new StringCaser();

  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }
  // }, [isOpen]);

  useEffect(() => {
    const scrollableElements = document.querySelectorAll(
      "body, .scrollable-container" // Add other selectors if needed
    ) as unknown as any[];

    if (isOpen) {
      scrollableElements.forEach((element) => {
        element.style.overflow = "hidden";
      });
    } else {
      scrollableElements.forEach((element) => {
        element.style.overflow = "auto";
      });
    }

    return () => {
      scrollableElements.forEach((element) => {
        element.style.overflow = "auto";
      });
    };
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      style={{
        zIndex: zIndex ?? 999999999999,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      className={`fixed bottom-0 left-0 right-0 top-0 flex w-full scale-0 items-center justify-center bg-[#00000099] p-[1.5rem] backdrop-blur-sm transition-all ${
        isOpen ? "scale-100" : "scale-0"
      } ${classes?.modal}`}
    >
      <div
        className={`border-border border ${
          page === "ManagePermissionAddRole" ? "w-fit" : "w-[80%]"
        } bg-background relative overflow-auto rounded-lg pb-5 shadow ${
          classes?.modalDialog
        }`}
      >
        {modalHeader && (
          <div
            style={{
              zIndex: 1,
            }}
            className={`bg-background sticky inset-x-0 top-0 m-auto flex w-full justify-between border-b border-border px-5 py-4`}
          >
            <div className="font-iowan text-center text-[1.25rem] font-[700] capitalize leading-[1.5rem] tracking-[-1.5%] text-text">
              {["string"].includes(typeof title)
                ? stringCaser.Capitalize(title as string, {
                    separator: " ",
                  })
                : title}
            </div>
            {disableCancel ? null : (
              <button
                type="button"
                className="modal-close cursor-pointer text-icon hover:text-icon-hover transition-colors duration-200"
                onClick={modalCloseClick}
              >
                <MdClose className="text-xl" />
              </button>
            )}
          </div>
        )}

        <div className={`-z-10 mt-4 px-5 ${classes?.modalContent}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const ModalMemo = memo(Modal);
export { ModalMemo as Modal };
