import { IoMdClose } from "react-icons/io";
import Sidebar from "./Sidebar";

interface MobileSidebarProps {
  toggleComponentVisibility: () => void;
  setCurrentRoom: (room: any) => void;
  chatRooms: string[];
  setChatRooms: (rooms: string[]) => void;
}

const MobileSiderbar = (props: MobileSidebarProps) => {
  const { toggleComponentVisibility, setCurrentRoom, chatRooms, setChatRooms } =
    props;

  return (
    <div id="headlessui-portal-root display:hidden">
      <div data-headlessui-portal="">
        <button
          type="button"
          aria-hidden="true"
          className="fixed left-[1px] top-[1px] m-[-1px] h-0 w-[1px] overflow-hidden whitespace-nowrap border-0 p-0"
        ></button>
        <div>
          <div
            className="relative z-40"
            id="headlessui-dialog-:re:"
            role="dialog"
            aria-modal="true"
            data-headlessui-state="open"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 opacity-100"></div>
            <div className="fixed inset-0 z-40 flex">
              <div
                className="relative flex w-full max-w-xs flex-1 translate-x-0 flex-col bg-gray-900"
                id="headlessui-dialog-panel-:rf:"
                data-headlessui-state="open"
              >
                <div className="absolute right-0 top-0 -mr-12 pt-2 opacity-100">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    tabIndex={0}
                    onClick={toggleComponentVisibility}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <IoMdClose className="h-6 w-6 text-white" />
                  </button>
                </div>
                <Sidebar
                  setCurrentRoom={setCurrentRoom}
                  chatRooms={chatRooms}
                  setChatRooms={setChatRooms}
                />
              </div>
              <div className="w-14 flex-shrink-0"></div>
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-hidden="true"
          className="fixed left-[1px] top-[1px] m-[-1px] h-0 w-[1px] overflow-hidden whitespace-nowrap border-0 p-0"
        ></button>
      </div>
    </div>
  );
};

export default MobileSiderbar;
