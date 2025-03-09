import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { useSDK } from "@/hooks/useSDK";
import { TreeSDKOptions } from "@/utils/TreeSDK";

const useGetAllProjects = (
  table: keyof typeof queryKeys,
  options?: TreeSDKOptions
) => {
  const { tdk } = useSDK();

  const queryFn = async (
    table: keyof typeof queryKeys,
    options?: TreeSDKOptions
  ) => {
    const response = await tdk.getPaginate(table, options);
    return response.data;
  };

  return useQuery({
    queryKey: [queryKeys?.[table]?.all, table, options],
    enabled: !!table,
    queryFn: () => queryFn(table, options)
  });
};

export default useGetAllProjects;
