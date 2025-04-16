import { useMemo } from "react";
import { operations } from "@/utils";
import MkdSDK from "@/utils/MkdSDK";
import TreeSDK from "@/utils/TreeSDK";

interface SdkConfig {
  baseurl?: string;
  fe_baseurl?: string;
  project_id?: string;
  secret?: string;
  table?: string;
  GOOGLE_CAPTCHA_SITEKEY?: string;
}

interface UseSDKReturnType {
  sdk: MkdSDK;
  tdk: TreeSDK;
  projectId: string;
  operations: typeof operations;
}

const useSDK = (config: SdkConfig = {}): UseSDKReturnType => {
  const sdk = useMemo(() => {
    return new MkdSDK(config);
  }, [MkdSDK]);

  const tdk = useMemo(() => {
    return new TreeSDK(config);
  }, [TreeSDK]);

  const projectId = sdk.getProjectId();

  return { sdk, tdk, projectId, operations };
};

export default useSDK;
