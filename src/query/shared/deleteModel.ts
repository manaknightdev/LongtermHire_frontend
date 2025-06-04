import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { useSDK } from "@/hooks/useSDK";
import { useContexts } from "@/hooks/useContexts";
import { ToastStatusEnum } from "@/utils/Enums";

export const useDeleteModelMutation = (table: string) => {
  const { tdk } = useSDK();
  const { showToast, tokenExpireError } = useContexts();
  const queryClient = useQueryClient();

  const mutationFn = async (
    id: string | number,
    payload?: Record<string, any>
  ) => {
    const response = await tdk.delete(table, id, payload);
    return response.data ?? response?.model;
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
      showToast("Deleted successfully", 5000, ToastStatusEnum.SUCCESS);
    },
    onError: (error) => {
      showToast(error.message, 5000, ToastStatusEnum.ERROR);
      tokenExpireError(error.message);
      console.error(error);
    }
  });
};
