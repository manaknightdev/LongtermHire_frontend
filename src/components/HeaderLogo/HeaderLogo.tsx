import React from "react";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router";
import { Link, NavLink, useLocation } from "react-router-dom";
import { WireframeIcon } from "@/assets/svgs/adminHeader";
import { BrandLogo } from "@/assets/images";
import { LazyLoad } from "@/components/LazyLoad";
import { useContexts } from "@/hooks/useContexts";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

const HeaderLogo = () => {
  const {
    globalState: { isOpen, path },
    globalDispatch,
    authDispatch: dispatch,
  } = useContexts();

  const navigate = useNavigate();
  const { profile } = useProfile();
  const { state } = useTheme();
  const mode = state?.theme;

  let toggleOpen = (open: boolean) => {
    globalDispatch({
      type: "OPEN_SIDEBAR",
      payload: { isOpen: open },
    });
  };

  const containerStyles = {
    color: THEME_COLORS[mode].TEXT,
  };

  const toggleButtonStyles = {
    fill: THEME_COLORS[mode].BACKGROUND,
    stroke: THEME_COLORS[mode].BORDER,
  };

  return (
    <div
      className={`relative flex items-center w-full h-14 max-h-14 min-h-14 transition-colors duration-200`}
      style={containerStyles}
    >
      <Link
        to="/"
        className={`flex w-full h-full items-center hover:opacity-80 transition-opacity duration-200 ${isOpen ? "gap-5 " : "justify-center gap-0"}`}
      >
        <img className={"h-[70%] object-contain "} src={BrandLogo} />
        {isOpen ? (
          <h4
            className="flex cursor-pointer items-center font-sans font-bold"
            style={{ color: THEME_COLORS[mode].TEXT }}
          >
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
        className={`absolute -right-3 inset-y-0 m-auto cursor-pointer transition-transform duration-200 hover:scale-110 ${isOpen ? "rotate-180" : ""}`}
      >
        <rect
          x="0.5"
          y="0.5"
          width="19"
          height="19"
          rx="9.5"
          fill={THEME_COLORS[mode].BACKGROUND}
        />
        <rect
          x="0.5"
          y="0.5"
          width="19"
          height="19"
          rx="9.5"
          stroke={THEME_COLORS[mode].BORDER}
        />
        <path
          d="M8.66602 6.66667L11.9993 10L8.66602 13.3333"
          stroke={THEME_COLORS[mode].TEXT}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default HeaderLogo;
