import { useOffline as useOfflineContext } from "@/context/Offline";
import { OfflineContextType } from "@/context/Offline/types";

/**
 * Hook to access offline functionality
 * This is a re-export of the context hook for convenience
 */
export const useOffline = (): OfflineContextType => {
  return useOfflineContext();
};

export default useOffline;
