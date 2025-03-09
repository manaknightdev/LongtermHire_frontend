import { useState } from "react";

interface NotificationItemProps {
  type: string;
  mainText: string;
  title: string;
  time: string;
  isRead?: boolean;
}
const NotificationItem = ({
  type,
  mainText,
  title,
  time,
  isRead = false,
}: NotificationItemProps) => {
  const [markAsRead, setMarkAsRead] = useState(isRead);
  return (
    <div
      className={`flex items-start py-5 px-2 gap-3 max-w-md text-left ${markAsRead ? "text-[#525252]" : "text-black"}`}
    >
      <div>
        {type === "success" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.5805 9.97493C15.8428 9.65434 15.7955 9.18183 15.4749 8.91953C15.1543 8.65724 14.6818 8.70449 14.4195 9.02507L10.4443 13.8837L9.03033 12.4697C8.73744 12.1768 8.26256 12.1768 7.96967 12.4697C7.67678 12.7626 7.67678 13.2374 7.96967 13.5303L9.96967 15.5303C10.1195 15.6802 10.3257 15.7596 10.5374 15.7491C10.749 15.7385 10.9463 15.6389 11.0805 15.4749L15.5805 9.97493Z"
              fill={`${markAsRead ? "#525252" : "#16A34A"}`}
            />
          </svg>
        ) : type === "error" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.4902 2.84406C11.1661 1.69 12.8343 1.69 13.5103 2.84406L22.0156 17.3654C22.699 18.5321 21.8576 19.9999 20.5056 19.9999H3.49483C2.14281 19.9999 1.30147 18.5321 1.98479 17.3654L10.4902 2.84406ZM12 9C12.4142 9 12.75 9.33579 12.75 9.75V13.25C12.75 13.6642 12.4142 14 12 14C11.5858 14 11.25 13.6642 11.25 13.25V9.75C11.25 9.33579 11.5858 9 12 9ZM13 15.75C13 16.3023 12.5523 16.75 12 16.75C11.4477 16.75 11 16.3023 11 15.75C11 15.1977 11.4477 14.75 12 14.75C12.5523 14.75 13 15.1977 13 15.75Z"
              fill={`${markAsRead ? "#525252" : "#DC2626"}`}
            />
          </svg>
        ) : type === "info" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM10 11C10 10.5858 10.3358 10.25 10.75 10.25H12C12.4142 10.25 12.75 10.5858 12.75 11L12.75 16.25C12.75 16.6642 12.4142 17 12 17C11.5858 17 11.25 16.6642 11.25 16.25L11.25 11.75H10.75C10.3358 11.75 10 11.4142 10 11ZM12 7.25C11.5858 7.25 11.25 7.58579 11.25 8C11.25 8.41421 11.5858 8.75 12 8.75C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25Z"
              fill={`${markAsRead ? "#525252" : "#4F46E5"}`}
            />
          </svg>
        ) : type === "warning" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 13C11.45 13 11 12.55 11 12V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V12C13 12.55 12.55 13 12 13ZM13 17H11V15H13V17Z"
              fill={`${markAsRead ? "#525252" : "#F59E0B"}`}
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM10 11C10 10.5858 10.3358 10.25 10.75 10.25H12C12.4142 10.25 12.75 10.5858 12.75 11L12.75 16.25C12.75 16.6642 12.4142 17 12 17C11.5858 17 11.25 16.6642 11.25 16.25L11.25 11.75H10.75C10.3358 11.75 10 11.4142 10 11ZM12 7.25C11.5858 7.25 11.25 7.58579 11.25 8C11.25 8.41421 11.5858 8.75 12 8.75C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25Z"
              fill={`${markAsRead ? "#525252" : "#4F46E5"}`}
            />
          </svg>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">{title}</span>
          <div className="flex items-center gap-2">
            {!markAsRead && (
              <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
            )}
            <span>{time}</span>
            <span className="relative">
              <button className="peer cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.66663 2.66668C6.66663 1.9303 7.26358 1.33334 7.99996 1.33334C8.73634 1.33334 9.33329 1.9303 9.33329 2.66668C9.33329 3.40306 8.73634 4.00001 7.99996 4.00001C7.26358 4.00001 6.66663 3.40306 6.66663 2.66668ZM6.66663 8.00001C6.66663 7.26363 7.26358 6.66668 7.99996 6.66668C8.73634 6.66668 9.33329 7.26363 9.33329 8.00001C9.33329 8.73639 8.73634 9.33334 7.99996 9.33334C7.26358 9.33334 6.66663 8.73639 6.66663 8.00001ZM6.66663 13.3333C6.66663 12.597 7.26358 12 7.99996 12C8.73634 12 9.33329 12.597 9.33329 13.3333C9.33329 14.0697 8.73634 14.6667 7.99996 14.6667C7.26358 14.6667 6.66663 14.0697 6.66663 13.3333Z"
                    fill="#8D8D8D"
                  />
                </svg>
              </button>
              <ul className="absolute right-2 top-[85%] z-20 hidden rounded-lg border border-[#a8a8a8] bg-white p-2 text-sm text-[#525252] shadow-md hover:block focus:block peer-focus:block peer-focus-visible:block whitespace-nowrap">
                {/* <li
                                    className="hover:text[#262626] flex cursor-pointer items-center rounded-md px-4 py-3 hover:bg-[#F4F4F4]"
                                >
                                    <span className="mr-2" >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M6.3199 4.16666C6.90053 2.7025 8.32902 1.66666 10.0007 1.66666C11.6725 1.66666 13.1009 2.7025 13.6816 4.16666H17.7083C18.0535 4.16666 18.3333 4.44649 18.3333 4.79166C18.3333 5.13684 18.0535 5.41666 17.7083 5.41666H16.6276L15.8823 16.9689C15.8328 17.7363 15.196 18.3333 14.427 18.3333H5.57293C4.80396 18.3333 4.16713 17.7363 4.11762 16.9689L3.37232 5.41666H2.29163C1.94645 5.41666 1.66663 5.13684 1.66663 4.79166C1.66663 4.44649 1.94645 4.16666 2.29163 4.16666H6.3199ZM7.71797 4.16666C8.19942 3.41479 9.04236 2.91666 10.0007 2.91666C10.9591 2.91666 11.8021 3.41479 12.2835 4.16666H7.71797ZM8.74996 8.95833C8.74996 8.61315 8.47014 8.33333 8.12496 8.33333C7.77978 8.33333 7.49996 8.61315 7.49996 8.95833V13.5417C7.49996 13.8868 7.77978 14.1667 8.12496 14.1667C8.47014 14.1667 8.74996 13.8868 8.74996 13.5417V8.95833ZM11.875 8.33333C12.2201 8.33333 12.5 8.61315 12.5 8.95833V13.5417C12.5 13.8868 12.2201 14.1667 11.875 14.1667C11.5298 14.1667 11.25 13.8868 11.25 13.5417V8.95833C11.25 8.61315 11.5298 8.33333 11.875 8.33333Z" fill="#A8A8A8" />
                                        </svg>
                                    </span>
                                    <span>Delete</span>
                                </li> */}
                <li
                  className="flex cursor-pointer items-center rounded-md px-4 py-3 hover:bg-[#F4F4F4] hover:text[#262626]"
                  onClick={() => setMarkAsRead(true)}
                >
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M3.32197 10C3.32197 6.3181 6.30674 3.33333 9.98863 3.33333C12.2705 3.33333 13.7909 4.30074 15.3203 6.04167H12.9167C12.6866 6.04167 12.5 6.22821 12.5 6.45833C12.5 6.68845 12.6866 6.875 12.9167 6.875H15.8334C16.2936 6.875 16.6667 6.5019 16.6667 6.04167V3.125C16.6667 2.89488 16.4801 2.70833 16.25 2.70833C16.0199 2.70833 15.8334 2.89488 15.8334 3.125V5.36447C14.2399 3.58924 12.5314 2.5 9.98863 2.5C5.8465 2.5 2.48863 5.85786 2.48863 10C2.48863 14.1421 5.8465 17.5 9.98863 17.5C13.2548 17.5 16.0324 15.4124 17.0618 12.5C17.1384 12.283 17.0247 12.0449 16.8078 11.9683C16.5908 11.8916 16.3527 12.0053 16.2761 12.2223C15.3607 14.8121 12.8907 16.6667 9.98863 16.6667C6.30674 16.6667 3.32197 13.6819 3.32197 10Z"
                        fill="#A8A8A8"
                        stroke="#A8A8A8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>Mark as read</span>
                </li>
              </ul>
            </span>
          </div>
        </div>

        <div className="mb-5">{mainText}</div>
        <div
          className={`${markAsRead ? "#525252" : "text-[#6366F1]"} font-semibold cursor-pointer hover:underline`}
        >
          Details
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
