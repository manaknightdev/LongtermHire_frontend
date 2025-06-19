import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

const Title = ({ children, className = "" }: TitleProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const titleStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND_SECONDARY,
    borderBottomColor: THEME_COLORS[mode].BORDER,
    color: THEME_COLORS[mode].TEXT,
    boxShadow: `0 4px 6px -1px ${THEME_COLORS[mode].SHADOW}20, 0 2px 4px -1px ${THEME_COLORS[mode].SHADOW}10`,
  };

  return (
    <div
      className={`flex h-[3rem] w-full items-center gap-5 rounded-t-[.75rem] border-b py-[.5rem] pl-[.75rem] pr-[1rem] font-inter text-[1.125rem] font-[600] leading-[1.5rem] tracking-[-1.5%] transition-colors duration-200 md:w-[38.5625rem] ${className}`}
      style={titleStyles}
    >
      {children}
    </div>
  );
};

export default Title;
