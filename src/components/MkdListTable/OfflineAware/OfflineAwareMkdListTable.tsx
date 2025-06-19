import React, { useMemo } from "react";
import { useOffline } from "@/hooks/useOffline";
import { Action } from "@/interfaces";
import { ActionLocations, DisplayEnum } from "@/utils/Enums";
import { queryKeys } from "@/query/queryKeys";
import { MkdListTableV3Wrapper } from "@/components/MkdListTable";

interface OfflineAwareMkdListTableProps {
  // Core table props (matching V3Wrapper interface)
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
  initialQueryOptions?: any;

  // Offline-specific props
  showOfflineIndicators?: boolean;
  offlineRowClassName?: string;
  enableOfflineActions?: boolean;
}

/**
 * Offline-aware version of MkdListTableV3 that shows offline status and handles offline data
 */
export const OfflineAwareMkdListTable: React.FC<
  OfflineAwareMkdListTableProps
> = ({
  showOfflineIndicators = true,
  offlineRowClassName:
    _offlineRowClassName = "bg-yellow-50 border-l-4 border-l-yellow-400",
  enableOfflineActions = true,
  actions,
  processes = [],
  ...props
}) => {
  const { state } = useOffline();
  const { networkStatus, queueStats } = state;

  // Enhanced processes to add offline indicators to data
  const enhancedProcesses = useMemo(() => {
    if (!showOfflineIndicators) {
      return processes;
    }

    const offlineProcess = async (data: any[]) => {
      return data.map((item: any) => ({
        ...item,
        _isOffline: item._offline || item._cached || false,
        _isPending: item._requestId && queueStats.total > 0,
      }));
    };

    return [...processes, offlineProcess];
  }, [processes, showOfflineIndicators, queueStats.total]);

  // Enhance actions to handle offline scenarios
  const enhancedActions = useMemo(() => {
    if (!enableOfflineActions || !actions) {
      return actions;
    }

    const enhanced: { [key: string]: Action } = {};

    Object.entries(actions).forEach(([key, config]) => {
      enhanced[key] = {
        ...config,
        action: async (...rest) => {
          // If offline and this is a destructive action, show warning
          if (!networkStatus.isOnline && config.offlineEnabled) {
            const confirmed = window.confirm(
              "You are offline. This action will be queued and executed when you come back online. Continue?"
            );
            if (!confirmed) return;
          }

          // Call original action
          if (config.action) {
            return config.action(...rest);
          }
        },
      };
    });

    return enhanced;
  }, [actions, enableOfflineActions, networkStatus.isOnline]);

  return (
    <div className="grid h-full max-h-full min-h-full w-full grid-cols-1 grid-rows-[auto_1fr_auto] p-8 transition-colors duration-200">
      {/* Offline banner */}
      <div>
        {!networkStatus.isOnline && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  You are currently offline. Data shown may be cached.
                  {queueStats.total > 0 &&
                    ` ${queueStats.total} changes are pending sync.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid h-full max-h-full min-h-full w-full grid-cols-1 grid-rows-1">
        {/* Enhanced table */}
        <MkdListTableV3Wrapper
          {...props}
          processes={enhancedProcesses}
          actions={enhancedActions}
        />
      </div>
      <div>
        {/* Sync status footer */}
        {queueStats.total > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700">
                  {queueStats.total} changes pending sync
                </span>
              </div>
              <div className="text-xs text-blue-600">
                High: {queueStats.byPriority.high}, Medium:{" "}
                {queueStats.byPriority.medium}, Low: {queueStats.byPriority.low}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineAwareMkdListTable;
