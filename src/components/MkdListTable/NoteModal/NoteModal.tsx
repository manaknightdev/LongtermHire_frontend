import { Modal } from "@/components/Modal";
import { MkdButton } from "@/components/MkdButton";
import { InteractiveButton } from "@/components/InteractiveButton";

interface NoteModalProps {
  onClose: () => void;
  isOpen: boolean;
  note?: string;
}

export const NoteModal = ({ onClose, isOpen, note }: NoteModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      modalCloseClick={() => onClose && onClose()}
      title="Note"
      modalHeader
      classes={{
        modalDialog:
          "!grid grid-rows-[auto_85%] !w-full !px-0 md:!w-[35.375rem] md:min-h-[50%] md:h-[50%] md:max-h-[50%] max-h-[50%] min-h-[50%]",
        modalContent: `!z-10 !px-0 overflow-hidden !pt-0`,
        modal: "h-full",
      }}
    >
      <div className={`h-full min-h-full`}>
        {isOpen ? (
          <>
            <div
              className={`!font-inter relative mx-auto grid h-full max-h-full min-h-full w-full grow grid-cols-1 grid-rows-[90%_10%] rounded text-start leading-snug tracking-wide`}
            >
              <div className="w-full gap-5 overflow-y-auto pb-10 ">
                <div className="w-full space-y-5 px-5">
                  <div className="font-inter text-justify text-lg font-medium leading-snug tracking-wider">
                    {note}
                  </div>
                </div>
              </div>

              <div className="relative flex gap-5 px-5">
                <div className="grow"></div>
                <div
                  className={`flex h-fit w-[15.6875rem] items-center gap-[.75rem]`}
                >
                  <MkdButton
                    onClick={() => onClose()}
                    className={`!bg-soft-200 !text-sub-500 !hidden !grow !border-none`}
                  >
                    Cancel
                  </MkdButton>
                  <InteractiveButton
                    type="submit"
                    // loading={updateModel?.loading}

                    className="!hidden !grow px-4 py-2 font-bold capitalize text-white"
                  >
                    Update and Close
                  </InteractiveButton>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
};

export default NoteModal;
