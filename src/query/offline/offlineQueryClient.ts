import { QueryClient, QueryClientConfig } from "@tanstack/react-query";
import { OfflineService } from "@/utils/offline/OfflineService";

/**
 * Enhanced QueryClient configuration for offline support
 */
export const createOfflineQueryClient = (
  offlineService?: OfflineService
): QueryClient => {
  const config: QueryClientConfig = {
    defaultOptions: {
      queries: {
        // Enable experimental prefetch in render
        experimental_prefetchInRender: true,

        // Retry configuration for offline scenarios
        retry: (failureCount, error) => {
          // Don't retry if we're offline
          if (offlineService && !offlineService.isOnline()) {
            return false;
          }

          // Retry up to 3 times for network errors
          if (failureCount < 3) {
            const errorMessage = (error as Error)?.message?.toLowerCase() || "";
            const isNetworkError =
              errorMessage.includes("network") ||
              errorMessage.includes("fetch") ||
              errorMessage.includes("timeout");
            return isNetworkError;
          }

          return false;
        },

        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Stale time - data is considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000,

        // Cache time - data stays in cache for 30 minutes
        gcTime: 30 * 60 * 1000,

        // Refetch on window focus only if online
        refetchOnWindowFocus: () => {
          return offlineService ? offlineService.isOnline() : true;
        },

        // Refetch on reconnect
        refetchOnReconnect: true,

        // Background refetch interval (only when online)
        refetchInterval: () => {
          if (offlineService && !offlineService.isOnline()) {
            return false;
          }
          return false; // Disable by default, can be overridden per query
        },

        // Network mode - always fetch when online, use cache when offline
        networkMode: "online",

        // Error handling is now done via global error boundary or per-query
        // onError has been removed from default query options in newer versions
      },

      mutations: {
        // Retry mutations only when online
        retry: (failureCount, error) => {
          if (offlineService && !offlineService.isOnline()) {
            return false; // Don't retry mutations when offline
          }

          // Retry up to 2 times for network errors
          if (failureCount < 2) {
            const errorMessage = (error as Error)?.message?.toLowerCase() || "";
            const isNetworkError =
              errorMessage.includes("network") ||
              errorMessage.includes("fetch") ||
              errorMessage.includes("timeout");
            return isNetworkError;
          }

          return false;
        },

        // Retry delay for mutations
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

        // Network mode for mutations
        networkMode: "online",

        // Error handling for mutations
        onError: (error, _variables, _context) => {
          console.warn("Mutation error:", error);

          // If offline, the mutation should have been queued by the offline-aware SDK
          if (offlineService && !offlineService.isOnline()) {
            console.log(
              "Mutation failed while offline, should be queued for sync"
            );
          }
        },

        // Success handling for mutations
        onSuccess: (data, _variables, _context) => {
          // If the mutation was successful and we have offline data,
          // we might want to clean up any related offline entries
          console.log("Mutation successful:", data);
        },
      },
    },
  };

  const queryClient = new QueryClient(config);

  // Set up global error handling
  queryClient.setMutationDefaults(["create", "update", "delete"], {
    onError: (_error, _variables, _context) => {
      // Handle offline mutations
      if (offlineService && !offlineService.isOnline()) {
        console.log("Mutation queued for offline sync");
      }
    },
  });

  // Listen for online/offline events to invalidate queries
  if (offlineService) {
    offlineService.on("network-status-changed", (status) => {
      if (status.isOnline) {
        // When coming back online, invalidate all queries to refresh data
        queryClient.invalidateQueries();
        console.log("Back online - invalidating all queries");
      }
    });

    offlineService.on("sync-completed", (result) => {
      if (result.success > 0) {
        // When sync completes successfully, invalidate queries to show updated data
        queryClient.invalidateQueries();
        console.log(
          `Sync completed - ${result.success} requests synced, invalidating queries`
        );
      }
    });
  }

  return queryClient;
};

/**
 * Utility function to check if a query should use cached data
 */
export const shouldUseCachedData = (
  offlineService?: OfflineService
): boolean => {
  if (!offlineService) return false;

  const networkStatus = offlineService.getNetworkStatus();
  return !networkStatus.isOnline || networkStatus.isSlowConnection;
};

/**
 * Custom query options for offline-aware queries
 */
export const getOfflineQueryOptions = (
  offlineService?: OfflineService,
  options: {
    enableOfflineCache?: boolean;
    offlineCacheTime?: number;
    enableBackgroundSync?: boolean;
  } = {}
) => {
  const {
    enableOfflineCache = true,
    offlineCacheTime = 24 * 60 * 60 * 1000, // 24 hours
    enableBackgroundSync = true,
  } = options;

  return {
    // Use cached data when offline
    enabled: offlineService
      ? offlineService.isOnline() || enableOfflineCache
      : true,

    // Longer cache time for offline scenarios
    gcTime: shouldUseCachedData(offlineService)
      ? offlineCacheTime
      : 30 * 60 * 1000,

    // Longer stale time when offline
    staleTime: shouldUseCachedData(offlineService)
      ? offlineCacheTime
      : 5 * 60 * 1000,

    // Don't refetch on window focus when offline
    refetchOnWindowFocus: offlineService ? offlineService.isOnline() : true,

    // Background refetch only when online and enabled
    refetchInterval:
      enableBackgroundSync && offlineService?.isOnline() ? 30000 : false,

    // Network mode
    networkMode: "online" as const,

    // Retry configuration
    retry: (failureCount: number, _error: Error) => {
      if (offlineService && !offlineService.isOnline()) {
        return false;
      }
      return failureCount < 3;
    },
  };
};
