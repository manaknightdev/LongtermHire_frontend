import { useMemo, useCallback, useState, useEffect } from "react";
import { useGetPaginateQuery } from "@/query/shared/listModel";
import { getProcessedTableData } from "@/components/MkdListTable/MkdListTableRowListColumn";
import { useContexts } from "@/hooks/useContexts";
import { TreeSDKOptions } from "@/utils/TreeSDK";
import { ColumnDataState } from "@/interfaces/table.interface";

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

interface UseEnhancedTableDataProps {
  table: string;
  processes?: any[];
  // options: TreeSDKOptions;
  // columnState: ColumnDataState;
}

interface ProcessedData {
  data: any[];
  total: number;
  limit: number;
  num_pages: number;
  page: number;
}

export const useEnhancedTableData = ({
  table,
  // options,
  // columnState,
  processes = []
}: UseEnhancedTableDataProps) => {
  const {
    globalDispatch,
    authDispatch: dispatch,
    tableState,
    setTableState
  } = useContexts();
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );

  const {
    queryOptions: queryOptionsData,
    columnState: columnStateData,
    filterState: filterStateData
  } = tableState?.[table] ?? {
    queryOptions: {},
    columnState: {},
    filterState: {},
    paginationState: {},
    modalState: {}
  };

  // Memoize the query options to prevent unnecessary refetches
  const queryOptions = useMemo(() => {
    return {
      size: queryOptionsData?.size,
      page: queryOptionsData?.page,
      join: queryOptionsData?.join,
      order: queryOptionsData?.order,
      direction: queryOptionsData?.direction,
      filter: queryOptionsData?.filter
    };
  }, [
    queryOptionsData?.size,
    queryOptionsData?.page,
    queryOptionsData?.join,
    queryOptionsData?.order,
    queryOptionsData?.direction,
    queryOptionsData?.filter
  ]);

  // console.log("useEnhancedTableData >>", queryOptions);
  // {
  // enabled: !!filterStateData?.enabled
  // }
  const {
    data: rawData,
    isLoading,
    error,
    isFetched,
    isFetching
  } = useGetPaginateQuery(table as any, queryOptions);

  // Memoize the data processing function
  const processData = useCallback(
    async (data: any[]) => {
      if (!columnStateData?.columns) return null;

      let processedData = data;

      // Apply data processes
      if (columnStateData?.columns) {
        processedData = await dataProcesses(
          processes,
          processedData,
          columnStateData?.columns
        );

        // Apply table data processing
        processedData = await getProcessedTableData(
          processedData,
          columnStateData?.columns,
          globalDispatch,
          dispatch
        );
      }

      setTableState(table, {
        ...tableState?.[table],
        filterState: {
          ...tableState?.[table]?.filterState,
          enabled: false
        }
      });

      return {
        data: processedData,
        total: rawData?.total ?? 0,
        limit: rawData?.limit ?? 0,
        num_pages: rawData?.num_pages ?? 0,
        page: rawData?.page ?? 1
      } as ProcessedData;
    },
    [
      columnStateData?.columns,
      setTableState,
      table,
      tableState,
      rawData?.total,
      rawData?.limit,
      rawData?.num_pages,
      rawData?.page,
      processes,
      globalDispatch,
      dispatch
    ]
  );

  // Handle data processing in an effect
  useEffect(() => {
    if (!filterStateData?.enabled || isFetching || !isFetched) return;
    let isMounted = true;

    const processAndSetData = async () => {
      if (!rawData?.data) return;

      const result = await processData(rawData.data);
      if (isMounted && result) {
        setProcessedData(() => result);
      }
    };

    processAndSetData();
    console.log("useEnhancedTableData useEffect");
    return () => {
      isMounted = false;
    };
  }, [
    rawData?.data,
    processData,
    filterStateData?.enabled,
    isFetching,
    isFetched
  ]);

  return {
    data: processedData,
    isLoading,
    error
  };
};
