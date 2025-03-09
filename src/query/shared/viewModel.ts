import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { useSDK } from "@/hooks/useSDK";

export const useViewModelQuery = (
  table: keyof typeof queryKeys,
  id: string | number
) => {
  const { tdk } = useSDK();

  const queryFn = async (
    table: keyof typeof queryKeys,
    id: string | number
  ) => {
    const response = await tdk.getOne(table, id);
    return response.data ?? response?.model;
  };

  return useQuery({
    queryKey: [queryKeys?.[table]?.byId, table, id],
    enabled: !!id && !!table,
    queryFn: () => queryFn(table, id)
  });
};
