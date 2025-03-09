import { memo } from "react";

interface FileCellProps {
  href: string;
}

const FileCell = memo(({ href }: FileCellProps) => (
  <a className="text-blue-500" target="_blank" href={href} rel="noreferrer">
    {" "}
    View
  </a>
));

export default FileCell;
