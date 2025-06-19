import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { useSDK } from "@/hooks/useSDK";
import { TreeSDKOptions, ApiResponse } from "@/utils/TreeSDK";
import { getOfflineQueryOptions } from "../offline/offlineQueryClient";

// Extended interface for offline-aware API responses
interface OfflineAwareApiResponse<T = any> extends ApiResponse<T> {
  _offline?: boolean;
}

export const useGetPaginateQuery = (
  table: string,
  options?: TreeSDKOptions,
  config?: {
    enabled?: boolean;
    enableOfflineCache?: boolean;
    [key: string]: any;
  }
) => {
  const { tdk, isOfflineMode } = useSDK();

  const queryFn = async (table: string, options?: TreeSDKOptions) => {
    const response = (await tdk.getPaginate(
      table,
      options
    )) as OfflineAwareApiResponse;
    return {
      data: response?.list ?? response?.data ?? response?.model,
      total: response?.total,
      limit: response?.limit,
      num_pages: response?.num_pages,
      page: response?.page,
      _offline: response?._offline || false,
    };
  };

  // Get offline-aware query options
  const offlineOptions = isOfflineMode
    ? getOfflineQueryOptions(undefined, {
        enableOfflineCache: config?.enableOfflineCache,
      })
    : {};

  return useQuery({
    queryKey: [queryKeys?.[table]?.paginate, table, options],
    queryFn: () => queryFn(table, options),
    ...offlineOptions,
    ...config,
  });
};

export const useGetListQuery = (
  table: string,
  options?: TreeSDKOptions,
  config?: {
    enableOfflineCache?: boolean;
    [key: string]: any;
  }
) => {
  const { tdk, isOfflineMode } = useSDK();

  const queryFn = async (table: string, options?: TreeSDKOptions) => {
    const response = (await tdk.getList(
      table,
      options
    )) as OfflineAwareApiResponse;
    return {
      data: response?.list ?? response?.data ?? response?.model,
      total: response?.total,
      limit: response?.limit,
      num_pages: response?.num_pages,
      page: response?.page,
      _offline: response?._offline || false,
    };
  };

  // Get offline-aware query options
  const offlineOptions = isOfflineMode
    ? getOfflineQueryOptions(undefined, {
        enableOfflineCache: config?.enableOfflineCache,
      })
    : {};

  return useQuery({
    queryKey: [queryKeys?.[table]?.list, table, options],
    enabled: !!table,
    queryFn: () => queryFn(table, options),
    ...offlineOptions,
    ...config,
  });
};

export const useGetManyQuery = (
  table: string,
  ids: number | string | (number | string)[],
  options?: TreeSDKOptions
) => {
  const { tdk } = useSDK();

  const queryFn = async (
    table: string,
    ids: number | string | (number | string)[],
    options?: TreeSDKOptions
  ) => {
    const response = await tdk.getMany(table, ids, options);
    return {
      data: response?.list ?? response?.data ?? response?.model,
      total: response?.total,
      limit: response?.limit,
      num_pages: response?.num_pages,
      page: response?.page,
    };
  };

  return useQuery({
    queryKey: [queryKeys?.[table]?.many, table, ids, options],
    enabled: !!table && !!ids,
    queryFn: () => queryFn(table, ids, options),
  });
};
