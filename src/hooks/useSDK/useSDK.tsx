import { useMemo, useEffect } from "react";
import { OfflineService, operations } from "@/utils";
import MkdSDK from "@/utils/MkdSDK";
import TreeSDK from "@/utils/TreeSDK";
import { OfflineAwareMkdSDK } from "@/utils/offline/OfflineAwareMkdSDK";
import { OfflineAwareTreeSDK } from "@/utils/offline/OfflineAwareTreeSDK";
import { useOffline } from "@/hooks/useOffline";

interface SdkConfig {
  baseurl?: string;
  fe_baseurl?: string;
  project_id?: string;
  secret?: string;
  table?: string;
  GOOGLE_CAPTCHA_SITEKEY?: string;
  enableOfflineMode?: boolean;
}

interface UseSDKReturnType {
  sdk: OfflineAwareMkdSDK | MkdSDK;
  tdk: OfflineAwareTreeSDK | TreeSDK;
  projectId: string;
  operations: typeof operations;
  isOfflineMode: boolean;
}

const useSDK = (config: SdkConfig = {}): UseSDKReturnType => {
  // Try to get offline context, but don't require it
  // Note: useOffline must be called unconditionally to follow Rules of Hooks
  const offlineContext = useOffline();

  const enableOfflineMode = config.enableOfflineMode ?? true;
  const hasOfflineService = offlineContext && enableOfflineMode;
  const offlineService = offlineContext?.offlineService;

  const sdk = useMemo(() => {
    if (hasOfflineService) {
      return new OfflineAwareMkdSDK(config, offlineService);
    }
    return new MkdSDK(config);
  }, [config, hasOfflineService]);

  const tdk = useMemo(() => {
    if (hasOfflineService) {
      return new OfflineAwareTreeSDK(config, offlineService);
    }
    return new TreeSDK(config);
  }, [config, hasOfflineService]);

  // Configure offline-aware SDKs with offline mode settings
  useEffect(() => {
    if (hasOfflineService && offlineContext) {
      // Set offline mode based on network status
      const isOffline = !offlineContext.state.networkStatus.isOnline;

      if (sdk instanceof OfflineAwareMkdSDK) {
        sdk.setOfflineMode(isOffline);
      }
      if (tdk instanceof OfflineAwareTreeSDK) {
        tdk.setOfflineMode(isOffline);
      }
    }
  }, [
    hasOfflineService,
    offlineContext,
    sdk,
    tdk,
    offlineContext?.state.networkStatus.isOnline,
  ]);

  const projectId = sdk.getProjectId();

  return {
    sdk,
    tdk,
    projectId,
    operations,
    isOfflineMode: hasOfflineService,
  };
};

export default useSDK;
