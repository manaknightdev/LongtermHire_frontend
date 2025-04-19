import React from "react";
import { useMkdInputV2Context } from "./MkdInputV2Context";
import { StringCaser } from "@/utils";

// Error message component props
interface MkdInputV2ErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const MkdInputV2Error: React.FC<MkdInputV2ErrorProps> = ({
  className = "",
  ...props
}) => {
  const { name, errors } = useMkdInputV2Context();
  const stringCaser = new StringCaser();

  if (!name || !errors || !errors[name] || !errors[name].message) {
    return null;
  }

  return (
    <p
      className={`text-field-error absolute inset-x-0 top-[90%] m-auto mt-2 text-[.8rem] italic text-red-500 ${className}`}
      {...props}
    >
      {stringCaser.Capitalize(errors[name].message, {
        separator: " ",
      })}
    </p>
  );
};

export default MkdInputV2Error;
