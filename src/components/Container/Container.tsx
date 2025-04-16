import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={`min-h-fit !w-full items-center space-y-5 rounded-[.75rem] bg-white p-[1.5rem] shadow-md shadow-sh-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
