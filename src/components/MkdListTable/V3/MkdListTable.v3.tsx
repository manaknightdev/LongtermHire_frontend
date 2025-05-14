import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  StringCaser,
  generateUUID,
  getCorrectOperator,
  getCorrectValueTypeFormat
} from "@/utils/utils";
import { PaginationBar } from "@/components/PaginationBar";
import {
  MkdListTable,
  TableFilter,
  OverlayTableActions,
  TableActions
} from "@/components/MkdListTable";

import { MkdButton } from "@/components/MkdButton";
import { ExportButton } from "@/components/ExportButton";
import { LazyLoad } from "@/components/LazyLoad";
import "./MkdListTable.css";
// import { ExCircleIcon } from "Assets/svgs";
import { BiSearch } from "react-icons/bi";
import { MkdInput } from "@/components/MkdInput";
import { TrashIcon } from "lucide-react";
import { useSDK } from "@/hooks/useSDK";
import { operations } from "@/utils";
import { useContexts } from "@/hooks/useContexts";
import {
  Action,
  Column,
  ColumnDataState,
  ExternalData,
  FilterState,
  ModalState,
  PaginationState
} from "@/interfaces";
import { ActionLocations, DisplayEnum } from "@/utils/Enums";
import { TreeSDKOptions } from "@/utils/TreeSDK";
import { queryKeys } from "@/query/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

interface MkdListTableV2Props {
  defaultColumns?: Column[];
  excludeColumns?: Column[];
  columnModel?: any | null;
  processes?: any[];
  actions?: { [key: string]: Action };
  updateRef?: any | null;
  onUpdateCurrentTableData?: any | null;
  actionPostion?: ActionLocations[];
  actionId?: string;
  tableRole: string;
  table: string;
  tableTitle?: string;
  tableSchema?: any[];
  hasFilter?: boolean;
  schemaFields?: any[];
  showPagination?: boolean;
  defaultFilter?: any[];
  refreshRef?: any | null;
  allowEditing?: boolean;
  allowSortColumns?: boolean;
  showSearch?: boolean;
  topClasses?: string;
  join?: any[];
  filterDisplays?: Array<
    | DisplayEnum.ROWS
    | DisplayEnum.COLUMNS
    | DisplayEnum.SORT
    | DisplayEnum.FILTER
  >;
  resetFilters?: any | null;
  defaultPageSize?: number;
  searchFilter?: any[];
  onReady?: (data: Array<Record<any, any>>) => void;
  maxHeight?: string | null;
  rawFilter?: any[];
  externalData: ExternalData;
  noDataComponent?: {
    use: boolean;
    component: JSX.Element;
  };
  useImage?: boolean;
  canChangeLimit?: boolean;
  selectedItemsRef?: any | null;
  useDefaultColumns?: boolean;
  showYScrollbar?: boolean;
  showXScrollbar?: boolean;
  showScrollbar?: boolean;
}
const stringCaser = new StringCaser();

const MkdListTableV2 = ({
  defaultColumns = [],
  actions = {
    view: {
      show: true,
      multiple: true,
      action: null,
      locations: [ActionLocations.DROPDOWN],
      children: "View"
    },
    edit: {
      show: true,
      multiple: true,
      action: null,
      locations: [ActionLocations.DROPDOWN],
      children: "Edit"
    },
    delete: {
      show: true,
      multiple: true,
      action: null,
      locations: [ActionLocations.DROPDOWN],
      children: "Delete"
    },
    select: {
      show: true,
      multiple: true,
      action: null,
      locations: []
    },
    add: {
      show: true,
      multiple: true,
      action: null,
      locations: [],
      showChildren: true,
      children: "Add",
      type: "",
      className: ""
    },
    export: {
      show: true,
      multiple: true,
      action: null,
      showText: false,
      className: "",
      locations: []
    }
  },
  actionPostion = [ActionLocations.DROPDOWN], // "dropwdown" | "ontop" | "overlay" | "buttons"
  actionId = "id",
  tableRole = "admin",
  table = "user",
  tableTitle = "",
  hasFilter = true,
  showPagination = true,
  defaultFilter = [],
  refreshRef = null,
  allowEditing = false,
  allowSortColumns = true,
  showSearch = true,
  topClasses = "",
  join = [],
  filterDisplays = [],
  defaultPageSize = 10,
  maxHeight = null,
  externalData,
  noDataComponent,
  useImage = true,
  canChangeLimit = true,
  // selectedItemsRef = null,
  useDefaultColumns = false,
  showScrollbar = true
}: MkdListTableV2Props) => {
  const { projectId } = useSDK();
  const queryClient = useQueryClient();

  const {
    globalState: { columModel },
    tableState: tableProperty,
    setTableState: setTableProperty
  } = useContexts();

  const tableState: ExternalData = useMemo(() => {
    return {
      ...externalData,
      data: externalData?.data ?? []
    } as ExternalData;
  }, [externalData]);

  const initialTableState = useMemo(
    () => ({
      filterState: {
        filterConditions: [],
        selectedOptions: [],
        selectedItems: [],
        runFilter: false,
        enabled: true
      } as FilterState,
      paginationState: {
        pageSize: defaultPageSize,
        pageCount: 0,
        currentPage: 1,
        dataTotal: 0,
        canPreviousPage: false,
        canNextPage: false
      } as PaginationState,
      columnState: {
        columnId: 0,
        columns: useDefaultColumns ? defaultColumns : [],
        columnsReady: false,
        data: [],
        order: "id",
        direction: "desc"
      } as ColumnDataState,
      modalState: {
        deleteLoading: false,
        popoverShown: false,
        showDeleteModal: false
      } as ModalState,
      queryOptions: {
        join: join,
        order: "id",
        direction: "desc",
        filter: [],
        size: defaultPageSize,
        page: 1,
        role: tableRole
      } as TreeSDKOptions
    }),
    [defaultPageSize, join, tableRole, defaultColumns, useDefaultColumns]
  );

  const {
    filterState,
    // paginationState,
    columnState,
    modalState,
    queryOptions,
    reload
  } = tableProperty?.[table] ?? initialTableState;

  const [internalState, setInternalState] = useState<Record<string, any>>({
    searchValue: "",
    isSearchDirty: false
  });

  const refreshData = useCallback(() => {
    const data = {
      ...tableProperty?.[table]?.filterState,
      enabled: true
    };

    setTableProperty(table, { ...tableProperty?.[table], filterState: data });

    queryClient.invalidateQueries({
      queryKey: [queryKeys?.[table]?.paginate, table],
      exact: false,
      refetchType: "active"
    });
  }, [tableProperty, table, setTableProperty, queryClient]);

  const setOptionValue = useCallback(
    (field: string, value: any, uid: any) => {
      const data = {
        ...tableProperty?.[table]?.filterState,
        selectedOptions: tableProperty?.[
          table
        ]?.filterState?.selectedOptions?.map((item: any) =>
          item?.uid === uid ? { ...item, [field]: value } : item
        ),
        runFilter: ["value"].includes(field)
          ? true
          : tableProperty?.[table]?.filterState?.runFilter
      };
      setTableProperty(table, { ...tableProperty?.[table], filterState: data });
    },
    [filterState, table, tableProperty, setTableProperty]
  );

  const removeSelectedOption = useCallback(
    (uids: string[]) => {
      const data = {
        ...tableProperty?.[table]?.filterState,
        selectedOptions: tableProperty?.[
          table
        ]?.filterState?.selectedOptions?.filter(
          (item: any) => !uids.includes(item?.uid)
        )
      };
      setTableProperty(table, { ...tableProperty?.[table], filterState: data });
    },
    [table, tableProperty, setTableProperty]
  );

  const onColumnClick = useCallback(
    (column: string, operator?: string | null, options?: any | null) => {
      const filter = {
        value: "",
        config: options,
        accessor: column,
        uid: generateUUID(),
        operator: operator ?? operations.CONTAINS
      };

      const data = {
        ...tableProperty?.[table]?.filterState,
        selectedOptions: [
          ...(tableProperty?.[table]?.filterState?.selectedOptions ?? []),
          filter
        ]
      };

      setTableProperty(table, { ...tableProperty?.[table], filterState: data });
    },
    [filterState, table, tableProperty, setTableProperty]
  );

  const processFilters = useCallback(() => {
    let filters: string[] = [];
    const uniqueSet = new Set(
      filterState?.selectedOptions?.map((item) => item?.accessor)
    );

    uniqueSet.forEach((uniqueSetItem) => {
      const filterSet =
        filterState?.selectedOptions?.filter(
          (item) => item.accessor === uniqueSetItem
        ) ?? [];

      if (filterSet?.length > 0) {
        const valueSet = filterSet.filter((item) => item?.value);

        if (valueSet.length > 1) {
          valueSet.forEach((valueSetItem) => {
            const { accessor, operator, value } = valueSetItem;
            const filter = `${projectId}_${table}.${accessor},${
              operator === "cs" || operator === "eq"
                ? getCorrectOperator("o" + operator, value)
                : getCorrectOperator(operator, value)
            },${value}`;
            filters.push(filter);
          });
        } else if (valueSet.length === 1) {
          const { accessor, operator, value } = valueSet[0];
          filters.push(
            `${projectId}_${table}.${accessor},${getCorrectOperator(
              operator,
              value
            )},${getCorrectValueTypeFormat(value, operator)}`
          );
        }
      }
    });
    return filters;
  }, [filterState?.selectedOptions, table, projectId]);

  const computeSearchFilter = useCallback(() => {
    if (!internalState?.searchValue) return [];
    let filters: string[] = [];
    const selectedColumns = columnState?.columns?.filter(
      (column) =>
        column?.selected_column &&
        !["id", "created_at", "updated_at"].includes(column?.accessor)
    );

    selectedColumns?.forEach((column) => {
      if (column?.join) {
        filters.push(
          `${projectId}_${column?.join}.${column?.accessor},cs,${internalState?.searchValue}`
        );
      } else {
        filters.push(
          `${projectId}_${table}.${column?.accessor},cs,${internalState?.searchValue}`
        );
      }
    });
    return filters;
  }, [internalState, table, projectId, columnState]);

  const onSubmit = useCallback(
    (_data?: any) => {
      const filters = processFilters();
      const searchFilter = computeSearchFilter();
      const filterData = {
        ...tableProperty?.[table]?.filterState,
        enabled: true
      };
      const data = {
        ...tableProperty?.[table]?.queryOptions,
        filter: [...filters, ...defaultFilter, ...searchFilter]
      };

      console.log("queryOptions >>", tableProperty?.[table]?.queryOptions);
      setTableProperty(table, {
        ...tableProperty?.[table],
        queryOptions: data,
        filterState: filterData,
        reload: false
      });
    },
    [
      table,
      tableProperty,
      setTableProperty,
      defaultFilter,
      processFilters,
      computeSearchFilter
    ]
  );

  const handleAlphaSearchInput = useCallback(
    async (e: any) => {
      e?.preventDefault();
      if ([e?.code?.toLowerCase(), e?.key?.toLowerCase()].includes("enter")) {
        onSubmit();
      } else {
        setInternalState({
          ...internalState,
          searchValue: e?.target?.value,
          isSearchDirty: !internalState?.isSearchDirty
            ? true
            : internalState?.isSearchDirty
        });
      }
    },
    [internalState, setInternalState, onSubmit]
  );

  // Pagination
  const updateCurrentPage = useCallback(
    (page: React.SetStateAction<number>) => {
      console.log("updateCurrentPage >>", page);
      const data = {
        ...tableProperty?.[table]?.queryOptions,
        page: page
      };
      setTableProperty(table, {
        ...tableProperty?.[table],
        queryOptions: data,
        reload: true
      });
    },
    [table, tableProperty, setTableProperty]
  );

  const updatePageSize = useCallback(
    (limit: React.SetStateAction<number>) => {
      const data = {
        ...tableProperty?.[table]?.queryOptions,
        size: limit
      };
      setTableProperty(table, {
        ...tableProperty?.[table],
        queryOptions: data,
        reload: true
      });
    },
    [table, tableProperty, setTableProperty]
  );

  useEffect(() => {
    if (reload) {
      onSubmit(reload);
    }
  }, [onSubmit, reload]);

  useEffect(() => {
    setTableProperty(table, initialTableState);
    console.log("MkdListTableV2 useEffect");
  }, []);

  return (
    <div
      className={`relative grid !h-[auto] !max-h-full !min-h-[auto] w-full min-w-full max-w-full items-start gap-2 ${
        maxHeight ? maxHeight : "grid-rows-[auto_auto_auto]"
      }`}
    >
      {/* {selectedItemsRef && (
        <button
          type="button"
          ref={selectedItemsRef}
          onClick={() => {
            if (filterState?.selectedItems?.length) {
              setTableProperty(table, { ...tableProperty, filterState: { ...filterState, selectedItems: [] } });
            }
          }}
          classN
          ame="hidden"
        ></button>
      )} */}
      {refreshRef && (
        <button
          type="button"
          ref={refreshRef}
          onClick={() => {
            refreshData();
          }}
          className="hidden"
        ></button>
      )}
      <div
        className={`flex w-full justify-between ${
          tableTitle && hasFilter ? "flex-col gap-3" : "h-fit items-center"
        } ${topClasses}`}
      >
        <h4 className="font-inter flex items-center text-[1rem] font-bold capitalize leading-[1.5rem] tracking-[-0.011em]">
          {tableTitle ? tableTitle : ""}
        </h4>

        <div
          className={`flex h-fit flex-col md:flex-row ${
            hasFilter ? "w-full" : "w-fit"
          } items-start justify-between gap-2 text-center md:items-center`}
        >
          {hasFilter ? (
            <TableFilter
              onSubmit={onSubmit}
              columnData={columnState ?? { columns: [] }}
              onColumnClick={onColumnClick}
              filterDisplays={filterDisplays}
              setOptionValue={setOptionValue}
              removeSelectedOption={removeSelectedOption}
              selectedOptions={filterState?.selectedOptions ?? []}
            />
          ) : null}

          <div
            className={`flex h-full w-full justify-between gap-2 self-end md:w-fit md:flex-row md:justify-end ${
              !tableTitle && !hasFilter ? "w-full" : ""
            }`}
          >
            {Object.keys(actions).map((key, keyIndex) => {
              if (
                actions[key].show &&
                actions[key].hasOwnProperty("type") &&
                ["toggle"].includes(actions[key]?.type ?? "")
              ) {
                return (
                  <MkdInput
                    key={keyIndex}
                    type="toggle"
                    onChange={(e: { target: { checked: any } }) => {
                      if (actions[key]?.action) {
                        actions[key]?.action(e?.target?.checked);
                      }
                    }}
                    label={actions[key]?.children ?? key}
                    value={actions[key]?.value}
                  />
                );
              }
            })}

            {showSearch ? (
              <div className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-black px-2 py-1 focus-within:border-gray-400">
                <BiSearch className="text-xl text-black" />
                <input
                  type="text"
                  placeholder={`Search`}
                  className="w-full border-none p-0 placeholder:text-left focus:outline-none"
                  style={{ boxShadow: "0 0 transparent" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  onKeyUp={(e) => handleAlphaSearchInput(e)}
                />
                {/* <AiOutlineClose className="text-lg text-gray-200" /> */}
              </div>
            ) : null}

            {filterState?.selectedItems?.length &&
            actionPostion.includes(ActionLocations.ONTOP) ? (
              <LazyLoad>
                <TableActions
                  actions={actions}
                  selectedItems={filterState.selectedItems}
                />
              </LazyLoad>
            ) : null}
            <div className="flex w-[auto] items-center justify-end gap-2 self-end">
              {Object.keys(actions).map((key, keyIndex) => {
                if (
                  actions[key].show &&
                  actions[key].hasOwnProperty("type") &&
                  ["static"].includes(actions[key]?.type ?? "")
                ) {
                  return (
                    <MkdButton
                      key={keyIndex}
                      onClick={() => {
                        if (actions[key]?.action) {
                          actions[key]?.action(actions[key]?.value);
                        }
                      }}
                      title={actions[key]?.title ?? key}
                      // showChildren={actions?.add?.showChildren}
                      showPlus={false}
                      className={`!h-[2.5rem] ${actions[key]?.className}`}
                      loading={actions[key]?.loading ?? false}
                      disabled={actions[key]?.disabled ?? false}
                      icon={actions[key]?.icon ?? null}
                    >
                      {key === "delete" ? <TrashIcon /> : null}
                      {actions[key].children ? (
                        actions[key].children
                      ) : (
                        <>
                          {stringCaser.Capitalize(
                            key === "delete" ? "Remove" : key,
                            {
                              separator: " "
                            }
                          )}
                        </>
                      )}
                    </MkdButton>
                  );
                }
              })}
              {actions?.export?.show && (
                <ExportButton
                  showText={actions?.export?.showText}
                  onClick={() => {
                    //exportTable()
                  }}
                  className={`mx-1 !h-[2.5rem] ${actions?.export?.className}`}
                />
              )}

              {actions?.add?.show && (
                <MkdButton
                  onClick={() => {
                    if (actions?.add?.action) {
                      actions?.add?.action(actions?.add?.value);
                    }
                  }}
                  showChildren={actions?.add?.showChildren}
                  className={`!h-[2.5rem] ${actions?.add?.className}`}
                >
                  {actions?.add?.children}
                </MkdButton>
              )}
            </div>
          </div>
        </div>
      </div>
      <MkdListTable
        onSort={() => {
          // onSort
        }}
        actions={actions}
        actionId={actionId}
        useImage={useImage}
        tableRole={tableRole}
        deleteItem={() => {}}
        allowEditing={allowEditing}
        setColumnData={() => {
          // setColumnState
        }}
        actionPostion={actionPostion}
        showScrollbar={showScrollbar}
        noDataComponent={noDataComponent}
        allowSortColumns={allowSortColumns}
        currentTableData={tableState?.data ?? []}
        popoverShown={modalState?.popoverShown ?? false}
        selectedItems={filterState?.selectedItems ?? []}
        deleteLoading={modalState?.deleteLoading ?? false}
        showDeleteModal={modalState?.showDeleteModal ?? false}
        columnData={columnState ?? initialTableState.columnState}
        setSelectedItems={(items) =>
          setTableProperty(table, {
            ...tableProperty,
            filterState: { ...filterState, selectedItems: items }
          })
        }
        setShowDeleteModal={(show) =>
          setTableProperty(table, {
            ...tableProperty,
            modalState: { ...modalState, showDeleteModal: show }
          })
        }
        loading={columModel?.loading || tableState?.loading}
        columns={columnState?.columns}
      />
      {filterState?.selectedItems?.length &&
      actionPostion.includes(ActionLocations.OVERLAY) ? (
        <LazyLoad>
          <OverlayTableActions
            actions={actions}
            selectedItems={filterState.selectedItems}
            currentTableData={tableState?.data}
          />
        </LazyLoad>
      ) : null}
      {showPagination && tableState?.data?.length ? (
        <div className="mt-4 w-full">
          <PaginationBar
            multiplier={16}
            startSize={defaultPageSize}
            updatePageSize={updatePageSize}
            canChangeLimit={canChangeLimit}
            updateCurrentPage={updateCurrentPage}
            pageCount={tableState?.pages ?? 0}
            currentPage={tableState?.page ?? 1}
            canNextPage={tableState?.canNextPage ?? false}
            canPreviousPage={tableState?.canPreviousPage ?? false}
            pageSize={queryOptions?.size ?? 10}
          />
        </div>
      ) : null}
    </div>
  );
};

export default memo(MkdListTableV2);
