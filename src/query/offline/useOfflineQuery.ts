import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useOffline } from "@/hooks/useOffline";
import { getOfflineQueryOptions } from "./offlineQueryClient";

/**
 * Enhanced useQuery hook with offline support
 */
export function useOfflineQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  > & {
    enableOfflineCache?: boolean;
    offlineCacheTime?: number;
    enableBackgroundSync?: boolean;
    fallbackData?: TData;
  }
): UseQueryResult<TData, TError> & {
  isOffline: boolean;
  isCached: boolean;
  syncStatus: "synced" | "pending" | "failed" | "unknown";
} {
  const queryClient = useQueryClient();

  // Try to get offline context, but don't require it
  const offlineContext = useOffline();

  const offlineService = offlineContext?.state
    ? // We would need to access the offline service from context
      // For now, we'll use the network status from context
      undefined
    : undefined;

  const isOffline = offlineContext?.state?.networkStatus
    ? !offlineContext.state.networkStatus.isOnline
    : false;

  // Get offline-aware query options
  const offlineOptions = getOfflineQueryOptions(offlineService, {
    enableOfflineCache: options?.enableOfflineCache,
    offlineCacheTime: options?.offlineCacheTime,
    enableBackgroundSync: options?.enableBackgroundSync,
  });

  // Enhanced query function that handles offline scenarios
  const enhancedQueryFn = async (): Promise<TQueryFnData> => {
    try {
      return await queryFn();
    } catch (error) {
      // If we're offline and have fallback data, use it
      if (isOffline && options?.fallbackData) {
        console.log("Using fallback data while offline");
        return options.fallbackData as TQueryFnData;
      }

      // Check if we have cached data
      const cachedData = queryClient.getQueryData(queryKey);
      if (isOffline && cachedData) {
        console.log("Using cached data while offline");
        return cachedData as TQueryFnData;
      }

      throw error;
    }
  };

  // Merge options, ensuring refetchInterval is properly typed
  const { refetchInterval: userRefetchInterval, ...restOptions } =
    options || {};

  // Ensure refetchInterval is never a boolean
  const safeRefetchInterval = (() => {
    if (typeof userRefetchInterval === "boolean") {
      return userRefetchInterval ? 30000 : false;
    }
    if (
      typeof userRefetchInterval === "number" ||
      typeof userRefetchInterval === "function"
    ) {
      return userRefetchInterval;
    }
    // Check offlineOptions.refetchInterval and ensure it's not boolean
    const offlineRefetch = offlineOptions.refetchInterval;
    if (typeof offlineRefetch === "boolean") {
      return offlineRefetch ? 30000 : false;
    }
    return offlineRefetch || false;
  })();

  const mergedOptions: any = {
    ...offlineOptions,
    ...restOptions,
    queryKey,
    queryFn: enhancedQueryFn,
    refetchInterval: safeRefetchInterval,
  };

  const result = useQuery(mergedOptions);

  // Determine if data is cached/offline
  const isCached = isOffline && !!result.data;

  // Determine sync status
  let syncStatus: "synced" | "pending" | "failed" | "unknown" = "unknown";
  if (offlineContext?.state) {
    const { queueStats, syncStatus: contextSyncStatus } = offlineContext.state;
    if (queueStats.total > 0) {
      syncStatus = "pending";
    } else if (contextSyncStatus.failedRequests > 0) {
      syncStatus = "failed";
    } else {
      syncStatus = "synced";
    }
  }

  return {
    ...result,
    isOffline,
    isCached,
    syncStatus,
  } as any;
}

/**
 * Hook for paginated queries with offline support
 */
export function useOfflinePaginatedQuery<
  TQueryFnData = unknown,
  _TError = unknown,
  _TData = TQueryFnData,
>(
  table: string,
  options?: {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
    sort?: string;
    enableOfflineCache?: boolean;
    offlineCacheTime?: number;
  }
) {
  const {
    page = 1,
    limit = 10,
    filters = {},
    sort,
    ...offlineOptions
  } = options || {};

  const queryKey = ["paginated", table, { page, limit, filters, sort }];

  // This would use your existing pagination query function
  const queryFn = async () => {
    // Implementation would depend on your SDK
    throw new Error("Pagination query function not implemented");
  };

  return useOfflineQuery(queryKey, queryFn, {
    ...offlineOptions,
    placeholderData: (previousData) => previousData, // Important for pagination
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for single item queries with offline support
 */
export function useOfflineItemQuery<
  TQueryFnData = unknown,
  _TError = unknown,
  _TData = TQueryFnData,
>(
  table: string,
  id: string | number,
  options?: {
    enableOfflineCache?: boolean;
    offlineCacheTime?: number;
    enabled?: boolean;
  }
) {
  const queryKey = ["item", table, id];

  const queryFn = async () => {
    // Implementation would depend on your SDK
    throw new Error("Item query function not implemented");
  };

  return useOfflineQuery(queryKey, queryFn, {
    ...options,
    enabled: options?.enabled !== false && !!id,
  });
}

export default useOfflineQuery;
