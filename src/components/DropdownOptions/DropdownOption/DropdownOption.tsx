import React from "react";

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
  return (
    <div
      style={style}
      className={`hover:text[#262626] flex w-full cursor-pointer items-center gap-3 rounded-md px-4 py-3 capitalize text-[#262626] hover:bg-[#F4F4F4] ${className}`}
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
