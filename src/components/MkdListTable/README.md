# MkdListTable Components

This directory contains various table components for displaying and interacting with tabular data.

## MkdListTableWithQuery

`MkdListTableWithQuery` is a wrapper around `MkdListTableV2` that integrates with React Query for efficient data fetching, caching, and state management.

### Features

- Automatic data fetching using React Query
- Built-in caching and invalidation
- Pagination, sorting, and filtering through query parameters
- Seamless integration with the existing MkdListTableV2 component
- Support for all MkdListTableV2 features (actions, columns, etc.)

### Usage

```tsx
import { MkdListTableWithQuery } from "@/components/MkdListTable";
import { ActionLocations, DisplayEnum } from "@/utils/Enums";

const MyTableComponent = () => {
  // Define columns
  const columns = [
    {
      Header: "ID",
      accessor: "id",
      isSorted: true,
      isSortedDesc: false,
    },
    {
      Header: "Name",
      accessor: "name",
      isSorted: true,
      isSortedDesc: false,
    },
    // Add more columns as needed
  ];

  // Define actions
  const actions = {
    view: {
      show: true,
      multiple: true,
      action: (ids) => console.log("View items:", ids),
      locations: [ActionLocations.DROPDOWN],
      children: "View",
    },
    // Add more actions as needed
  };

  return (
    <MkdListTableWithQuery
      table="project" // Must be a key in queryKeys
      tableRole="admin"
      tableTitle="Projects"
      actions={actions}
      useDefaultColumns={true}
      defaultColumns={columns}
      maxHeight="grid-rows-[auto_1fr_auto]"
      actionPostion={[ActionLocations.DROPDOWN]}
      filterDisplays={[
        DisplayEnum.COLUMNS,
        DisplayEnum.FILTER,
        DisplayEnum.SORT,
      ]}
      defaultPageSize={10}
      onReady={(data) => console.log("Data ready:", data)}
      initialQueryOptions={{
        order: "id",
        direction: "desc",
      }}
    />
  );
};
```

### Props

`MkdListTableWithQuery` accepts all the props of `MkdListTableV2` plus the following:

| Prop | Type | Description |
|------|------|-------------|
| `table` | `keyof typeof queryKeys` | The table/entity name to fetch data for (must be a key in queryKeys) |
| `initialQueryOptions` | `TreeSDKOptions` | Initial options for the query (sorting, filtering, etc.) |

### Refreshing Data

You can refresh the data in two ways:

1. Using the `refreshRef` prop (automatically handled by the component):

```tsx
const refreshRef = useRef(null);

// Later in your component
<button onClick={() => refreshRef.current.click()}>Refresh</button>

<MkdListTableWithQuery
  refreshRef={refreshRef}
  // other props
/>
```

2. Using React Query's invalidation:

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/query/queryKeys";

const MyComponent = () => {
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKeys.project.paginate, "project"],
    });
  };
  
  // Use handleRefresh in your component
};
```

### Handling Actions

When implementing actions like delete, make sure to invalidate the query to refresh the data:

```tsx
const handleDelete = async (ids) => {
  // Delete logic here
  
  // After successful deletion, invalidate the query
  queryClient.invalidateQueries({
    queryKey: [queryKeys.project.paginate, "project"],
  });
};
```

## See Also

- `MkdListTableV2`: The base table component
- `MkdListTable`: The original table component
- Other related components in this directory






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
    async (query: any = { limit: paginationState.pageSize, page: 1 }) => {
      const treeFilter = processFilters();
      // console.log("treeFilter >>", treeFilter);
      try {
        const apiEndpoint = `/v3/api/custom/goodbadugly/generic/search/${table}?limit=${query?.limit}&page=${query?.page}`;
        setTableState((prev) => ({ ...prev, loading: true }));
        const result = await customRequest({
          endpoint: apiEndpoint,
          method: "POST",
          payload: {
            search: tableState.searchValue,
            columns: columnState.columns,
            filter: searchFilter,
            tree_filter: treeFilter
          },
          allowToast: false
        });
        if (!result?.error) {
          setFilterState((prev) => ({ ...prev, selectedItems: [] }));
          const { data, total, limit, num_pages, page } = result as any;

          let list = data;

          if (processes?.length) {
            for (const eachProcess of processes) {
              // if type of process is a function
              if (["function"].includes(typeof eachProcess)) {
                list = await eachProcess(list, columnState.columns, treeFilter);
              }
            }
          }
          let processedTableData = list;

          if (columnState.columns) {
            processedTableData = await getProcessedTableData(
              list,
              columnState.columns,
              globalDispatch,
              dispatch
            );
          }
          // console.log("processedTableData >>", processedTableData);
          setTableState((prev) => ({
            ...prev,
            data: processedTableData,
            loading: false
          }));
          setPaginationState((prev) => ({
            ...prev,
            pageSize: Number(limit),
            pageCount: num_pages ?? paginationState.pageCount,
            currentPage: Number(page),
            dataTotal: Number(total),
            canPreviousPage: Number(page) > 1,
            canNextPage: Number(page) + 1 <= num_pages
          }));
          if (onReady) {
            onReady(processedTableData);
          }
        }
        setTableState((prev) => ({ ...prev, loading: false }));
      } catch (error) {
        setTableState((prev) => ({ ...prev, loading: false }));
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
      paginationState.pageSize,
      tableState.searchValue,
      columnState,
      searchFilter,
      globalDispatch,
      dispatch,
      paginationState.pageCount,
      selectedOptionsMemo
    ]
  );

  // Memoize the query options to prevent unnecessary updates
  const queryOptions = useMemo(
    () => ({
      size: paginationState.pageSize,
      page: paginationState.currentPage,
      ...(join && join.length ? { join } : null),
      ...(columnState.order
        ? {
            order: columnState.order,
            direction: columnState.direction
          }
        : null),
      filter: [
        ...processFilters(),
        ...defaultFilter,
        ...filterState.filterConditions
      ].length
        ? [
            ...processFilters(),
            ...defaultFilter,
            ...filterState.filterConditions
          ]
        : undefined
    }),
    [
      paginationState.pageSize,
      paginationState.currentPage,
      join,
      columnState.order,
      columnState.direction,
      processFilters,
      defaultFilter,
      filterState.filterConditions
    ]
  );

  // Use the enhanced hook with memoized options
  const { data: enhancedData, isLoading: isEnhancedLoading } = {
    data: { data: [] },
    isLoading: false
  };
  // useEnhancedTableData({
  //   table,
  //   options: queryOptions,
  //   processes,
  //   columnState
  // });

  const onSort = useCallback(
    (columnIndex: any) => {
      if (!columnState.columns?.[columnIndex]?.isSorted) {
        return;
      }
      const tempColumnState = { ...columnState };
      if (tempColumnState?.columns?.[columnIndex]?.isSortedDesc) {
        tempColumnState.columns = tempColumnState?.columns.map(
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
        tempColumnState.columns = tempColumnState?.columns?.map(
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
      setColumnState((prev) => {
        return {
          ...prev,
          ...tempColumnState,
          order: tempColumnState?.columns?.[columnIndex]?.accessor,
          direction: tempColumnState?.columns?.[columnIndex]?.isSortedDesc
            ? "desc"
            : "asc"
        };
      });

      (async function () {
        if (!tableState.searchValue) {
          if (externalData?.use) {
            setTableState((prev) => ({ ...prev, loading: true }));
            externalData?.fetch(
              paginationState.currentPage,
              paginationState.pageSize,
              {
                filterConditions: [],
                order: tempColumnState?.columns?.[columnIndex]?.accessor,
                direction: tempColumnState?.columns?.[columnIndex]?.isSortedDesc
                  ? "desc"
                  : "asc"
              }
            );
          } else {
            // await getSearchData({
            //   limit: paginationState.pageSize,
            //   page: paginationState.currentPage
            // });
          }
        } else if (tableState.searchValue) {
          getSearchData({
            limit: paginationState.pageSize,
            page: paginationState.currentPage
          });
        }
      })();
    },
    [
      columnState,
      paginationState.currentPage,
      paginationState.pageSize,
      filterState.filterConditions,
      getSearchData
    ]
  );

  const updatePageSize = useCallback(
    (limit: number) => {
      (async function () {
        setPaginationState((prev) => ({
          ...prev,
          pageSize: limit
        }));

        if (!tableState.searchValue) {
          // await getSearchData({ limit, page: paginationState.currentPage });
        } else if (tableState.searchValue) {
          getSearchData({ limit, page: paginationState.currentPage });
        }
      })();
    },
    [
      filterState.runFilter,
      tableState.searchValue,
      paginationState.currentPage,
      getSearchData
    ]
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

      setFilterState((prev) => ({
        ...prev,
        selectedOptions: [...prev.selectedOptions, data]
      }));
    },
    []
  );

  const setOptionValue = useCallback((field: string, value: any, uid: any) => {
    setFilterState((prev) => ({
      ...prev,
      selectedOptions: prev.selectedOptions.map((item) =>
        item?.uid === uid ? { ...item, [field]: value } : item
      )
    }));

    if (field === "value") {
      setFilterState((prev) => ({ ...prev, runFilter: true }));
    }
  }, []);

  const previousPage = useCallback(() => {
    (async function () {
      if (!tableState.searchValue) {
        if (externalData?.use) {
          setTableState((prev) => ({ ...prev, loading: true }));
          const limit =
            paginationState.currentPage - 1 > 0
              ? paginationState.currentPage - 1
              : paginationState.currentPage;
          externalData?.fetch(limit, paginationState.pageSize);
        } else {
          // await getSearchData({
          //   limit: paginationState.pageSize,
          //   page:
          //     paginationState.currentPage - 1 > 0
          //       ? paginationState.currentPage - 1
          //       : paginationState.currentPage
          // });
        }
        setFilterState((prev) => ({ ...prev, runFilter: false }));
      } else if (tableState.searchValue) {
        if (externalData?.use && externalData?.search) {
          externalData?.search(
            tableState.searchValue,
            columnState.columns,
            searchFilter,
            {
              limit: paginationState.pageSize,
              page:
                paginationState.currentPage - 1 > 0
                  ? paginationState.currentPage - 1
                  : paginationState.currentPage
            }
          );
        } else {
          getSearchData({
            limit: paginationState.pageSize,
            page:
              paginationState.currentPage - 1 > 0
                ? paginationState.currentPage - 1
                : paginationState.currentPage
          });
        }
      }
    })();
  }, [
    filterState.runFilter,
    tableState.searchValue,
    paginationState.currentPage,
    paginationState.pageSize,
    getSearchData
  ]);

  const updateCurrentPage = useCallback(
    (page: number) => {
      (async function () {
        setPaginationState((prev) => ({
          ...prev,
          currentPage: page
        }));
        if (!tableState.searchValue) {
          if (externalData?.use) {
            setTableState((prev) => ({ ...prev, loading: true }));
            externalData?.fetch(page, paginationState.pageSize);
          } else {
            // await getSearchData({ limit: paginationState.pageSize, page });
          }
          setFilterState((prev) => ({ ...prev, runFilter: false }));
        } else if (tableState.searchValue) {
          if (externalData?.use && externalData?.search) {
            externalData?.search(
              tableState.searchValue,
              columnState.columns,
              searchFilter,
              {
                limit: paginationState.pageSize,
                page
              }
            );
          } else {
            getSearchData({ limit: paginationState.pageSize, page });
          }
        }
      })();
    },
    [
      filterState.runFilter,
      tableState.searchValue,
      paginationState.pageSize,
      getSearchData
    ]
  );

  const nextPage = useCallback(() => {
    (async function () {
      if (!tableState.searchValue) {
        if (externalData?.use) {
          setTableState((prev) => ({ ...prev, loading: true }));
          externalData?.fetch(
            paginationState.currentPage + 1 <= paginationState.pageCount
              ? paginationState.currentPage + 1
              : paginationState.currentPage,
            paginationState.pageSize
          );
        } else {
          // await getSearchData({
          //   limit: paginationState.pageSize,
          //   page:
          //     paginationState.currentPage + 1 <= paginationState.pageCount
          //       ? paginationState.currentPage + 1
          //       : paginationState.currentPage
          // });
        }
        setFilterState((prev) => ({ ...prev, runFilter: false }));
      } else if (tableState.searchValue) {
        if (externalData?.use && externalData?.search) {
          externalData?.search(
            tableState.searchValue,
            columnState.columns,
            searchFilter,
            {
              limit: paginationState.pageSize,
              page:
                paginationState.currentPage + 1 <= paginationState.pageCount
                  ? paginationState.currentPage + 1
                  : paginationState.currentPage
            }
          );
        } else {
          getSearchData({
            limit: paginationState.pageSize,
            page:
              paginationState.currentPage + 1 <= paginationState.pageCount
                ? paginationState.currentPage + 1
                : paginationState.currentPage
          });
        }
      }
    })();
  }, [
    filterState.runFilter,
    tableState.searchValue,
    paginationState.currentPage,
    paginationState.pageCount,
    paginationState.pageSize,
    getSearchData
  ]);

  const deleteItem = useCallback(
    async (id: any) => {
      const deleteId = async (idToDelete: number) => {
        try {
          setModalState((prev) => ({ ...prev, deleteLoading: true }));
          sdk.setTable(table);
          const result = await sdk.callRestAPI({ id: idToDelete }, "DELETE");
          if (!result?.error) {
            setTableState((prev) => ({
              ...prev,
              data: prev.data.filter(
                (x: any) => Number(x.id) !== Number(idToDelete)
              )
            }));
            setModalState((prev) => ({
              ...prev,
              deleteLoading: false,
              showDeleteModal: false
            }));
          }
        } catch (err: any) {
          setModalState((prev) => ({
            ...prev,
            deleteLoading: false,
            showDeleteModal: false
          }));
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
  }, [
    table,
    tableState.searchValue,
    columnState,
    excludeColumns,
    searchFilter
  ]);

  const handleAlphaSearchInput = useCallback(
    async (e: any) => {
      e?.preventDefault();
      if ([e?.code?.toLowerCase(), e?.key?.toLowerCase()].includes("enter")) {
        if (!tableState.searchValue) {
          if (externalData?.use) {
            setTableState((prev) => ({ ...prev, loading: true }));
            externalData?.fetch?.(
              paginationState.currentPage,
              paginationState.pageSize,
              {
                filterConditions: []
              }
            );
          } else {
            // await getSearchData({
            //   limit: paginationState.pageSize,
            //   page: paginationState.currentPage
            // });
          }
          setFilterState((prev) => ({ ...prev, runFilter: false }));
        } else if (tableState.searchValue) {
          if (externalData?.use && externalData?.search) {
            externalData?.search(
              tableState.searchValue,
              columnState.columns,
              searchFilter
            );
          } else {
            getSearchData({
              limit: paginationState.pageSize,
              page: paginationState.currentPage
            });
          }
        }
      } else {
        setTableState((prev) => ({
          ...prev,
          searchValue: e?.target?.value,
          runFilter: true
        }));
      }
    },
    [
      filterState.runFilter,
      tableState.searchValue,
      paginationState.currentPage,
      paginationState.pageSize,
      getSearchData
    ]
  );

  const onSubmit = useCallback(() => {
    if (!tableState.searchValue) {
      if (externalData?.use) {
        setTableState((prev) => ({ ...prev, loading: true }));
        externalData?.fetch(
          paginationState.currentPage,
          paginationState.pageSize,
          {
            filterConditions: []
          }
        );
      } else {
        // getSearchData({
        //   limit: paginationState.pageSize,
        //   page: paginationState.currentPage
        // });
      }
    } else if (tableState.searchValue) {
      if (externalData?.use && externalData?.search) {
        setTableState((prev) => ({ ...prev, loading: true }));
        externalData?.search(
          tableState.searchValue,
          paginationState.currentPage,
          paginationState.pageSize,
          {
            filterConditions: []
          }
        );
      } else {
        getSearchData({
          limit: paginationState.pageSize,
          page: paginationState.currentPage
        });
      }
    }
  }, [
    filterState.selectedOptions,
    table,
    getSearchData,
    paginationState.currentPage,
    paginationState.pageSize
  ]);

  const populateColums = useCallback(
    (data?: any | null, views?: Array<any>) => {
      if (!data) {
        return setColumnState((prev) => ({
          ...prev,
          columns: [...defaultColumns],
          columnsReady: true,
          views: views || []
        }));
      }
      const columns = data?.columns ? JSON.parse(data?.columns) : [];
      setColumnState((prev) => ({
        ...prev,
        data,
        views: views || [],
        columnId: views?.length ? data?.column_id : data?.id,
        columnsReady: true,
        columns: columns?.length ? columns : defaultColumns
      }));
    },
    [defaultColumns, columnState]
  );

  const getColumns = useCallback(async () => {
    setColumnState((prev) => ({ ...prev, columnsReady: false }));
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
    setColumnState
  ]);

  const updatePaginationData = useCallback(
    (data: { limit: number; pages: number; page: number; total: number }) => {
      setPaginationState((prev) => ({
        ...prev,
        pageSize: data?.limit,
        pageCount: data?.pages,
        currentPage: data?.page,
        dataTotal: data?.total,
        canPreviousPage: data?.page > 1,
        canNextPage: data?.page + 1 <= data?.pages
      }));
    },
    []
  );

  // Update table state when enhanced data changes
  useEffect(() => {
    if (enhancedData) {
      setTableState((prev) => ({
        ...prev,
        data: enhancedData.data,
        loading: isEnhancedLoading
      }));
      setPaginationState((prev) => ({
        ...prev,
        pageSize: enhancedData.limit,
        pageCount: enhancedData.num_pages,
        currentPage: enhancedData.page,
        dataTotal: enhancedData.total,
        canPreviousPage: enhancedData.page > 1,
        canNextPage: enhancedData.page + 1 <= enhancedData.num_pages
      }));
    }
  }, [isEnhancedLoading]);

  // Update External Selected Items
  React.useEffect(() => {
    if (actions?.select?.action) {
      actions.select.action(filterState.selectedItems);
    }
  }, [filterState.selectedItems?.length]);

  useEffect(() => {
    const searchableCol = columnState.columns?.find((col) => col?.searchable);
    if (searchableCol) {
      setTableState((prev) => ({
        ...prev,
        searchField: searchableCol?.accessor
      }));
    }
  }, []);

  React.useEffect(() => {
    if (useDefaultColumns) {
      return setColumnState((prev) => {
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
    if (columnState.columnsReady) {
      if (externalData?.use) {
        setTableState((prev) => ({ ...prev, loading: true }));
        externalData?.fetch(
          paginationState.currentPage,
          paginationState.pageSize,
          { filterConditions: [] }
        );
        // setCurrentTableData(() => externalData?.data);

        // updatePaginationData(externalData?.data);
      } else {
      }
    }
  }, [columnState.columnsReady, externalData?.use]);

  useEffect(() => {
    getProfile();
  }, []);

  // Effect to handle external data changes
  useEffect(() => {
    if (externalData?.use && externalData?.data) {
      setTableState((prev) => ({ ...prev, data: externalData.data }));
      setPaginationState((prev) => ({
        ...prev,
        pageSize: externalData.limit,
        pageCount: externalData.pages,
        currentPage: externalData.page,
        dataTotal: externalData.total,
        canPreviousPage: externalData.canPreviousPage,
        canNextPage: externalData.canNextPage
      }));
    }
  }, [
    externalData?.use,
    externalData?.data,
    externalData?.limit,
    externalData?.pages,
    externalData?.page,
    externalData?.total,
    externalData?.canPreviousPage,
    externalData?.canNextPage
  ]);
