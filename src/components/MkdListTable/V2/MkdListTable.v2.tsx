import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
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
  TableActions,
  OverlayTableActions
} from "@/components/MkdListTable";

import { MkdButton } from "@/components/MkdButton";
import { ExportButton } from "@/components/ExportButton";
import { LazyLoad } from "@/components/LazyLoad";
import "../MkdListTable.css";
// import { ExCircleIcon } from "Assets/svgs";
import { useProfile } from "@/hooks/useProfile";
import { BiSearch } from "react-icons/bi";
import { MkdInput } from "@/components/MkdInput";
import { TrashIcon } from "lucide-react";
import { useSDK } from "@/hooks/useSDK";
import { operations } from "@/utils";
import { useContexts } from "@/hooks/useContexts";
import { Action, ColumnDataState } from "@/interfaces";
import { ActionLocations, DisplayEnum } from "@/utils/Enums";
import { getProcessedTableData } from "@/components/MkdListTable/RowListColumn";

const dataProcesses = async (processes: any[], data: any[], columns: any[]) => {
  if (!processes?.length) {
    return data;
  }
  let processedData = data;
  for (const eachProcess of processes) {
    if (["function"].includes(typeof eachProcess)) {
      processedData = await eachProcess(processedData, columns);
    }
  }

  return processedData;
};

interface MkdListTableV2Props {
  defaultColumns?: any[];
  excludeColumns?: any[];
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
  externalData?: {
    page: number;
    data: any[];
    limit: number;
    pages: number;
    total: number;
    use: boolean;
    loading: boolean;
    canNextPage: boolean;
    canPreviousPage: boolean;
    fetch: (page: number | any, limit: number | any, filter?: any) => void;
    search?: (
      search: string,
      columns?: any,
      searchFilter?: any,
      query?: any
    ) => void;
  };
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
  // columnId,
  // columns = [],
  defaultColumns = [],
  excludeColumns = [],
  columnModel = null,
  // setColumns,
  processes = [],
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
  updateRef = null,
  onUpdateCurrentTableData = null,
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
  resetFilters = null,
  defaultPageSize = 10,
  searchFilter = [],
  onReady = () => {},
  maxHeight = null,
  externalData,
  noDataComponent,
  useImage = true,
  canChangeLimit = true,
  selectedItemsRef = null,
  useDefaultColumns = false,
  showScrollbar = true
}: MkdListTableV2Props) => {
  const { sdk, tdk, projectId } = useSDK();

  const abortControllerRef = useRef<AbortController>(null) as any;

  const {
    globalDispatch,
    custom: customRequest,
    globalState: { columModel },
    authDispatch: dispatch,
    tokenExpireError,
    getListByFilter,
    create: createRequest,
    setLoading: setGlobalLoading
  } = useContexts();

  const [currentTableData, setCurrentTableData] = React.useState<
    Array<Record<any, any>>
  >([]);
  const [pageSize, setPageSize] = React.useState<
    React.SetStateAction<number | any>
  >(defaultPageSize ?? 10);
  const [pageCount, setPageCount] =
    React.useState<React.SetStateAction<number | any>>(0);
  const [_dataTotal, setDataTotal] =
    React.useState<React.SetStateAction<number | any>>(0);
  const [currentPage, setPage] =
    React.useState<React.SetStateAction<number | any>>(1);
  const [canPreviousPage, setCanPreviousPage] = React.useState<boolean>(false);
  const [canNextPage, setCanNextPage] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = React.useState<
    Array<Record<any, any>>
  >([]);
  const [filterConditions, _setFilterConditions] = React.useState<any[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Array<number>>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [isSearchDirty, setIsSearchDirty] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [_runFilter, setRunFilter] = React.useState<boolean>(false);
  const [_searchField, setSearchField] = React.useState<string>("name");

  const [columnData, setColumnData] = React.useState<ColumnDataState>({
    views: [],
    data: null,
    columns: [],
    columnId: 0,
    columnsReady: false,
    order: "",
    direction: ""
  });

  const [popoverShown, _setPopoverShow] = React.useState<boolean>(false);

  const { profile, getProfile } = useProfile();

  const selectedOptionsMemo = useMemo(() => selectedOptions, [selectedOptions]);

  const processFilters = useCallback(() => {
    let filters: string[] = [];
    const uniqueSet = new Set(
      selectedOptionsMemo.map((item) => item?.accessor)
    );

    uniqueSet.forEach((uniqueSetItem) => {
      const filterSet = selectedOptionsMemo.filter(
        (item) => item.accessor === uniqueSetItem
      );

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
  }, [selectedOptionsMemo, table]);

  const getSearchData = useCallback(
    async (query: any = { limit: pageSize, page: 1 }) => {
      const treeFilter = processFilters();
      // console.log("treeFilter >>", treeFilter);
      try {
        const apiEndpoint = `/v3/api/custom/goodbadugly/generic/search/${table}?limit=${query?.limit}&page=${query?.page}`;
        setLoading(true);
        const result = await customRequest({
          endpoint: apiEndpoint,
          method: "POST",
          payload: {
            search: searchValue,
            columns: columnData?.columns,
            filter: searchFilter,
            tree_filter: treeFilter
          },
          allowToast: false
        });
        if (!result?.error) {
          setSelectedItems([]);
          const { data, total, limit, num_pages, page } = result as any;

          let list = data;

          if (processes?.length) {
            for (const eachProcess of processes) {
              // if type of process is a function
              if (["function"].includes(typeof eachProcess)) {
                list = await eachProcess(list, columnData?.columns, treeFilter);
              }
            }
          }
          let processedTableData = list;

          if (columnData?.columns) {
            processedTableData = await getProcessedTableData(
              list,
              columnData?.columns,
              globalDispatch,
              dispatch
            );
          }
          // console.log("processedTableData >>", processedTableData);
          setCurrentTableData(() => processedTableData);
          setPageSize(Number(limit));
          setPageCount(num_pages ?? pageCount);
          setPage(Number(page));
          setDataTotal(Number(total));
          setCanPreviousPage(Number(page) > 1);
          setCanNextPage(Number(page) + 1 <= num_pages);
          setLoading(false);
          if (onReady) {
            onReady(processedTableData);
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (onReady) {
          onReady([]);
        }
      }
      // finally {
      //   setColumnsReady(false);
      // }
    },
    [
      table,
      pageSize,
      searchValue,
      columnData,
      searchFilter,
      globalDispatch,
      dispatch,
      pageCount,
      selectedOptionsMemo
    ]
  );

  const getData = useCallback(
    async (
      pageNum?: any,
      limitNum?: any,
      currentTableData?: {
        filterConditions?: any;
        order?: any;
        direction?: any;
      }
    ) => {
      setLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const newAbortController = new AbortController();
      abortControllerRef.current = newAbortController;
      const signal = newAbortController.signal;

      const filters = processFilters();
      // const orderFilter =
      //   (currentTableData?.order || columnData?.order) &&
      //   ["asc"].includes(currentTableData?.direction || columnData?.direction)
      //     ? [
      //         `${projectId}_${table}.${
      //           currentTableData?.order || columnData?.order
      //         },${operations.IS_NOT_NULL}`,
      //       ]
      //     : [];
      // console.log("orderFilter >>", orderFilter);

      const filter = [
        ...filters,
        ...defaultFilter,
        ...currentTableData?.filterConditions
      ];

      try {
        const result = await tdk.getPaginate(
          table,
          {
            size: limitNum,
            page: pageNum,
            ...(join && join.length ? { join } : null),
            ...(currentTableData?.order || columnData?.order
              ? {
                  order: currentTableData?.order ?? columnData?.order,
                  direction:
                    currentTableData?.direction ?? columnData?.direction
                }
              : null),
            filter: filter?.length ? filter : undefined
          },
          signal
        );

        setSelectedItems([]);
        const { list, total, limit, num_pages, page } = result as any;
        let data = list;

        if (columnData?.columns) {
          data = await dataProcesses(processes, data, columnData?.columns);

          data = await getProcessedTableData(
            data,
            columnData?.columns,
            globalDispatch,
            dispatch
          );
        }

        setCurrentTableData(() => data);

        setPageSize(limit);
        setPageCount(num_pages);
        setPage(page);
        setDataTotal(total);
        setCanPreviousPage(page > 1);
        setCanNextPage(page + 1 <= num_pages);
        setLoading(false);
        if (onReady) {
          onReady(data);
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setLoading(false);
          console.error("ERROR", error);
          tokenExpireError(error.message);
        }
        if (onReady) {
          onReady([]);
        }
      } finally {
        setColumnData((prev) => ({ ...prev, columnsReady: false }));
        if (abortControllerRef.current === newAbortController) {
          console.info("abortControllerRef.current null");
          abortControllerRef.current = null;
        }
      }
    },
    [
      table,
      join,
      defaultFilter,
      dispatch,
      columnData,
      processFilters,
      selectedOptionsMemo
    ]
  );

  const onSort = useCallback(
    (columnIndex: any) => {
      if (!columnData?.columns?.[columnIndex]?.isSorted) {
        return;
      }
      const tempColumnData = { ...columnData };
      if (tempColumnData?.columns?.[columnIndex]?.isSortedDesc) {
        tempColumnData.columns = tempColumnData?.columns.map(
          (col: any, index: any) => {
            if (index === columnIndex) {
              return {
                ...col,
                isSortedDesc: false
              };
            }
            return {
              ...col,
              isSortedDesc: false
            };
          }
        );
      } else {
        tempColumnData.columns = tempColumnData?.columns?.map(
          (col: any, index: any) => {
            if (index === columnIndex) {
              return {
                ...col,
                isSortedDesc: true
              };
            }
            return {
              ...col,
              isSortedDesc: false
            };
          }
        );
        // tempColumnData.columns[columnIndex].isSorted = true;
      }
      // console.log("tempColumnData >>", tempColumnData);
      setColumnData((prev) => {
        return {
          ...prev,
          ...tempColumnData,
          order: tempColumnData?.columns?.[columnIndex]?.accessor,
          direction: tempColumnData?.columns?.[columnIndex]?.isSortedDesc
            ? "desc"
            : "asc"
        };
      });

      (async function () {
        if (!searchValue) {
          if (externalData?.use) {
            setLoading(true);
            externalData?.fetch(currentPage, pageSize, {
              filterConditions: [],
              order: tempColumnData?.columns?.[columnIndex]?.accessor,
              direction: tempColumnData?.columns?.[columnIndex]?.isSortedDesc
                ? "desc"
                : "asc"
            });
          } else {
            await getData(currentPage, pageSize, {
              filterConditions: [],
              order: tempColumnData?.columns?.[columnIndex]?.accessor,
              direction: tempColumnData?.columns?.[columnIndex]?.isSortedDesc
                ? "desc"
                : "asc"
            });
          }
        } else if (searchValue) {
          getSearchData({
            limit: pageSize,
            page: currentPage
          });
        }
      })();
    },
    [columnData, currentPage, pageSize, filterConditions, getData]
  );

  const updatePageSize = useCallback(
    (limit: React.SetStateAction<number>) => {
      (async function () {
        setPageSize(limit);

        if (!searchValue) {
          await getData(currentPage, limit, {
            filterConditions: []
          });
          setIsSearchDirty(false);
        } else if (searchValue) {
          getSearchData({ limit, page: currentPage });
        }
      })();
    },
    [isSearchDirty, searchValue, currentPage, getData, getSearchData]
  );

  const onColumnClick = useCallback(
    (column: string, operator?: string | null, options?: any | null) => {
      const data = {
        value: "",
        config: options,
        accessor: column,
        uid: generateUUID(),
        operator: operator ?? operations.CONTAINS
      };

      setSelectedOptions((prev) => [...prev, data]);
    },
    []
  );

  const setOptionValue = useCallback((field: string, value: any, uid: any) => {
    setSelectedOptions((prev) =>
      prev.map((item) =>
        item?.uid === uid ? { ...item, [field]: value } : item
      )
    );

    if (field === "value") {
      setRunFilter(true);
    }
  }, []);

  const previousPage = useCallback(() => {
    (async function () {
      if (!searchValue) {
        if (externalData?.use) {
          setLoading(true);
          const limit = currentPage - 1 > 0 ? currentPage - 1 : currentPage;
          externalData?.fetch(limit, pageSize);
        } else {
          await getData(
            currentPage - 1 > 0 ? currentPage - 1 : currentPage,
            pageSize,
            {
              filterConditions: []
            }
          );
        }
        setIsSearchDirty(false);
      } else if (searchValue) {
        if (externalData?.use && externalData?.search) {
          externalData?.search(searchValue, columnData?.columns, searchFilter, {
            limit: pageSize,
            page: currentPage - 1 > 0 ? currentPage - 1 : currentPage
          });
        } else {
          getSearchData({
            limit: pageSize,
            page: currentPage - 1 > 0 ? currentPage - 1 : currentPage
          });
        }
      }
    })();
  }, [
    isSearchDirty,
    searchValue,
    currentPage,
    pageSize,
    getData,
    getSearchData
  ]);

  const updateCurrentPage = useCallback(
    (page: React.SetStateAction<number>) => {
      (async function () {
        setPage(page);
        if (!searchValue) {
          if (externalData?.use) {
            setLoading(true);
            externalData?.fetch(page, pageSize);
          } else {
            await getData(page, pageSize, {
              filterConditions: []
            });
          }
          setIsSearchDirty(false);
        } else if (searchValue) {
          if (externalData?.use && externalData?.search) {
            externalData?.search(
              searchValue,
              columnData?.columns,
              searchFilter,
              {
                limit: pageSize,
                page
              }
            );
          } else {
            getSearchData({ limit: pageSize, page });
          }
        }
      })();
    },
    [isSearchDirty, searchValue, pageSize, getData, getSearchData]
  );

  const nextPage = useCallback(() => {
    (async function () {
      if (!searchValue) {
        if (externalData?.use) {
          setLoading(true);
          externalData?.fetch(
            currentPage + 1 <= pageCount ? currentPage + 1 : currentPage,
            pageSize
          );
        } else {
          await getData(
            currentPage + 1 <= pageCount ? currentPage + 1 : currentPage,
            pageSize,
            {
              filterConditions: []
            }
          );
        }
        setIsSearchDirty(false);
      } else if (searchValue) {
        if (externalData?.use && externalData?.search) {
          externalData?.search(searchValue, columnData?.columns, searchFilter, {
            limit: pageSize,
            page: currentPage + 1 <= pageCount ? currentPage + 1 : currentPage
          });
        } else {
          getSearchData({
            limit: pageSize,
            page: currentPage + 1 <= pageCount ? currentPage + 1 : currentPage
          });
        }
      }
    })();
  }, [
    isSearchDirty,
    searchValue,
    currentPage,
    pageCount,
    pageSize,
    getData,
    getSearchData
  ]);

  // const addFilterCondition = useCallback(
  //   (option: any, selectedValue: string, inputValue: number | React.SetStateAction<string>) => {
  //     const input =
  //       selectedValue === "eq" && isNaN(inputValue)
  //         ? `${inputValue}`
  //         : inputValue;
  //     const condition = `${option},${selectedValue},${input}`.toLowerCase();
  //     setFilterConditions((prevConditions) => {
  //       const newConditions = prevConditions.filter(
  //         (condition) => !condition.includes(option)
  //       );
  //       return [...newConditions, condition];
  //     });
  //     setSearchValue(inputValue);
  //   },
  //   []
  // );

  const deleteItem = useCallback(
    async (id: any) => {
      const deleteId = async (idToDelete: number) => {
        try {
          setDeleteLoading(true);
          sdk.setTable(table);
          const result = await sdk.callRestAPI({ id: idToDelete }, "DELETE");
          if (!result?.error) {
            setCurrentTableData((list) =>
              list.filter((x) => Number(x.id) !== Number(idToDelete))
            );
            setDeleteLoading(false);
            setShowDeleteModal(false);
          }
        } catch (err: any) {
          setDeleteLoading(false);
          setShowDeleteModal(false);
          tokenExpireError(err?.message);
          throw new Error(err);
        }
      };

      if (Array.isArray(id)) {
        for (const idToDelete of id) {
          await deleteId(idToDelete);
        }
      } else if (typeof id === "number") {
        await deleteId(id);
      }
    },
    [table, dispatch]
  );

  const exportTable = useCallback(async () => {
    try {
      sdk.setTable(table);
      // const payload = {
      //   search: getNonNullValue(searchValue),
      //   columns: columnData?.columns,
      //   exclude_columns: excludeColumns,
      //   filter: searchFilter,
      //   raw_filter: rawFilter,
      // };
      await sdk.exportCSV();
    } catch (err: any) {
      throw new Error(err);
    }
  }, [table, searchValue, columnData, excludeColumns, searchFilter]);

  const handleAlphaSearchInput = useCallback(
    async (e: any) => {
      e?.preventDefault();
      if ([e?.code?.toLowerCase(), e?.key?.toLowerCase()].includes("enter")) {
        if (!searchValue) {
          if (externalData?.use) {
            setLoading(true);
            externalData?.fetch(currentPage, pageSize, {
              filterConditions: []
            });
          } else {
            await getData(currentPage, pageSize, {
              filterConditions: []
            });
          }
          setIsSearchDirty(false);
        } else if (searchValue) {
          if (externalData?.use && externalData?.search) {
            externalData?.search(
              searchValue,
              columnData?.columns,
              searchFilter
            );
          } else {
            getSearchData({
              limit: pageSize,
              page: currentPage
            });
          }
        }
      } else {
        setSearchValue(e?.target?.value);
        if (!isSearchDirty) {
          setIsSearchDirty(true);
        }
      }
    },
    [isSearchDirty, searchValue, currentPage, pageSize, getData, getSearchData]
  );

  const onSubmit = useCallback(() => {
    if (!searchValue) {
      if (externalData?.use) {
        setLoading(true);
        externalData?.fetch(currentPage, pageSize, {
          filterConditions: []
        });
      } else {
        getData(currentPage, pageSize, {
          filterConditions: []
        });
      }
    } else if (searchValue) {
      if (externalData?.use && externalData?.search) {
        setLoading(true);
        externalData?.search(searchValue, currentPage, pageSize, {
          filterConditions: []
        });
      } else {
        getSearchData({
          limit: pageSize,
          page: currentPage
        });
      }
    }
  }, [selectedOptionsMemo, table, getData, currentPage, pageSize]);

  // const updateTableData = useCallback(
  //   async (id: any, key: any, updatedData: any) => {
  //     try {
  //       sdk.setTable(table);
  //       await sdk.callRestAPI(
  //         {
  //           id,
  //           [key]: updatedData,
  //         },
  //         "PUT",
  //         tableRole
  //       );
  //     } catch (error: any) {
  //       console.log("ERROR", error);
  //       tokenExpireError(error.message);
  //     }
  //   },
  //   [table, dispatch]
  // );

  // const handleTableCellChange = useCallback(
  //   async (id: any, newValue: any, index: number, newValueKey: any) => {
  //     let runApiCall;
  //     newValue = isNaN(Number.parseInt(newValue as string))
  //       ? newValue
  //       : Number.parseInt(newValue as string);
  //     try {
  //       clearTimeout(runApiCall);
  //       runApiCall = setTimeout(async () => {
  //         await updateTableData(id, newValueKey, newValue);
  //       }, 200);
  //       setCurrentTableData((prevData) =>
  //         prevData.map((item, i) =>
  //           i === index ? { ...item, [newValueKey]: newValue } : item
  //         )
  //       );
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   [updateTableData]
  // );

  const populateColums = useCallback(
    (data?: any | null, views?: Array<any>) => {
      if (!data) {
        return setColumnData((prev) => {
          return {
            ...prev,
            columns: [...defaultColumns],
            columnsReady: true,
            views
          };
        });
      }
      const columns = data?.columns ? JSON.parse(data?.columns) : [];
      setColumnData((prev) => {
        return {
          ...prev,
          data,
          views,
          columnId: views?.length ? data?.column_id : data?.id,
          columnsReady: true,
          columns: columns?.length ? columns : defaultColumns
        };
      });
    },
    [defaultColumns, columnData]
  );

  const getColumns = useCallback(async () => {
    setColumnData((prev) => ({ ...prev, columnsReady: false }));
    setGlobalLoading("columModel", true);
    const result = await getListByFilter("column_views", {
      filter: [
        ...(columnModel
          ? [`model,eq,'${columnModel}'`]
          : [`model,eq,'${table}'`]),
        `user_id,eq,${profile?.id}`
      ]
    });
    if (!result?.error && result?.data?.length) {
      const currentView = result?.data.find(
        (item: { current_view: any }) => item?.current_view
      );

      populateColums(currentView, result?.data?.reverse());
    } else {
      const fallbackResult = await getListByFilter("column", {
        filter: [
          ...(columnModel
            ? [`model,eq,'${columnModel}'`]
            : [`model,eq,'${table}'`]),
          `user_id,eq,0`
        ]
      });

      if (!fallbackResult?.error && fallbackResult?.data?.length) {
        const payload = {
          name: "default",
          default_view: true,
          current_view: true,
          user_id: profile?.id,
          model: columnModel || table,
          column_id: fallbackResult?.data[0]?.id,
          columns: fallbackResult?.data[0]?.columns
        };
        const defaultResult = await createRequest("column_views", payload, {
          allowToast: false
        });
        populateColums({ ...payload, id: defaultResult?.data }, [
          { ...payload, id: defaultResult?.data }
        ]);
      } else {
        populateColums(null, []);
      }
    }
    // setColumnsReady(true);
    setGlobalLoading("columModel", false);
  }, [
    columnModel,
    table,
    profile?.id,
    globalDispatch,
    dispatch,
    populateColums,
    setColumnData
  ]);

  const updatePaginationData = useCallback(
    (data: { limit: number; pages: number; page: number; total: number }) => {
      setPageSize(data?.limit);
      setPageCount(data?.pages);
      setPage(data?.page);
      setDataTotal(data?.total);
      setCanPreviousPage(data?.page > 1);
      setCanNextPage(() => data?.page + 1 <= data?.pages);
    },
    []
  );

  // Update External Selected Items
  React.useEffect(() => {
    if (actions?.select?.action) {
      actions.select.action(selectedItems);
    }
  }, [selectedItems?.length]);

  useEffect(() => {
    const searchableCol = columnData?.columns?.find((col) => col?.searchable);
    if (searchableCol) {
      setSearchField(searchableCol?.accessor);
    }
  }, []);

  React.useEffect(() => {
    if (useDefaultColumns) {
      return setColumnData((prev) => {
        return {
          ...prev,
          columns: [...defaultColumns],
          columnsReady: true,
          views: []
        };
      });
    } else {
      getColumns();
    }
  }, [columnModel, defaultColumns?.length, useDefaultColumns]);

  useEffect(() => {
    if (columnData?.columnsReady) {
      if (externalData?.use) {
        setLoading(true);
        externalData?.fetch(currentPage, pageSize, { filterConditions: [] });
        // setCurrentTableData(() => externalData?.data);

        // updatePaginationData(externalData?.data);
      } else {
        getData(currentPage, pageSize, { filterConditions: [] });
      }
    }
  }, [columnData?.columnsReady, externalData?.use]);

  useEffect(() => {
    if (resetFilters) {
      if (externalData?.use) {
        setLoading(true);
        externalData?.fetch(1, pageSize, { filterConditions: resetFilters });
      } else {
        getData(1, pageSize, { filterConditions: resetFilters });
      }
    }
  }, [resetFilters]);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div
      className={`relative grid !h-[auto] !max-h-full !min-h-[auto] w-full min-w-full max-w-full items-start gap-2 ${
        maxHeight ? maxHeight : "grid-rows-[auto_auto_auto]"
      }`}
    >
      {selectedItemsRef && (
        <button
          type="button"
          ref={selectedItemsRef}
          onClick={() => {
            if (selectedItems?.length) {
              setSelectedItems([]);
            }
          }}
          className="hidden"
        ></button>
      )}
      {updateRef && (
        <button
          type="button"
          ref={updateRef}
          onClick={() => {
            if (onUpdateCurrentTableData) {
              onUpdateCurrentTableData((data: any) => {
                setCurrentTableData(() => data?.data);

                updatePaginationData(data);
              });
            }
            setLoading(false);
          }}
          className="hidden"
        ></button>
      )}
      {refreshRef && (
        <button
          type="button"
          ref={refreshRef}
          onClick={() => {
            if (externalData?.use) {
              setLoading(true);
              externalData?.fetch(currentPage, pageSize, {
                filterConditions: []
              });
              // // console.log("externalData >>", externalData);
              // setCurrentTableData(() => externalData?.data);
              // updatePaginationData(externalData);
            } else {
              getData(1, pageSize, { filterConditions: [] });
            }
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
              columnData={columnData}
              onColumnClick={onColumnClick}
              filterDisplays={filterDisplays}
              setOptionValue={setOptionValue}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              removeSelectedOption={() => {}}
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

            {selectedItems?.length &&
            actionPostion.includes(ActionLocations.ONTOP) ? (
              <LazyLoad>
                <TableActions actions={actions} selectedItems={selectedItems} />
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
                  onClick={exportTable}
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
      {/* <div className="my-2 w-full min-w-full max-w-full"> */}
      <MkdListTable
        onSort={onSort}
        actions={actions}
        actionId={actionId}
        useImage={useImage}
        tableRole={tableRole}
        deleteItem={deleteItem}
        columnData={columnData}
        popoverShown={popoverShown}
        allowEditing={allowEditing}
        setColumnData={setColumnData}
        actionPostion={actionPostion}
        deleteLoading={deleteLoading}
        selectedItems={selectedItems}
        showScrollbar={showScrollbar}
        showDeleteModal={showDeleteModal}
        noDataComponent={noDataComponent}
        allowSortColumns={allowSortColumns}
        currentTableData={currentTableData}
        setSelectedItems={setSelectedItems}
        setShowDeleteModal={setShowDeleteModal}
        loading={loading || columModel?.loading || externalData?.loading}
        columns={columnData?.columns}
      />
      {/* </div> */}
      {selectedItems?.length &&
      actionPostion.includes(ActionLocations.OVERLAY) ? (
        <LazyLoad>
          <OverlayTableActions
            actions={actions}
            selectedItems={selectedItems}
            currentTableData={currentTableData}
          />
        </LazyLoad>
      ) : null}
      {showPagination && currentTableData?.length ? (
        <div className="mt-4 w-full">
          <PaginationBar
            currentPage={currentPage}
            pageCount={pageCount}
            pageSize={pageSize}
            startSize={defaultPageSize}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            updatePageSize={updatePageSize}
            previousPage={previousPage}
            nextPage={nextPage}
            multiplier={16}
            updateCurrentPage={updateCurrentPage}
            canChangeLimit={canChangeLimit}
          />
        </div>
      ) : null}

      {/* TO DO */}
    </div>
  );
};

export default memo(MkdListTableV2);
