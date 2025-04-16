import { memo, useMemo } from "react";
import {
  ImageCell,
  FileCell,
  JoinCell,
  StatusCell,
  EditableStatusCell,
  EditableTextCell,
  TruncatedCell,
  ListCell,
  CurrencyCell,
  NoteCell,
  DefaultCell,
} from "./TableData";

const formatDate = (dateString: string) => {
  const options: Record<string, string> = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(dateString);
  const [_, time] = dateString?.split("T");
  const [hours, minutes] = [date.getHours(), date.getMinutes()];

  if (time && (hours || minutes)) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return new Date(dateString).toLocaleDateString(undefined, options);
};
interface MkdListTableRowColProps {
  column: any;
  tableRole: any;
  handleTableCellChange: any;
  allowEditing: any;
  onPopoverStateChange: any;
  row: any;
  currentTableData: any;
  expandRow: any;
  showNote: any;
  actions: any;
  columnIndex: any;
}

const MkdListTableRowCol = ({
  column,
  tableRole,
  handleTableCellChange,
  allowEditing,
  onPopoverStateChange,
  row,
  currentTableData,
  expandRow,
  showNote,
  actions,
  columnIndex,
}: MkdListTableRowColProps) => {
  const memoizedColumn = useMemo(() => column, [column]);
  const memoizedRow = useMemo(() => row, [row]);
  const memoizedCurrentTableData = useMemo(
    () => currentTableData,
    [currentTableData]
  );

  const renderCell = () => {
    const value = memoizedRow[memoizedColumn?.accessor];

    if (
      (memoizedColumn?.accessor?.indexOf("image") > -1 ||
        memoizedColumn?.accessor?.indexOf("photo") > -1) &&
      memoizedColumn?.selected_column &&
      value
    ) {
      return (
        <ImageCell src={value} onPopoverStateChange={onPopoverStateChange} />
      );
    }

    if (
      (memoizedColumn?.accessor?.indexOf("pdf") > -1 ||
        memoizedColumn?.accessor?.indexOf("doc") > -1 ||
        memoizedColumn?.accessor?.indexOf("file") > -1 ||
        memoizedColumn?.accessor?.indexOf("video") > -1 ||
        ["attached_files", "attached_file"].includes(
          memoizedColumn?.accessor
        )) &&
      memoizedColumn?.selected_column &&
      value
    ) {
      return <FileCell href={value} />;
    }

    if (memoizedColumn?.join && memoizedColumn?.selected_column) {
      return (
        <JoinCell
          value={memoizedRow[memoizedColumn?.join]?.[memoizedColumn?.accessor]}
        />
      );
    }

    if (
      memoizedColumn?.mappingExist &&
      !["admin"].includes(tableRole) &&
      memoizedColumn?.selected_column
    ) {
      return <StatusCell value={value} mappings={memoizedColumn?.mappings} />;
    }
    if (
      memoizedColumn?.mappingExist &&
      ["admin"].includes(tableRole) &&
      memoizedColumn?.selected_column
    ) {
      return (
        // <></>
        <StatusCell value={value} mappings={memoizedColumn?.mappings} />
      );
    }

    if (
      memoizedColumn?.mappingExist &&
      allowEditing &&
      ["admin"].includes(tableRole) &&
      memoizedColumn?.selected_column
    ) {
      return (
        <EditableStatusCell
          value={value}
          mappings={memoizedColumn?.mappings}
          onChange={(e) =>
            handleTableCellChange(
              e.target.value,
              memoizedColumn?.accessor,
              memoizedRow.id
            )
          }
        />
      );
    }

    if (
      !memoizedColumn?.mappingExist &&
      memoizedColumn?.accessor !== "id" &&
      memoizedColumn?.accessor !== "create_at" &&
      memoizedColumn?.accessor !== "update_at" &&
      memoizedColumn?.accessor !== "user_id" &&
      memoizedColumn?.accessor !== "" &&
      allowEditing &&
      memoizedColumn?.selected_column
    ) {
      return (
        <EditableTextCell
          value={value}
          onChange={(e) =>
            handleTableCellChange(
              e.target.value,
              memoizedColumn?.accessor,
              memoizedRow.id
            )
          }
        />
      );
    }

    if (memoizedColumn?.truncate && memoizedColumn?.selected_column) {
      return <TruncatedCell value={value} length={50} />;
    }

    if (memoizedColumn?.replace && memoizedColumn?.selected_column) {
      return <TruncatedCell value={value} length={30} />;
    }

    if (memoizedColumn?.list && memoizedColumn?.selected_column) {
      return (
        <ListCell
          column={memoizedColumn}
          data={value}
          expandRow={expandRow}
          currentTableData={memoizedCurrentTableData}
        />

        // <>{value}</>
      );
    }

    if (memoizedColumn?.isCurrency && memoizedColumn?.selected_column) {
      return <CurrencyCell currency={memoizedColumn?.currency} value={value} />;
    }

    if (
      ["notes", "note"].includes(memoizedColumn?.accessor) &&
      memoizedColumn?.selected_column &&
      value
    ) {
      return <NoteCell value={value} showNote={showNote} />;
    }

    if (
      ["update_at", "create_at", "updated_at", "created_at"].includes(
        memoizedColumn?.accessor
      ) &&
      memoizedColumn?.selected_column &&
      value
    ) {
      return <DefaultCell value={formatDate(value as string)} />;
    }

    if (memoizedColumn?.accessor !== "" && memoizedColumn?.selected_column) {
      return <DefaultCell value={value} />;
    }

    return null;
  };

  const removeLeftPadding =
    [0, "0"].includes(columnIndex) && [actions?.select?.show].includes(false);

  return (
    <td
      style={{ background: row?.bg ?? "" }}
      className={`!w-[auto]  !min-w-[6.25rem] !max-w-[auto] whitespace-nowrap  border-b pr-6 ${
        removeLeftPadding ? "pl-0" : "pl-6"
      }`}
    >
      {renderCell()}
    </td>
  );
};

export default memo(MkdListTableRowCol);
