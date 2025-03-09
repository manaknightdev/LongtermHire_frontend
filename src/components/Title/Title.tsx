import React from "react";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

const Title = ({ children, className = "" }: TitleProps) => {
  return (
    <div
      className={`flex h-[3rem] w-full items-center gap-5 rounded-t-[.75rem] border-b border-soft-200 bg-white py-[.5rem] pl-[.75rem] pr-[1rem] font-inter text-[1.125rem] font-[600] leading-[1.5rem] tracking-[-1.5%] shadow-md shadow-sh-sm md:w-[38.5625rem] ${className}`}
    >
      {children}
    </div>
  );
};

export default Title;
