import { useEffect, useRef } from "react";
import {  BiSolidLeftArrowAlt } from "react-icons/bi";

const justification = {
  right: "justify-end",
  left: "justify-start",
};
const closed = {
  right: "translate-x-full",
  left: "-translate-x-full",
};
const open = {
  right: "-translate-x-0",
  left: "-translate-x-0",
};

interface ModalSidebarProps {
  customMinWidthInTw?: string;
  isModalActive?: boolean;
  closeModalFn: () => void;
  children: React.ReactNode;
  showHeader?: boolean;
  title?: any;
  headerClassName?: string;
  headerContentClassName?: string;
  headerContent?: React.ReactNode;
  closePosition?: 1 | 2;
  side?: "right" | "left";
  classes?: {
    modalBody?: string;
  };
}

const ModalSidebar = ({
  customMinWidthInTw = "min-w-full",
  isModalActive = false,
  closeModalFn = () => {},
  children,
  showHeader = false,
  title = "Modal",
  headerClassName = "bg-primary",
  headerContentClassName = "text-white",
  headerContent = null,
  closePosition = 1,
  side = "right",
  classes = { modalBody: "" },
}: ModalSidebarProps) => {
  const modalRef = useRef(null) as any

  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (modalRef.current && !modalRef.current.contains(e.target)) {
  //       closeModalFn();
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const onClose = (e: MouseEvent) => {
    // e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.id === "modal") {
      closeModalFn();
    }
  };

  useEffect(() => {
    if (isModalActive && modalRef) {
      modalRef?.current?.focus() 
    }
  }, [isModalActive]);

  return (
    <div
      id="modal"
      aria-hidden="false"
      autoFocus
      style={{
        zIndex: 9999999999,
      }}
      onMouseDown={onClose as any}
      className={`${justification[side]} transition-all ${
        isModalActive ? open[side] : closed[side]
      } scrollable-container fixed left-0 right-0 top-0 z-[9999999999] flex h-full w-full items-center overflow-y-auto overflow-x-hidden bg-[#292828d2] p-3 backdrop:blur-md md:inset-0 md:h-full`}
    >
      {/* Modal Content */}
      <div
        ref={modalRef}
        autoFocus
        className={`${customMinWidthInTw} scrollable-container relative z-[9999] grid h-full max-h-full min-h-full bg-white ${
          showHeader ? "grid-rows-[auto_1fr]" : "grid-rows-1"
        } bg-weak-100 items-center overflow-y-auto rounded-[.625rem] border-0  pt-0 shadow-xl transition-all ${
          isModalActive ? open[side] : closed[side]
        }`}
      >
        {showHeader ? (
          <div
            className={`sticky top-0 z-[999999999] mb-2 mt-0 flex min-h-[3.25rem] items-center gap-2 px-5 py-2 shadow-md ${headerClassName}`}
          >
            {closePosition == 1 && (
              <div
                onClick={() => {
                  if (!headerContent) {
                    closeModalFn();
                  }
                }}
                className={`non_print_section text[1rem] font-inter flex w-[3.625rem] cursor-pointer items-center gap-2 !whitespace-nowrap font-[600] leading-[1.5rem] ${headerContentClassName}`}
              >
                {headerContent ? (
                  headerContent
                ) : (
                  <>
                    <BiSolidLeftArrowAlt /> Back
                  </>
                )}
              </div>
            )}

            <div className="grow text-center text-lg capitalize text-white">
              {title}
            </div>
            {closePosition == 2 && (
              <div
                onClick={() => {
                  if (!headerContent) {
                    closeModalFn();
                  }
                }}
                className={`non_print_section text[1rem] font-inter w-[3.625rem] cursor-pointer font-[600] leading-[1.5rem] ${headerContentClassName}`}
              >
                {headerContent ? headerContent : "<- Back"}
              </div>
            )}
            {/* <div className="w-fit">{headerContent}</div> */}
          </div>
        ) : null}
        <div
          className={`scrollable-container h-full min-h-full w-full min-w-full max-w-full ${classes?.modalBody}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalSidebar;
