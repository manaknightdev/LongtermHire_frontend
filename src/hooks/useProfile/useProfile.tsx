import React, { useEffect, useState } from "react";
import { useSDK } from "../useSDK";
import { useContexts } from "../useContexts";
import { ApiError } from "@/context/Global";

const useProfile = () => {
  const { sdk } = useSDK();

  const {
    authState: { profile: AuthProfile },
    authDispatch: dispatch,
    tokenExpireError
  } = useContexts();

  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const getProfile = React.useCallback(() => {
    (async () => {
      try {
        const role = localStorage.getItem("role");
        if (!role) {
          return;
        }
        const result = await sdk.getProfile();
        console.log(result);
        if (!result?.error) {
          setProfile(() => ({
            ...result?.model,
            role: result?.model?.role ?? result?.model?.role_id
          }));
          dispatch({
            type: "UPDATE_PROFILE",
            payload: {
              ...result?.model,
              role: result?.model?.role ?? result?.model?.role_id
            }
          });
        }
      } catch (error) {
        const err = error as ApiError;
        const message =
          err?.response?.data?.message ?? err?.message ?? "An error occurred";
        tokenExpireError(message);
      }
    })();
  }, [profile]);

  useEffect(() => {
    if (!AuthProfile || refresh) {
      getProfile();
    } else {
      setProfile(() => AuthProfile);
    }
  }, [AuthProfile, refresh]);

  return {
    profile,
    getProfile,
    refresh,
    setRefresh
  };
};

export default useProfile;
