import { lazy } from "react";

export const Chat = lazy(() => import("./Chat"));
export const ChatBot = lazy(() => import("./ChatBot"));
export const Message = lazy(() => import("./Message"));
export const MobileSidebar = lazy(() => import("./MobileSidebar"));
export const Sidebar = lazy(() => import("./Sidebar"));
export const TypingEffect = lazy(() => import("./TypingEffect"));

export { consoleWithEllipsis } from "./ChatUtils";
