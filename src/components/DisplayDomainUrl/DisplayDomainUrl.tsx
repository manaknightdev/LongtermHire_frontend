import React from "react";
import { GlobalContext, showToast } from "@/context/Global";

interface DisplayDomainUrlProps {
  text?: string;
}
const DisplayDomainUrl = ({ text = "" }: DisplayDomainUrlProps) => {
  const { dispatch: globalDispatch } = React.useContext(GlobalContext);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    showToast(globalDispatch, "Copied to clipboard");
  }

  return (
    <div className="flex items-center rounded-md border border-[#E0E0E0] text-sm">
      {text?.length ? (
        <span className="w-[90%] bg-[#F9F9F9] px-3 py-2 text-[#525252]">
          {text}
        </span>
      ) : null}
      <span
        className="mr-1 min-w-[20px] cursor-pointer bg-white px-2 py-1.5"
        onClick={() => copyToClipboard(text)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <g clipPath="url(#clip0_273_13777)">
            <path
              d="M6.66699 6.6665V4.33317C6.66699 3.39975 6.66699 2.93304 6.84865 2.57652C7.00844 2.26292 7.2634 2.00795 7.57701 1.84816C7.93353 1.6665 8.40024 1.6665 9.33366 1.6665H15.667C16.6004 1.6665 17.0671 1.6665 17.4236 1.84816C17.7372 2.00795 17.9922 2.26292 18.152 2.57652C18.3337 2.93304 18.3337 3.39975 18.3337 4.33317V10.6665C18.3337 11.5999 18.3337 12.0666 18.152 12.4232C17.9922 12.7368 17.7372 12.9917 17.4236 13.1515C17.0671 13.3332 16.6004 13.3332 15.667 13.3332H13.3337M4.33366 18.3332H10.667C11.6004 18.3332 12.0671 18.3332 12.4236 18.1515C12.7372 17.9917 12.9922 17.7368 13.152 17.4232C13.3337 17.0666 13.3337 16.5999 13.3337 15.6665V9.33317C13.3337 8.39975 13.3337 7.93304 13.152 7.57652C12.9922 7.26292 12.7372 7.00795 12.4236 6.84816C12.0671 6.6665 11.6004 6.6665 10.667 6.6665H4.33366C3.40024 6.6665 2.93353 6.6665 2.57701 6.84816C2.2634 7.00795 2.00844 7.26292 1.84865 7.57652C1.66699 7.93304 1.66699 8.39975 1.66699 9.33317V15.6665C1.66699 16.5999 1.66699 17.0666 1.84865 17.4232C2.00844 17.7368 2.2634 17.9917 2.57701 18.1515C2.93353 18.3332 3.40024 18.3332 4.33366 18.3332Z"
              stroke="#A8A8A8"
              stroke-width="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_273_13777">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </span>
    </div>
  );
};

export default DisplayDomainUrl;
