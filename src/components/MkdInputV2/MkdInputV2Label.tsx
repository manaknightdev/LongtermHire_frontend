import React from "react";
import { useMkdInputV2Context } from "./MkdInputV2Context";

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

  // For radio, checkbox, color, toggle types, we use a different label style
  const isSpecialType = ["radio", "checkbox", "color", "toggle"].includes(
    type!
  );

  return (
    <label
      htmlFor={id}
      className={`${
        isSpecialType
          ? "font-inter block h-full cursor-pointer whitespace-nowrap text-[.9375rem] font-bold capitalize text-black"
          : "block cursor-pointer text-[.875rem] font-bold"
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
