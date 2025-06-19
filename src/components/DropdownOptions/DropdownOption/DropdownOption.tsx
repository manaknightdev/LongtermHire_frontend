import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface DropdownOptionProps {
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  name: string;
  style?: React.CSSProperties;
  className?: string;
}
const DropdownOption = ({
  icon,
  onClick = () => {},
  name,
  style = {},
  className = "",
}: DropdownOptionProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const optionStyles = {
    color: THEME_COLORS[mode].TEXT,
    ...style,
  };

  const hoverStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND_SECONDARY,
  };
  return (
    <div
      style={optionStyles}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-4 py-3 capitalize transition-colors duration-200 hover:bg-background-secondary ${className}`}
      onClick={(e) => {
        onClick(e);
      }}
    >
      {icon && <span className=""> {icon}</span>}
      {name && <span className=""> {name}</span>}
    </div>
  );
};

export default DropdownOption;
