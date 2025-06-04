import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { useSDK } from "@/hooks/useSDK";
import { useContexts } from "@/hooks/useContexts";
import { ToastStatusEnum } from "@/utils/Enums";

export const useUpdateModelMutation = (table: string) => {
  const { tdk } = useSDK();
  const { showToast, tokenExpireError } = useContexts();
  const queryClient = useQueryClient();

  const mutationFn = async ({
    id,
    payload
  }: {
    id: string | number;
    payload: Record<string, any>;
  }) => {
    const response = await tdk.update(table, id, payload);
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
      showToast("Updated successfully", 5000, ToastStatusEnum.SUCCESS);
    },
    onError: (error) => {
      showToast(error.message, 5000, ToastStatusEnum.ERROR);
      tokenExpireError(error.message);
      console.error(error);
    }
  });
};

export const useUpdateWhereModelMutation = (table: string) => {
  const { tdk } = useSDK();
  const { showToast, tokenExpireError } = useContexts();
  const queryClient = useQueryClient();

  const mutationFn = async ({
    where,
    payload
  }: {
    where: Record<string, any>;
    payload: Record<string, any>;
  }) => {
    const response = await tdk.updateWhere(table, where, payload);
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
      showToast("Updated successfully", 5000, ToastStatusEnum.SUCCESS);
    },
    onError: (error) => {
      showToast(error.message, 5000, ToastStatusEnum.ERROR);
      tokenExpireError(error.message);
      console.error(error);
    }
  });
};
