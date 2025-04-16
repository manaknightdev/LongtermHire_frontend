import React, { useState } from "react";
import Chat from "./Chat";
import MobileSiderbar from "./MobileSidebar";
import Sidebar from "./Sidebar";
import { BiRefresh } from "react-icons/bi";
import { useSDK } from "@/hooks/useSDK";

function ChatBot() {
  const [chatRooms, setChatRooms] = React.useState(["old"]);
  const [runPod, setRunPod] = React.useState("") as any;
  const [currentRoom, setCurrentRoom] = React.useState(0);
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  // const _d = chatRooms.filter((_room: any, index: any) => index === currentRoom);
  const { sdk } = useSDK();

  const toggleComponentVisibility = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const runPodStatus = async () => {
    try {
      const response = await sdk.runPodStatus();

      if (!response.error) {
        setRunPod(response.status ?? "Not Running");
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    runPodStatus();
  }, []);

  return (
    <div className="relative text-center">
      <main className="overflow-hidde relative flex h-screen w-full">
        {isComponentVisible ? (
          <MobileSiderbar
            setCurrentRoom={setCurrentRoom}
            chatRooms={chatRooms}
            setChatRooms={setChatRooms}
            toggleComponentVisibility={toggleComponentVisibility}
          />
        ) : null}
        <div className="dark hidden flex-shrink-0 bg-gray-900 md:flex md:w-[260px] md:flex-col">
          <div className="flex h-full min-h-0 flex-col ">
            <Sidebar
              setCurrentRoom={setCurrentRoom}
              chatRooms={chatRooms}
              setChatRooms={setChatRooms}
            />
          </div>
        </div>
        {chatRooms?.map((_chatRoom: any, index: any) => (
          <Chat
            key={index}
            index={index}
            currentRoom={currentRoom}
            toggleComponentVisibility={toggleComponentVisibility}
          />
        ))}
      </main>
      <div className="absolute right-2 top-12 flex items-center gap-2 sm:right-4 sm:top-7">
        <span className="rounded-md bg-white p-2 text-xs font-bold">
          RunPod: {runPod}
        </span>
        <BiRefresh
          onClick={() => runPodStatus()}
          className="text-xl text-green-600 hover:cursor-pointer"
        />
      </div>
    </div>
  );
}

export default ChatBot;
