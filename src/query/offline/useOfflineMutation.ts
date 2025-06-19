import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { useOffline } from "@/hooks/useOffline";

/**
 * Enhanced useMutation hook with offline support
 */
export function useOfflineMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext> & {
    table?: string;
    operation?: "create" | "update" | "delete" | "custom";
    priority?: "high" | "medium" | "low";
    optimisticUpdate?: (variables: TVariables) => any;
    invalidateQueries?: string[] | boolean;
  }
): UseMutationResult<TData, TError, TVariables, TContext> & {
  isOffline: boolean;
  isQueued: boolean;
} {
  const queryClient = useQueryClient();

  // Try to get offline context
  const offlineContext = useOffline();

  const isOffline = offlineContext?.state?.networkStatus
    ? !offlineContext.state.networkStatus.isOnline
    : false;

  // Enhanced mutation function that handles offline scenarios
  const enhancedMutationFn = async (variables: TVariables): Promise<TData> => {
    try {
      // If online, proceed with normal mutation
      if (!isOffline) {
        return await mutationFn(variables);
      }

      // If offline, handle optimistic updates and queueing
      if (isOffline && offlineContext) {
        // Apply optimistic update if provided
        if (options?.optimisticUpdate && options?.table) {
          const optimisticData = options.optimisticUpdate(variables);

          // Update relevant queries optimistically
          if (options.table) {
            const queryKey = ["list", options.table];
            queryClient.setQueryData(queryKey, (oldData: any) => {
              if (!oldData) return oldData;

              if (options.operation === "create") {
                return {
                  ...oldData,
                  list: [...(oldData.list || []), optimisticData],
                };
              } else if (options.operation === "update") {
                return {
                  ...oldData,
                  list: (oldData.list || []).map((item: any) =>
                    item.id === optimisticData.id ? optimisticData : item
                  ),
                };
              } else if (options.operation === "delete") {
                return {
                  ...oldData,
                  list: (oldData.list || []).filter(
                    (item: any) => item.id !== optimisticData.id
                  ),
                };
              }

              return oldData;
            });
          }
        }

        // Queue the request for later sync
        if (options?.table && options?.operation) {
          await offlineContext.actions.queueRequest({
            endpoint: `/v1/api/{{project}}/{{role}}/${options.table}`,
            method: getMethodForOperation(options.operation),
            body: variables,
            table: options.table,
            operation: options.operation,
            priority: options.priority || "medium",
            maxRetries: 3,
            metadata: { variables },
          });
        }

        // Return optimistic response
        return {
          success: true,
          data: options?.optimisticUpdate
            ? options.optimisticUpdate(variables)
            : variables,
          message: "Queued for sync when online",
          offline: true,
        } as TData;
      }

      // Fallback to original mutation
      return await mutationFn(variables);
    } catch (error) {
      // If it's a network error and we're offline, queue the request
      if (
        isNetworkError(error) &&
        offlineContext &&
        options?.table &&
        options?.operation
      ) {
        await offlineContext.actions.queueRequest({
          endpoint: `/v1/api/{{project}}/{{role}}/${options.table}`,
          method: getMethodForOperation(options.operation),
          body: variables,
          table: options.table,
          operation: options.operation,
          priority: options.priority || "medium",
          maxRetries: 3,
          metadata: { variables },
        });

        // Return optimistic response
        return {
          success: true,
          data: options?.optimisticUpdate
            ? options.optimisticUpdate(variables)
            : variables,
          message: "Queued for sync when online (network error)",
          offline: true,
        } as TData;
      }

      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: enhancedMutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate queries if specified
      if (options?.invalidateQueries) {
        if (options.invalidateQueries === true && options.table) {
          // Invalidate all queries for this table
          queryClient.invalidateQueries({ queryKey: ["list", options.table] });
          queryClient.invalidateQueries({ queryKey: ["item", options.table] });
          queryClient.invalidateQueries({
            queryKey: ["paginated", options.table],
          });
        } else if (Array.isArray(options.invalidateQueries)) {
          // Invalidate specific query keys
          options.invalidateQueries.forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          });
        }
      }

      // Call original onSuccess
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Revert optimistic updates on error (if not offline)
      if (!isOffline && options?.table && options?.optimisticUpdate) {
        queryClient.invalidateQueries({ queryKey: ["list", options.table] });
        queryClient.invalidateQueries({ queryKey: ["item", options.table] });
        queryClient.invalidateQueries({
          queryKey: ["paginated", options.table],
        });
      }

      // Call original onError
      options?.onError?.(error, variables, context);
    },
  });

  // Determine if mutation is queued
  const isQueued = isOffline && mutation.isSuccess;

  return {
    ...mutation,
    isOffline,
    isQueued,
  };
}

/**
 * Create mutation hook for specific operations
 */
export function useOfflineCreateMutation<TData = unknown, TVariables = unknown>(
  table: string,
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Parameters<typeof useOfflineMutation>[1]
) {
  return useOfflineMutation(mutationFn, {
    ...options,
    table,
    operation: "create",
    priority: "high",
    invalidateQueries: true,
  });
}

export function useOfflineUpdateMutation<TData = unknown, TVariables = unknown>(
  table: string,
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Parameters<typeof useOfflineMutation>[1]
) {
  return useOfflineMutation(mutationFn, {
    ...options,
    table,
    operation: "update",
    priority: "high",
    invalidateQueries: true,
  });
}

export function useOfflineDeleteMutation<TData = unknown, TVariables = unknown>(
  table: string,
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Parameters<typeof useOfflineMutation>[1]
) {
  return useOfflineMutation(mutationFn, {
    ...options,
    table,
    operation: "delete",
    priority: "high",
    invalidateQueries: true,
  });
}

// Helper functions
function getMethodForOperation(operation: string): string {
  switch (operation) {
    case "create":
      return "POST";
    case "update":
      return "PUT";
    case "delete":
      return "DELETE";
    default:
      return "POST";
  }
}

function isNetworkError(error: any): boolean {
  if (!error) return false;

  const errorMessage = (error.message || error.toString()).toLowerCase();
  return (
    errorMessage.includes("network") ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("timeout") ||
    errorMessage.includes("connection") ||
    error.name === "TypeError"
  );
}

export default useOfflineMutation;
