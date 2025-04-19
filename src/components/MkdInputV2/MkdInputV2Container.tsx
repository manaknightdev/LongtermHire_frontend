import React from "react";
import { MkdInputV2Type, useMkdInputV2Context } from "./MkdInputV2Context";

// Container component props
interface MkdInputV2ContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MkdInputV2Container: React.FC<MkdInputV2ContainerProps> = ({
  children,
  className = "",
  ...props
}) => {
  const { type } = useMkdInputV2Context();

  // For radio, checkbox, color, toggle types, we use a different label style
  const isSpecialType = ["radio", "checkbox", "color", "toggle"].includes(
    type!
  );

  return (
    <div
      className={`relative grow ${isSpecialType ? "" : "space-y-2"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default MkdInputV2Container;
