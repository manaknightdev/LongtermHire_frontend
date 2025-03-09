import { memo } from "react";

interface BasicTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const BasicTextarea = ({ ...props }: BasicTextareaProps) => {
  return <textarea {...props}></textarea>;
};

export default memo(BasicTextarea);
