import { memo } from "react";
import { truncate } from "@/utils/utils";

interface TruncatedCellProps {
  value: string;
  length: number;
}

const TruncatedCell = memo(({ value, length }: TruncatedCellProps) => (
  <>{truncate(value, length)}</>
));

export default TruncatedCell;
