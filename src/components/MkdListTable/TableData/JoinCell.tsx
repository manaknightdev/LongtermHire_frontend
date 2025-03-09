import { memo } from "react";

interface JoinCellProps {
  value: string;
}

const JoinCell = memo(({ value }: JoinCellProps) => <>{value}</>);

export default JoinCell;
