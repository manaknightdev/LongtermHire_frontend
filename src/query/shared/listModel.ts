import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { useSDK } from "@/hooks/useSDK";
import { TreeSDKOptions } from "@/utils/TreeSDK";

export const useGetPaginateQuery = (
  table: keyof typeof queryKeys,
  options?: TreeSDKOptions
) => {
  const { tdk } = useSDK();

  const queryFn = async (
    table: keyof typeof queryKeys,
    options?: TreeSDKOptions
  ) => {
    const response = await tdk.getPaginate(table, options);
    return {
      data: response?.list ?? response?.data ?? response?.model,
      total: response?.total,
      limit: response?.limit,
      num_pages: response?.num_pages,
      page: response?.page
    };
  };

  return useQuery({
    queryKey: [queryKeys?.[table]?.all, table, options],
    enabled: !!table,
    queryFn: () => queryFn(table, options)
  });
};
