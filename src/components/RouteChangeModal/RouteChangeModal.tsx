import { LazyLoad } from "@/components/LazyLoad";
import { Modal, ModalClassType } from "@/components/Modal";
import { OptionType, RouteChange } from "./index";

interface RouteChangeModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  options: Array<OptionType>;
  modalClasses?: ModalClassType;
  customMessage?: string,
}

export const RouteChangeModal = ({
  isOpen = false,
  title = "change route",
  onClose,
  options = [
    {
      name: "",
      route: "",
    },
  ],
  modalClasses = {
    modalDialog:
      "max-h-[90%] min-h-[12rem] overflow-y-auto !w-full md:!w-[29.0625rem]",
    modal: "h-full",
  },
}: RouteChangeModalProps) => {
  
  return (
    <LazyLoad>
      <Modal
        isOpen={isOpen}
        modalCloseClick={onClose}
        title={title}
        modalHeader
        classes={modalClasses}
      >
        {isOpen && (
          <LazyLoad>
            <RouteChange onClose={onClose} options={options} />
          </LazyLoad>
        )}
      </Modal>
    </LazyLoad>
  );
};

export default RouteChangeModal;
