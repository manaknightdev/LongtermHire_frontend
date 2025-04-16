import { memo } from "react";
import { MkdListTableRowListColumn } from "../.";

interface ListCellProps {
  column: any;
  data: any;
  expandRow: any;
  currentTableData: any;
}

const ListCell = memo(
  ({ column, data, expandRow, currentTableData }: ListCellProps) => (
    <MkdListTableRowListColumn
      column={column}
      data={data}
      expandRow={expandRow}
      currentTableData={currentTableData}
    />
  )
);

export default ListCell;
