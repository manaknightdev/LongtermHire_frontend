import { LazyLoad } from "@/components/LazyLoad";
import { Modal, ModalClassType } from "@/components/Modal";
import { ActionConfirmation } from "@/components/ActionConfirmation";
import { RestAPIMethod } from "@/utils/types/types";
import { RestAPIMethodEnum } from "@/utils/Enums";

interface ActionConfirmationModalProps {
  data?: { id: any } | any;
  options?: {
    endpoint: string | null;
    method: RestAPIMethod | RestAPIMethodEnum;
    payload?: any;
  };
  onSuccess?: (data?: any) => void;
  onClose: () => void;
  multiple?: boolean;
  action?: string;
  mode?: string;
  table?: string;
  title?: string;
  input?: string;
  isOpen: boolean;
  inputConfirmation?: boolean;
  disableCancel?: boolean;
  modalClasses?: ModalClassType;
  customMessage?: string;
  role?: string;
}

export const ActionConfirmationModal = ({
  data = { id: null },
  options = { endpoint: null, method: RestAPIMethodEnum.GET, payload: null },
  onSuccess,
  onClose,
  multiple = false,
  action = "",
  mode = "create",
  table = "",
  title = "",
  input = "input",
  isOpen = false,
  inputConfirmation = true,
  disableCancel = false,
  modalClasses = {
    modalDialog:
      "max-h-[90%] min-h-[12rem] overflow-y-auto !w-full md:!w-[29.0625rem]",
    modal: "h-full",
  },
  customMessage = "",
  role,
}: ActionConfirmationModalProps) => {
  return (
    <LazyLoad>
      <Modal
        isOpen={isOpen}
        modalCloseClick={onClose}
        title={title}
        modalHeader
        classes={modalClasses}
        disableCancel={disableCancel}
      >
        {isOpen && (
          <LazyLoad>
            <ActionConfirmation
              data={data}
              mode={mode}
              input={input}
              table={table}
              action={action}
              onClose={onClose}
              options={options}
              multiple={multiple}
              onSuccess={onSuccess}
              inputConfirmation={inputConfirmation}
              disableCancel={disableCancel}
              customMessage={customMessage}
              role={role}
            />
          </LazyLoad>
        )}
      </Modal>
    </LazyLoad>
  );
};

export default ActionConfirmationModal;
