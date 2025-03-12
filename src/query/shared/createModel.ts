import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { useSDK } from "@/hooks/useSDK";
import { useContexts } from "@/hooks/useContexts";
import { ToastStatusEnum } from "@/utils/Enums";
import { ApiResponse } from "@/utils/TreeSDK";

export const useCreateModelMutation = (table: keyof typeof queryKeys) => {
  const { tdk } = useSDK();
  const { showToast, tokenExpireError } = useContexts();
  const queryClient = useQueryClient();

  const mutationFn = async (
    payload: Record<string, any>
  ): Promise<ApiResponse> => {
    const response = await tdk.create(table, payload);
    return response;
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys?.[table]?.all, table]
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys?.[table]?.list, table]
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys?.[table]?.many, table]
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys?.[table]?.paginate, table]
      });
      showToast("Created successfully", 5000, ToastStatusEnum.SUCCESS);
    },
    onError: (error) => {
      showToast(error.message, 5000, ToastStatusEnum.ERROR);
      tokenExpireError(error.message);
      console.error(error);
    }
  });
};
