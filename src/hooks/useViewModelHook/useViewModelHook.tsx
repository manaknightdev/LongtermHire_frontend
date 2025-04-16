import { useViewModelQuery } from "@/query/shared";

export const useViewModelHook = (model: string, id: string | number) => {
  const { data, isLoading } = useViewModelQuery(model, id);

  return {
    data,
    isLoading
  };
};
