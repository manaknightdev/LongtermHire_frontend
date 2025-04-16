import { useMutation } from "@tanstack/react-query";
import { useSDK } from "@/hooks/useSDK";
import { useContexts } from "@/hooks/useContexts";
import { ToastStatusEnum } from "@/utils/Enums";
import { MethodConfig } from "@/utils/MkdSDK";

export const useCustomModelQuery = () => {
  const { sdk } = useSDK();
  const { showToast, tokenExpireError } = useContexts();

  const mutationFn = async (options: MethodConfig) => {
    const response = await sdk.request(options);

    return response;
  };

  return useMutation({
    mutationFn,
    onSuccess: (response: any) => {
      console.log(response);
      showToast(response?.message || "Success", 5000, ToastStatusEnum.SUCCESS);
    },
    onError: (error) => {
      showToast(error.message, 5000, ToastStatusEnum.ERROR);
      tokenExpireError(error.message);
      console.error(error);
    }
  });
};
