import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { useSDK } from "@/hooks/useSDK";
import { TreeSDKOptions } from "@/utils/TreeSDK";

export const useViewModelQuery = (
  table: string,
  id: string | number,
  options?: TreeSDKOptions
) => {
  const { tdk } = useSDK();

  const queryFn = async (
    table: string,
    id: string | number
  ) => {
    const response = await tdk.getOne(table, id, options);
    return response.data ?? response?.model;
  };

  return useQuery({
    queryKey: [queryKeys?.[table]?.byId, table, id],
    enabled: !!id && !!table,
    queryFn: () => queryFn(table, id)
  });
};

export const useGetOneFilterModelQuery = (
  table: string,
  options?: TreeSDKOptions
) => {
  const { tdk } = useSDK();

  const queryFn = async (
    table: string,
    options?: TreeSDKOptions
  ) => {
    const response = await tdk.getOneFilter(table, options);
    return response.data ?? response?.model;
  };

  return useQuery({
    queryKey: [queryKeys?.[table]?.byId, table, options],
    enabled: !!table,
    queryFn: () => queryFn(table, options)
  });
};
