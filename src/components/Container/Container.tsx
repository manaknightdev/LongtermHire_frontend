import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const containerStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND_SECONDARY,
    borderColor: THEME_COLORS[mode].BORDER,
    boxShadow: `0 4px 6px -1px ${THEME_COLORS[mode].SHADOW}20, 0 2px 4px -1px ${THEME_COLORS[mode].SHADOW}10`,
  };

  return (
    <div
      className={`min-h-fit !w-full items-center space-y-5 rounded-[.75rem] border p-[1.5rem] transition-colors duration-200 ${className}`}
      style={containerStyles}
    >
      {children}
    </div>
  );
};

export default Container;
