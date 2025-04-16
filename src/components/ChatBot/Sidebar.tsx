import { GlobalContext } from "@/context/Global";
import { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";

interface SidebarProps {
  setChatRooms: (rooms: string[]) => void;
  chatRooms: string[];
  setCurrentRoom: (index: any) => void;
}

const Sidebar = ({ setChatRooms, chatRooms, setCurrentRoom }: SidebarProps) => {
  const { state } = useContext(GlobalContext);

  return (
    <div className="scrollbar-trigger flex h-screen w-full flex-1 items-start border-white/20">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        <button
          onClick={() => {
            setChatRooms([...chatRooms, "new room"]);
            setCurrentRoom(chatRooms.length);
          }}
          className="mb-1 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border border-white/20 px-3 py-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
        >
          <AiOutlinePlus className="h-4 w-4" />
          New chat
        </button>

        {chatRooms?.map((_chatRoom: any, index: any) => (
          <div
            onClick={() => setCurrentRoom(index)}
            className="flex-0 flex-col overflow-y-auto border-b border-white/20"
          >
            <div className="flex flex-col gap-2 pb-2 text-sm text-gray-100">
              <a className="group relative flex cursor-pointer items-center gap-3 break-all rounded-md px-3 py-3 hover:bg-[#2A2B32] hover:pr-4">
                <FiMessageSquare className="h-4 w-4" />
                <div className="flex- relative max-h-5 overflow-hidden text-ellipsis break-all">
                  {state?.rooms[index]?.value ?? "New Conversation"}
                  <div className="absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
                </div>
              </a>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
