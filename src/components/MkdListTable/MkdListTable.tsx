import React, { memo, useCallback, useMemo } from "react";
import { LazyLoad } from "@/components/LazyLoad";
import MkdListTableRowCol from "./MkdListTableRowCol";
import { Skeleton as SkeletonLoader } from "@/components/Skeleton";
import { NoteModal } from "./NoteModal";
import { MkdListTableRowButtons, MkdListTableRowDropdown } from "./index";
import { DotIcon } from "lucide-react";
import { NarrowUpArrowIcon } from "@/assets/svgs";
import { Action, ColumnDataState } from "@/interfaces";
import { ActionLocations } from "@/utils/Enums";

interface MkdListTableProps {
  onSort: (columnIndex: number) => void;
  loading: boolean;
  columns: any[] | undefined;
  actions: { [key: string]: Action };
  actionPostion: ActionLocations[];
  tableRole: string;
  deleteItem: any;
  deleteLoading: boolean;
  actionId: string;
  showDeleteModal: boolean;
  currentTableData: any[];
  setShowDeleteModal: (showDeleteModal: boolean) => void;
  handleTableCellChange?: (
    rowIndex: number,
    columnIndex: number,
    value: any
  ) => void;
  setSelectedItems: (selectedItems: any[]) => void;
  allowEditing: boolean;
  useImage: boolean;
  columnData: ColumnDataState;
  setColumnData: (columnData?: any) => void;
  selectedItems: any[];
  allowSortColumns: boolean;
  popoverShown: boolean;
  noDataComponent?: {
    use: boolean;
    component: JSX.Element;
  };
  showScrollbar: boolean;
}

const MkdListTable = ({
  onSort,
  loading,
  columns = [],
  actions,
  actionPostion = [],
  tableRole,
  actionId = "id",
  currentTableData = [],
  setShowDeleteModal,
  handleTableCellChange,
  setSelectedItems,
  allowEditing,
  useImage = true,
  columnData,
  setColumnData,
  selectedItems = [],
  allowSortColumns = true,
  noDataComponent,
  showScrollbar = true
}: MkdListTableProps) => {
  const [_deleteId, setIdToDelete] = React.useState(null);
  const [_isOneOrMoreRowSelected, setIsOneOrMoreRowSelected] =
    React.useState(false);
  const [_areAllRowsSelected, setAreAllRowsSelected] = React.useState(false);
  // const [selectedIds, setSelectedIds] = React.useState([]);
  const [dragging, setDragging] = React.useState(false);
  const [fromKey, setFromKey] = React.useState(null);
  const [toKey, setToKey] = React.useState(null);
  const [_selectedColumnLength, setSelectedColumnLength] = React.useState(0);
  const [note, setNote] = React.useState("") as any;
  const [noteModalOpen, setNoteModalOpen] = React.useState(false);

  const showNote = (note: string) => {
    setNote(note);

    setNoteModalOpen(true);
  };

  const currentTableDataMemo = useMemo(
    () => JSON.stringify(currentTableData),
    [currentTableData]
  );
  const currentColumnsMemo = useMemo(
    () => JSON.stringify(columnData?.columns),
    [columnData]
  );
  const rowColumn = useMemo(
    () =>
      columnData?.columns?.find(
        (item: { accessor: string }) => item?.accessor === "row"
      ),
    [columnData]
  );

  const actionColumn = useMemo(
    () =>
      (columns.find((item) => item.accessor === "") && actions?.delete?.show) ||
      Object.keys(actions).filter(
        (key) =>
          actions[key]?.show &&
          actions[key]?.locations &&
          actions[key]?.locations?.length &&
          (actions[key]?.locations?.includes(ActionLocations.DROPDOWN) ||
            actions[key]?.locations?.includes(ActionLocations.BUTTONS))
      )?.length,
    [columns, actions]
  );

  // console.log("selectedItems >>", selectedItems);
  const getPreviousSelectedIndex = useCallback(
    (tempIds: string | any[]) => {
      if (tempIds.length > 1) {
        // console.log("tempIds >>", tempIds, tempIds?.[tempIds?.length - 1]);
        const lastSelectedIndex = currentTableData.findIndex(
          (item) => item?.id == tempIds?.[tempIds?.length - 1]
        );
        // console.log("lastSelectedIndex >>", lastSelectedIndex);
        return lastSelectedIndex;
      } else if (tempIds.length == 1) {
        const selectedIndex = currentTableData.findIndex(
          (item) => item?.id == tempIds?.[0]
        );
        return selectedIndex;
      } else {
        return null;
      }
    },
    [currentTableData]
  );

  const getShiftRange = useCallback((currentIndex: any, previousKey: any) => {
    // console.log("currentIndex >>", currentIndex);
    // console.log("previousKey >>", previousKey);
    const lower = currentIndex < previousKey ? currentIndex : previousKey;
    const upper = currentIndex > previousKey ? currentIndex : previousKey;
    const start = lower == previousKey ? lower + 1 : lower;
    const end = upper == previousKey ? upper - 1 : upper;
    return { start, end, lower, upper };
  }, []);

  const handleSelectMultipleWithShiftKey = useCallback(
    (_id: any, currentIndex: any, tempIds: any) => {
      const previousSelectedIndex = getPreviousSelectedIndex(tempIds);
      // console.log("previousSelectedIndex >>", previousSelectedIndex);
      if (previousSelectedIndex !== null) {
        const { lower, upper } = getShiftRange(
          currentIndex,
          previousSelectedIndex
        );

        const newIds = [...selectedItems];
        // console.log("lower >>", lower);
        // console.log("upper >>", upper);
        // console.log("currentTableData >>", currentTableData);

        for (let i = lower; i <= upper; i++) {
          // console.log("i >>", i);
          newIds.push(currentTableData[i]?.id);
        }

        setSelectedItems(newIds);
      } else {
        setSelectedItems([currentTableData?.[currentIndex]?.id]);
      }
    },
    [currentTableData]
  );

  function handleSelectRow(id: any, index: any, e: any) {
    const tempIds = selectedItems;
    // console.log("selectedItems >>", selectedItems);
    if (actions?.select?.multiple) {
      if (e?.nativeEvent?.shiftKey!) {
        if (
          actions?.select?.max &&
          actions?.select?.max == selectedItems?.length
        )
          return;
        handleSelectMultipleWithShiftKey(id, index, tempIds);
      } else {
        if (tempIds.includes(id)) {
          const newIds = tempIds.filter((selectedId) => selectedId !== id);
          // setSelectedIds(() => [...newIds]);
          setSelectedItems(newIds);
        } else {
          if (
            actions?.select?.max &&
            actions?.select?.max == selectedItems?.length
          )
            return;
          const newIds = [...tempIds, id];
          // setSelectedIds(() => [...newIds]);
          setSelectedItems(newIds);
        }
      }
    } else {
      if (tempIds.includes(id)) {
        const newIds = tempIds.filter((selectedId) => selectedId !== id);
        // setSelectedIds(() => [...newIds]);
        setSelectedItems(newIds);
      } else {
        const newIds = [id];
        // setSelectedIds(() => [...newIds]);
        setSelectedItems(newIds);
      }
    }
    // console.log(id);
  }

  const handleSelectAll = () => {
    // setAreAllRowsSelected((prevSelectAll) => !prevSelectAll);
    const allSelected = currentTableData.every((item) =>
      selectedItems.includes(item?.id)
    );

    if (!allSelected) {
      const allIds = currentTableData.map((item) => item[actionId]);
      // setSelectedIds(allIds);
      setSelectedItems(allIds);
    } else {
      // setSelectedIds([]);
      setSelectedItems([]);
    }
  };

  const setDeleteId = async (id: React.SetStateAction<null>) => {
    // console.log("id >>", id);
    setShowDeleteModal(true);
    setIdToDelete(id);
  };

  const onDragStart = (_e: any, key: React.SetStateAction<null>) => {
    if (!allowSortColumns) return;
    // e.preventDefault();
    // console.log("onDragStart");
    setFromKey(key);
    setDragging(true);
  };
  const onDrop = (e: React.DragEvent<HTMLTableHeaderCellElement>) => {
    if (!allowSortColumns) return;
    e.preventDefault();
    if (fromKey && toKey && fromKey != toKey) {
      const tempColumns = [...columnData?.columns!];
      const fromColumn = tempColumns[fromKey];

      tempColumns.splice(fromKey, 1);
      tempColumns.splice(toKey, 0, fromColumn);
      if (setColumnData) {
        setColumnData((prev: any) => {
          return {
            ...prev,
            columns: tempColumns
          };
        });
      }
    }
    setToKey(null);
    setFromKey(null);
    setDragging(false);
  };
  const onDragOver = (
    e: React.DragEvent<HTMLTableHeaderCellElement>,
    key: React.SetStateAction<null>
  ) => {
    if (!allowSortColumns) return;
    e.preventDefault();

    setToKey(key);
    // if (fromKey != key) {
    // }
  };
  const onDragEnd = (e: { preventDefault: () => void }) => {
    if (!allowSortColumns) return;
    e.preventDefault();
    setToKey(null);
    setFromKey(null);
    // console.log("onDragEnd");

    setDragging(false);
  };
  const onDragLeave = (e: React.DragEvent<HTMLTableHeaderCellElement>) => {
    if (!allowSortColumns) return;
    e.preventDefault();
    setToKey(null);
    // setFromKey(null);
  };

  React.useEffect(() => {
    if (selectedItems.length <= 0) {
      setIsOneOrMoreRowSelected(false);
      setAreAllRowsSelected(false);
    }
    if (selectedItems.length === currentTableData?.length) {
      setAreAllRowsSelected(true);
    }
    if (
      selectedItems.length < currentTableData?.length &&
      selectedItems.length > 0
    ) {
      setAreAllRowsSelected(false);
    }
  }, [selectedItems?.length, currentTableDataMemo]);

  React.useEffect(() => {
    const length = columnData?.columns?.reduce(
      (prev: number, current: { accessor: string; selected_column: any }) => {
        if (
          !["row", ""].includes(current?.accessor) &&
          current?.selected_column
        ) {
          return prev + 1;
        }
        return prev;
      },
      0
    );
    setSelectedColumnLength(length ?? 0);
  }, [currentColumnsMemo]);

  return (
    <LazyLoad count={7} counts={[2, 2, 2, 2, 2, 2]}>
      <div
        className={`relative !h-full !max-h-full !min-h-full  !w-full min-w-full max-w-full justify-center overflow-auto !rounded-[.625rem] bg-transparent ${
          showScrollbar ? "" : "scrollbar-hide"
        }`}
      >
        {loading ? (
          <div
            className={`max-h-fit min-h-fit w-full items-center justify-center`}
          >
            <SkeletonLoader count={7} counts={[2, 2, 2, 2, 2, 2]} />
          </div>
        ) : columnData?.columns?.length && currentTableData?.length ? (
          // className="flex flex-col w-fit min-w-fit max-w-fit"

          <table className=" h-fit min-w-full divide-y divide-[#1F1D1A1A] rounded-md">
            <thead className="bg-white">
              <tr className="!h-[2.65rem] !max-h-[2.65rem] !min-h-[2.65rem]">
                {[actions?.select?.show].includes(true) || rowColumn ? (
                  <>
                    {[actions?.select?.show].includes(true) ? (
                      <th className="$ bg-white sticky -left-[0.05rem] -top-[0.05rem] z-[19] !h-[2.65rem] !max-h-[2.65rem] !min-h-[2.65rem] !w-[2.65rem] !min-w-[2.65rem] !max-w-[2.65rem]  px-[.75rem] py-[.5rem] text-xs font-medium capitalize tracking-wider text-black">
                        {(actions?.select?.multiple && !actions?.select?.max) ||
                        (actions?.select?.multiple &&
                          actions?.select?.max &&
                          actions?.select?.max >= currentTableData?.length) ? (
                          <input
                            type="checkbox"
                            disabled={
                              !actions?.select?.multiple ||
                              (actions?.select?.max &&
                                actions?.select?.max < currentTableData?.length)
                                ? true
                                : false
                            }
                            id="select_all_rows"
                            className={`focus:shadow-outline focus:shadow-outline  mr-1 !h-4 !w-4 cursor-pointer  appearance-none  rounded-[.125rem]  text-[.8125rem]  text-sm font-normal leading-tight text-black shadow focus:outline-none focus:ring-0 sm:!text-base`}
                            checked={
                              selectedItems?.length === currentTableData?.length
                            }
                            onChange={
                              actions?.select?.max &&
                              actions?.select?.max >= currentTableData?.length
                                ? handleSelectAll
                                : () => {}
                            }
                          />
                        ) : null}
                      </th>
                    ) : null}

                    {rowColumn ? (
                      <th
                        className={`$ sticky -top-[0.05rem] ${
                          [actions?.select?.show].includes(true)
                            ? "left-10"
                            : "left-0"
                        } bg-white z-10 border-b !h-[2.65rem] !max-h-[2.65rem] !min-h-[2.65rem] !w-[2.65rem] !min-w-[2.65rem] max-w-[auto]  px-[.75rem] py-[.5rem] text-left text-[1.125rem] font-medium capitalize tracking-wider text-black`}
                      >
                        Row
                      </th>
                    ) : null}
                  </>
                ) : null}
                {columnData?.columns?.map(
                  (
                    cell: {
                      accessor: string;
                      selected_column: any;
                      isSorted: any;
                      header: string;
                      isSortedDesc: any;
                    },
                    cellIndex: any
                  ) => {
                    if (
                      !["row", ""].includes(cell?.accessor) &&
                      cell?.selected_column
                    ) {
                      const removeLeftPadding =
                        [0, "0"].includes(cellIndex) &&
                        [actions?.select?.show].includes(false);

                      return (
                        <th
                          key={cellIndex}
                          draggable={allowSortColumns}
                          onDragStart={(e) => onDragStart(e, cellIndex)}
                          onDragEnd={onDragEnd}
                          onDragOver={(e) => onDragOver(e, cellIndex)}
                          onDragLeave={(e) => onDragLeave(e)}
                          onDrop={(e) => onDrop(e)}
                          scope="col"
                          className={`$ bg-white font-iowan sticky -top-[0.05rem] z-[5] !h-[2.65rem] !max-h-[2.65rem] !min-h-[2.65rem] !w-[auto] !min-w-[6.25rem] !max-w-[auto]  shrink-0 grow py-[.5rem] pr-6 text-left text-[1.125rem] font-[700] capitalize leading-[1.25rem] tracking-wider text-black ${
                            allowSortColumns && dragging
                              ? "cursor-grabbing"
                              : cell?.isSorted
                                ? "cursor-pointer"
                                : ""
                          } ${
                            toKey == cellIndex
                              ? "bg-primary-light"
                              : "bg-weak-100"
                          } ${removeLeftPadding ? "pl-0" : "pl-6"} `}
                        >
                          <div className="flex w-full items-center justify-between gap-5">
                            <div
                              className="flex grow items-center justify-between gap-5"
                              onClick={
                                cell?.isSorted
                                  ? () => onSort(cellIndex)
                                  : undefined
                              }
                            >
                              <div className="w-auto grow whitespace-nowrap capitalize">
                                {cell?.header?.split("_")?.join(" ")}
                              </div>
                              <span className="w-fit">
                                {cell.isSorted ? (
                                  <NarrowUpArrowIcon
                                    className={`h-2 w-2 ${
                                      cell.isSortedDesc ? "rotate-180" : ""
                                    }`}
                                  />
                                ) : null}
                              </span>
                            </div>
                            {allowSortColumns ? (
                              <DotIcon className="h-2 w-2 min-w-2 max-w-2 cursor-grab" />
                            ) : null}
                          </div>
                        </th>
                      );
                    }
                  }
                )}
                {actionColumn ? (
                  <th className="$ bg-white sticky border-b -right-[0.05rem] -top-[0.05rem] z-10 !h-[2.65rem] !max-h-[2.65rem] !min-h-[2.65rem] !w-fit !min-w-fit max-w-fit shrink-0 grow  px-[.75rem] py-[.5rem] text-left text-xs font-medium capitalize tracking-wider text-black">
                    Action
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-white bg-white divide-y">
              {currentTableData?.map((row: any, rowIndex: any) => {
                return (
                  <tr
                    className="!h-[4rem] !max-h-[4rem] !min-h-[4rem]"
                    key={rowIndex}
                  >
                    {[actions?.select?.show].includes(true) || rowColumn ? (
                      <>
                        {[actions?.select?.show].includes(true) ? (
                          <td className="text-sub-500 bg-white sticky -left-[0.05rem] z-10 !h-full !max-h-full  !min-h-full !w-[2.65rem] !min-w-[2.65rem] !max-w-[2.65rem] cursor-pointer whitespace-nowrap px-[.75rem] py-[.5rem] text-sm font-[400] capitalize leading-[1.5rem] tracking-wider">
                            <input
                              type="checkbox"
                              className={`focus:shadow-outline focus:shadow-outline  mr-1 !h-4 !w-4 cursor-pointer  appearance-none  rounded-[.125rem]  text-[.8125rem]  text-sm font-normal leading-tight text-black shadow focus:outline-none focus:ring-0 sm:!text-base`}
                              name="select_item"
                              checked={
                                selectedItems?.length &&
                                selectedItems.includes(row[actionId])
                                  ? true
                                  : false
                              }
                              onChange={(e) =>
                                handleSelectRow(row?.[actionId], rowIndex, e)
                              }
                            />
                          </td>
                        ) : null}

                        {rowColumn ? (
                          <td
                            className={`sticky ${
                              [actions?.select?.show].includes(true)
                                ? "left-10"
                                : "left-0"
                            } bg-white border-b z-[5] flex h-full w-[auto] !min-w-[2.65rem] !max-w-[auto] items-center  whitespace-nowrap px-[.75rem] py-[.5rem] text-sm`}
                          >
                            {rowIndex + 1}
                          </td>
                        ) : null}
                      </>
                    ) : null}
                    {columnData?.columns?.map(
                      (
                        cell: { accessor: string; selected_column: any },
                        cellIndex: React.Key | null | undefined
                      ) => {
                        if (
                          !["row", ""].includes(cell?.accessor) &&
                          cell?.selected_column
                        ) {
                          return (
                            <MkdListTableRowCol
                              key={cellIndex}
                              columnIndex={cellIndex}
                              row={row}
                              column={cell}
                              currentTableData={currentTableData}
                              actions={actions}
                              allowEditing={allowEditing}
                              handleTableCellChange={handleTableCellChange}
                              tableRole={tableRole}
                              showNote={showNote}
                              onPopoverStateChange={undefined}
                              expandRow={undefined}
                            />
                          );
                        }
                      }
                    )}
                    {actionColumn ? (
                      <td className="bg-white sticky border-b -right-[0.05rem] z-[5] !w-fit !min-w-fit !max-w-fit whitespace-nowrap px-[.75rem] py-[.5rem]">
                        {/* <div className="flex !w-fit !min-w-fit !max-w-fit items-center justify-end"> */}
                        {actionPostion?.includes(ActionLocations.DROPDOWN) ? (
                          <MkdListTableRowDropdown
                            row={row}
                            actions={actions}
                            actionId={actionId}
                            setDeleteId={setDeleteId}
                          />
                        ) : null}
                        {actionPostion?.includes(ActionLocations.BUTTONS) ? (
                          <MkdListTableRowButtons
                            row={row}
                            actions={actions}
                            actionId={actionId}
                            setDeleteId={setDeleteId}
                          />
                        ) : null}
                        {/* </div> */}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : !loading && !currentTableData?.length ? (
          <div className="relative h-full max-h-full min-h-full w-full max-w-full">
            <div
              className={`relative h-full max-h-full min-h-full w-full min-w-full max-w-full items-center justify-center`}
            >
              <div
                className={`relative flex h-full w-full items-center justify-center`}
              >
                {noDataComponent?.use ? (
                  <>{noDataComponent?.component}</>
                ) : useImage ? (
                  <></>
                ) : (
                  <>No Data</>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {
          <LazyLoad>
            <NoteModal
              isOpen={noteModalOpen}
              note={note}
              onClose={() => {
                setNoteModalOpen(false);
                setNote(null);
              }}
            />
          </LazyLoad>
        }
      </div>
    </LazyLoad>
  );
};

export default memo(MkdListTable);
