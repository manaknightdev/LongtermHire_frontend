import React from "react";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router";
import { Link, NavLink, useLocation } from "react-router-dom";
import { WireframeIcon } from "@/assets/svgs/adminHeader";
import { MKDLOGO } from "@/assets/images";
import { LazyLoad } from "@/components/LazyLoad";
import { useContexts } from "@/hooks/useContexts";

const HeaderLogo = () => {
  const {
    globalState: { isOpen, path },
    globalDispatch,
    authDispatch: dispatch
  } = useContexts();

  const navigate = useNavigate();
  const { profile } = useProfile();

  let toggleOpen = (open: boolean) => {
    globalDispatch({
      type: "OPEN_SIDEBAR",
      payload: { isOpen: open }
    });
  };

  return (
    <div
      className={`relative flex items-center w-full h-14 max-h-14 min-h-14  text-[#393939] `}
    >
      <Link
        to="/"
        className={`flex w-full h-full items-center  ${isOpen ? "gap-5 " : "justify-center gap-0"}`}
      >
        <img className={"h-[70%] object-contain "} src={MKDLOGO} />
        {isOpen ? (
          <h4 className="flex cursor-pointer  items-center  font-sans font-bold">
            MTP - Builder
          </h4>
        ) : null}
      </Link>

      <svg
        onClick={() => toggleOpen(!isOpen)}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute -right-3 inset-y-0 m-auto cursor-pointer ${isOpen ? "rotate-180" : ""}`}
      >
        <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="white" />
        <rect
          x="0.5"
          y="0.5"
          width="19"
          height="19"
          rx="9.5"
          stroke="#1F1D1A"
        />
        <path
          d="M8.66602 6.66667L11.9993 10L8.66602 13.3333"
          stroke="#1F1D1A"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default HeaderLogo;
