import React from "react";
import { useMkdInputV2Context } from "./MkdInputV2Context";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

// Label component props
interface MkdInputV2LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const MkdInputV2Label: React.FC<MkdInputV2LabelProps> = ({
  children,
  className = "",
  ...props
}) => {
  const { id, required, type } = useMkdInputV2Context();
  const { state } = useTheme();
  const mode = state?.theme;

  // For radio, checkbox, color, toggle types, we use a different label style
  const isSpecialType = ["radio", "checkbox", "color", "toggle"].includes(
    type!
  );

  const labelStyles = {
    color: THEME_COLORS[mode].TEXT,
  };

  return (
    <label
      htmlFor={id}
      style={labelStyles}
      className={`${
        isSpecialType
          ? "font-inter block h-full cursor-pointer whitespace-nowrap text-[.9375rem] font-bold capitalize transition-colors duration-200"
          : "block cursor-pointer text-[.875rem] font-bold transition-colors duration-200"
      } ${className}`}
      {...props}
    >
      {children}
      {required && !isSpecialType && (
        <sup className="z-[99999] text-[.825rem] text-red-600">*</sup>
      )}
    </label>
  );
};

export default MkdInputV2Label;
