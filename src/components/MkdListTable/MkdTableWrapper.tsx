import React, { useMemo } from "react";
import { Action, ExternalData } from "@/interfaces";
import { queryKeys } from "@/query/queryKeys";
import { TreeSDKOptions } from "@/utils/TreeSDK";
import { MkdListTableV2 } from "@/components/MkdListTable";
import { ActionLocations, DisplayEnum } from "@/utils/Enums";
import { useEnhancedTableData } from "@/hooks/useEnhancedTableData";

interface MkdTableWrapperProps {
  table: keyof typeof queryKeys;
  tableRole?: string;
  defaultColumns?: any[];
  excludeColumns?: any[];
  columnModel?: any | null;
  processes?: any[];
  actions?: { [key: string]: Action };
  actionPostion?: ActionLocations[];
  actionId?: string;
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
  initialQueryOptions?: TreeSDKOptions;
}

const MkdTableWrapper = ({
  table,
  tableRole = "admin",
  defaultColumns = [],
  excludeColumns = [],
  columnModel = null,
  processes = [],
  actions = {},
  actionPostion = [ActionLocations.DROPDOWN],
  actionId = "id",
  tableTitle = "",
  tableSchema = [],
  hasFilter = true,
  schemaFields = [],
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
  onReady,
  maxHeight = null,
  rawFilter = [],
  noDataComponent,
  useImage = true,
  canChangeLimit = true,
  selectedItemsRef = null,
  useDefaultColumns = false,
  showYScrollbar = false,
  showXScrollbar = false,
  showScrollbar = true
}: MkdTableWrapperProps) => {
  // Fetch data using React Query
  const { data: enhancedData, isLoading } = useEnhancedTableData({
    table,
    processes
  });

  const externalData = useMemo(() => {
    return {
      use: true,
      loading: isLoading,
      pageSize: enhancedData?.limit,
      pageCount: enhancedData?.num_pages,
      currentPage: enhancedData?.page,
      dataTotal: enhancedData?.total,
      canPreviousPage: enhancedData?.page && enhancedData?.page > 1,
      canNextPage:
        enhancedData?.page && enhancedData?.page + 1 <= enhancedData?.num_pages,
      page: enhancedData?.page,
      pages: enhancedData?.num_pages,
      data: enhancedData?.data ?? [],
      limit: enhancedData?.limit,
      total: enhancedData?.total
    } as ExternalData;
  }, [
    enhancedData?.data,
    isLoading,
    enhancedData?.page,
    enhancedData?.num_pages,
    enhancedData?.total,
    enhancedData?.limit
  ]);

  return (
    <MkdListTableV2
      table={table}
      tableRole={tableRole}
      defaultColumns={defaultColumns}
      excludeColumns={excludeColumns}
      columnModel={columnModel}
      processes={processes}
      actions={actions}
      actionPostion={actionPostion}
      actionId={actionId}
      tableTitle={tableTitle}
      tableSchema={tableSchema}
      hasFilter={hasFilter}
      schemaFields={schemaFields}
      showPagination={showPagination}
      defaultFilter={defaultFilter}
      allowEditing={allowEditing}
      allowSortColumns={allowSortColumns}
      showSearch={showSearch}
      topClasses={topClasses}
      join={join}
      filterDisplays={filterDisplays}
      resetFilters={resetFilters}
      defaultPageSize={defaultPageSize}
      searchFilter={searchFilter}
      onReady={onReady}
      maxHeight={maxHeight}
      rawFilter={rawFilter}
      noDataComponent={noDataComponent}
      useImage={useImage}
      canChangeLimit={canChangeLimit}
      useDefaultColumns={useDefaultColumns}
      showYScrollbar={showYScrollbar}
      showXScrollbar={showXScrollbar}
      showScrollbar={showScrollbar}
      externalData={externalData}
      refreshRef={refreshRef}
      selectedItemsRef={selectedItemsRef}
    />
  );
};

export default MkdTableWrapper;
