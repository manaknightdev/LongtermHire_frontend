import React, { memo } from "react";

interface DefaultCellProps {
  value: any;
}

const DefaultCell = memo(({ value }: DefaultCellProps) => (
  <>
    {React.isValidElement(value)
      ? value
      : typeof value === "object"
        ? null
        : value}
  </>
));

export default DefaultCell;
