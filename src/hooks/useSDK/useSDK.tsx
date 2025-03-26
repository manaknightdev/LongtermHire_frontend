import { useMemo } from "react";
import { operations } from "@/utils";
import MkdSDK from "@/utils/MkdSDK";
import TreeSDK from "@/utils/TreeSDK";

interface UseSDKReturnType {
  sdk: MkdSDK;
  tdk: TreeSDK;
  projectId: string;
  operations: typeof operations;
}

const useSDK = (): UseSDKReturnType => {
  const sdk = useMemo(() => {
    return new MkdSDK({
      project_id: "pavetech"
    });
  }, [MkdSDK]);

  const tdk = useMemo(() => {
    return new TreeSDK({
      project_id: "pavetech"
    });
  }, [TreeSDK]);

  const projectId = sdk.getProjectId();

  return { sdk, tdk, projectId, operations };
};

export default useSDK;
