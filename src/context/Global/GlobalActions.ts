import { Dispatch } from "react";
import { tokenExpireError } from "@/context/Auth";
import TreeSDK from "@/utils/TreeSDK";
import MkdSDK from "@/utils/MkdSDK";
import { ApiError, GlobalAction } from "./types";

import {
  REQUEST_FAILED,
  REQUEST_LOADING,
  REQUEST_SUCCESS,
  RequestItems,
  SET_GLOBAL_PROPERTY
} from "./GlobalConstants";
import { showToast } from "./GlobalContext";
import { RestAPIMethod } from "@/utils/types/types";
import { RestAPIMethodEnum } from "@/utils/Enums";

export const setGLobalProperty = (
  dispatch: Dispatch<GlobalAction>,
  data: any,
  property: string
): void => {
  dispatch({
    property,
    type: SET_GLOBAL_PROPERTY,
    payload: data
  });
};

export function setLoading(
  dispatch: Dispatch<GlobalAction>,
  data: boolean,
  item: string,
  _where?: string
): void {
  dispatch({
    item,
    type: REQUEST_LOADING,
    payload: data
  });
}

export const dataSuccess = (
  dispatch: Dispatch<GlobalAction>,
  data: any,
  item: string
): void => {
  dispatch({
    item,
    type: REQUEST_SUCCESS,
    payload: data
  });
};

export const dataFailure = (
  dispatch: Dispatch<GlobalAction>,
  data: any,
  item: string
): void => {
  dispatch({
    item,
    type: REQUEST_FAILED,
    payload: data
  });
};

export interface ReadImageUrlResult {
  error: boolean;
  data?: string;
  imageBlob?: Blob;
  message?: string;
}

export const readImageUrl = (
  url: string,
  cb: (result: ReadImageUrlResult) => void
): void => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "arraybuffer";

  xhr.onload = function () {
    if (![401, 402, 403, 404, 500, 502, 501].includes(xhr.status)) {
      const arrayBuffer = xhr.response;
      const blob = new Blob([arrayBuffer], { type: "image/png" });
      const reader = new FileReader();
      reader.onloadend = function () {
        cb({ error: false, data: reader.result as string, imageBlob: blob });
      };
      reader.readAsDataURL(blob);
    } else {
      const errorMessage = `Request failed. Status: ${xhr.status}`;
      console.error(errorMessage);
      cb({ error: true, message: errorMessage });
    }
  };

  xhr.onerror = function () {
    const errorMessage = "An error occurred during the request.";
    console.error(errorMessage);
  };

  xhr.send();
};

export interface GetSingleModelOptions {
  method?: RestAPIMethod;
  join?: string | null;
  allowToast?: boolean;
  state?: string;
  isPublic?: boolean;
}

export interface GetSingleModelResult {
  error: boolean;
  data?: any;
  message: string;
}

export const getSingleModel = async (
  globalDispatch: Dispatch<GlobalAction>,
  authDispatch: Dispatch<any>,
  table: string,
  id: number | string,
  options: GetSingleModelOptions = {
    method: "GET",
    join: null,
    allowToast: true,
    state: RequestItems?.viewModel,
    isPublic: false
  }
): Promise<GetSingleModelResult> => {
  const sdk = new MkdSDK();
  const state = options?.state ?? RequestItems.viewModel;
  const method = options?.method ?? "GET";
  setLoading(globalDispatch, true, state);
  try {
    sdk.setTable(table.trim());
    const result = await sdk.callRestAPI(
      {
        id: Number(id),
        ...{ ...(options?.join ? { join: options?.join } : null) }
      },
      method
    );

    if (!result?.error) {
      dataSuccess(globalDispatch, { data: result?.model }, state);
    }
    setLoading(globalDispatch, false, state);
    return {
      error: false,
      data: result?.model,
      message: result?.message ?? "Success"
    };
  } catch (error: unknown) {
    const err = error as ApiError;
    const message =
      err?.response?.data?.message ?? err?.message ?? "An error occurred";
    setLoading(globalDispatch, false, state);
    dataFailure(globalDispatch, { message, id }, state);
    if (options?.allowToast) {
      showToast(globalDispatch, message, 4000, "error");
    }
    if (!options?.isPublic) {
      tokenExpireError(authDispatch, message);
    }
    return { error: true, message };
  }
};

export interface GetManyOptions {
  filter?: string[];
  join?: string | null;
  allowToast?: boolean;
}

export interface GetManyResult {
  error: boolean;
  data?: any[];
  message?: string;
}

export const getMany = async (
  globalDispatch: Dispatch<GlobalAction>,
  authDispatch: Dispatch<any>,
  table: string,
  options: GetManyOptions = {
    filter: [],
    join: null,
    allowToast: true
  }
): Promise<GetManyResult> => {
  const tdk = new TreeSDK();
  setLoading(globalDispatch, true, RequestItems?.listModel);
  try {
    const result = await tdk.getList(table, {
      ...{
        ...(options?.join ? { join: options?.join } : null),
        ...(options?.filter && options?.filter?.length
          ? { filter: options?.filter }
          : null)
      }
    });

    if (!result?.error) {
      dataSuccess(
        globalDispatch,
        { data: result?.list },
        RequestItems?.listModel
      );
    }
    setLoading(globalDispatch, false, RequestItems?.listModel);
    return { error: false, data: result?.list };
  } catch (error: unknown) {
    const err = error as ApiError;
    const message =
      err?.response?.data?.message ?? err?.message ?? "An error occurred";
    setLoading(globalDispatch, false, RequestItems?.listModel);
    dataFailure(globalDispatch, { message }, RequestItems?.listModel);
    if (options?.allowToast) {
      showToast(globalDispatch, message, 4000, "error");
    }
    tokenExpireError(authDispatch, message);
    return { error: true, message };
  }
};

export interface GetManyByIdsResult {
  error: boolean;
  data?: any[];
  message?: string;
}

export interface GetManyByIdsOptions {
  join?: string | string[] | null;
  allowToast?: boolean;
}

export const getManyByIds = async (
  globalDispatch: Dispatch<GlobalAction>,
  authDispatch: Dispatch<any>,
  table: string,
  ids: (number | string)[],
  options: GetManyByIdsOptions = {
    allowToast: true,
    join: null
  }
): Promise<GetManyByIdsResult> => {
  const tdk = new TreeSDK();
  setLoading(globalDispatch, true, RequestItems?.listModel);
  try {
    const result = await tdk.getList(table, {
      ...{
        ...(options?.join ? { join: options?.join } : null),
        filter: [`id,in,${ids.join(",")}`]
      }
    });

    if (!result?.error) {
      dataSuccess(
        globalDispatch,
        { data: result?.list },
        RequestItems?.listModel
      );
    }
    setLoading(globalDispatch, false, RequestItems?.listModel);
    return { error: false, data: result?.list };
  } catch (error: unknown) {
    const err = error as ApiError;
    const message =
      err?.response?.data?.message ?? err?.message ?? "An error occurred";
    setLoading(globalDispatch, false, RequestItems?.listModel);
    dataFailure(globalDispatch, { message, ids }, RequestItems?.listModel);
    if (options?.allowToast) {
      showToast(globalDispatch, message, 4000, "error");
    }
    tokenExpireError(authDispatch, message);
    return { error: true, message };
  }
};

export interface CreateRequestResult {
  error: boolean;
  data?: any;
  message?: string;
}

export interface CreateRequestOptions {
  allowToast?: boolean;
}

export const createRequest = async (
  globalDispatch: Dispatch<GlobalAction>,
  authDispatch: Dispatch<any>,
  table: string,
  payload: any,
  options: CreateRequestOptions = {
    allowToast: true
  }
): Promise<CreateRequestResult> => {
  const tdk = new TreeSDK();
  setLoading(globalDispatch, true, RequestItems?.createModel);
  try {
    const result = await tdk.create(table, payload);

    if (!result?.error) {
      dataSuccess(
        globalDispatch,
        { message: result?.message, data: result?.data },
        RequestItems?.createModel
      );
      setLoading(globalDispatch, false, RequestItems?.createModel);
      if (options?.allowToast) {
        showToast(
          globalDispatch,
          result?.message ?? "Success",
          4000,
          "success"
        );
      }
      return { error: false, data: result?.data, message: result?.message };
    } else {
      setLoading(globalDispatch, false, RequestItems?.createModel);
      if (options?.allowToast) {
        showToast(
          globalDispatch,
          result?.message ?? "An error occurred",
          4000,
          "error"
        );
      }
      return { error: true, message: result?.message };
    }
  } catch (error: unknown) {
    const err = error as ApiError;
    const message =
      err?.response?.data?.message ?? err?.message ?? "An error occurred";
    setLoading(globalDispatch, false, RequestItems?.createModel);
    dataFailure(globalDispatch, { message }, RequestItems?.createModel);
    if (options?.allowToast) {
      showToast(globalDispatch, message, 4000, "error");
    }
    tokenExpireError(authDispatch, message);
    return { error: true, message };
  }
};

export interface UpdateRequestResult {
  error: boolean;
  message?: string;
}

export interface UpdateRequestOptions {
  allowToast?: boolean;
}

export const updateRequest = async (
  globalDispatch: Dispatch<GlobalAction>,
  authDispatch: Dispatch<any>,
  table: string,
  id: number | string,
  payload: any,
  options: UpdateRequestOptions = {
    allowToast: true
  }
): Promise<UpdateRequestResult> => {
  const tdk = new TreeSDK();
  setLoading(globalDispatch, true, RequestItems?.updateModel);
  try {
    const result = await tdk.update(table, id, payload);

    if (!result?.error) {
      setLoading(globalDispatch, false, RequestItems?.updateModel);
      if (options?.allowToast) {
        showToast(
          globalDispatch,
          result?.message ?? "Success",
          4000,
          "success"
        );
      }
      return { error: false };
    } else {
      setLoading(globalDispatch, false, RequestItems?.updateModel);
      if (options?.allowToast) {
        showToast(
          globalDispatch,
          result?.message ?? "An error occurred",
          4000,
          "error"
        );
      }
      return { error: true };
    }
  } catch (error: unknown) {
    const err = error as ApiError;
    const message =
      err?.response?.data?.message ?? err?.message ?? "An error occurred";
    setLoading(globalDispatch, false, RequestItems?.updateModel);
    dataFailure(globalDispatch, { message }, RequestItems?.updateModel);
    if (options?.allowToast) {
      showToast(globalDispatch, message, 4000, "error");
    }
    tokenExpireError(authDispatch, message);
    return { error: true, message };
  }
};

export interface DeleteRequestResult {
  error: boolean;
  data?: any;
  message?: string;
}

export interface DeleteRequestOptions {
  allowToast?: boolean;
}

export const deleteRequest = async (
  globalDispatch: Dispatch<GlobalAction>,
  authDispatch: Dispatch<any>,
  table: string,
  id: number | string,
  payload: any,
  options: DeleteRequestOptions = {
    allowToast: true
  }
): Promise<DeleteRequestResult> => {
  const tdk = new TreeSDK();
  setLoading(globalDispatch, true, RequestItems?.deleteModel);
  try {
    const result = await tdk.delete(table, id, payload);

    if (!result?.error) {
      dataSuccess(
        globalDispatch,
        { message: result?.message },
        RequestItems?.deleteModel
      );
      setLoading(globalDispatch, false, RequestItems?.deleteModel);
      if (options?.allowToast) {
        showToast(
          globalDispatch,
          result?.message ?? "Success",
          4000,
          "success"
        );
      }
      return { error: false, data: result?.data };
    } else {
      setLoading(globalDispatch, false, RequestItems?.deleteModel);
      if (options?.allowToast) {
        showToast(
          globalDispatch,
          result?.message ?? "An error occurred",
          4000,
          "error"
        );
      }
      return { error: true };
    }
  } catch (error: unknown) {
    const err = error as ApiError;
    const message =
      err?.response?.data?.message ?? err?.message ?? "An error occurred";
    setLoading(globalDispatch, false, RequestItems?.deleteModel);
    dataFailure(globalDispatch, { message }, RequestItems?.deleteModel);
    if (options?.allowToast) {
      showToast(globalDispatch, message, 4000, "error");
    }
    tokenExpireError(authDispatch, message);
    return { error: true, message };
  }
};

export interface GetListOptions {
  filter?: string[];
  join?: string[];
  size?: number;
  order?: string;
  direction?: "desc" | "asc";
}

export interface GetListResult {
  error: boolean;
  data?: any[];
  message?: string;
}

export const getList = async (
  globalDispatch: Dispatch<GlobalAction>,
  authDispatch: Dispatch<any>,
  table: string,
  options: GetListOptions,
  state: string | undefined = undefined
): Promise<GetListResult> => {
  const tdk = new TreeSDK();
  setLoading(globalDispatch, true, state ?? table);
  try {
    const result = await tdk.getList(table, {
      ...options
    });

    if (!result?.error) {
      dataSuccess(
        globalDispatch,
        { message: result?.message, data: result?.list },
        state ?? table
      );
      setLoading(globalDispatch, false, state ?? table);
      return { error: false, data: result?.list };
    } else {
      setLoading(globalDispatch, false, state ?? table);
      return result;
    }
  } catch (error: unknown) {
    const err = error as ApiError;
    const message =
      err?.response?.data?.message ?? err?.message ?? "An error occurred";
    setLoading(globalDispatch, false, state ?? table);
    dataFailure(globalDispatch, { message }, state ?? table);
    tokenExpireError(authDispatch, message);
    return { error: true, message };
  }
};

export interface CustomRequestOptions {
  endpoint: string;
  payload?: any;
  method?: RestAPIMethod | RestAPIMethodEnum;
  signal?: AbortSignal | null | undefined;
  allowToast?: boolean;
}

export interface CustomRequestResult {
  error: boolean;
  data?: any;
  message?: string;
  validation?: any;
}

export const customRequest = async (
  globalDispatch: Dispatch<GlobalAction>,
  authDispatch: Dispatch<any>,
  options: CustomRequestOptions = {
    allowToast: true,
    endpoint: "",
    payload: {},
    method: "GET",
    signal: null
  },
  state: string = RequestItems.customRequest
): Promise<CustomRequestResult> => {
  if (!options.endpoint) {
    showToast(
      globalDispatch,
      "options.endpoint is a required field",
      4000,
      "error"
    );
    return { error: true };
  }
  const sdk = new MkdSDK();
  setLoading(globalDispatch, true, state);
  try {
    const result = await sdk.request({
      endpoint: options?.endpoint,
      method: options?.method,
      body: options?.payload,
      signal: options?.signal
    });

    if (!result?.error) {
      dataSuccess(
        globalDispatch,
        { message: result?.message, data: result?.data, error: false },
        state
      );
      setLoading(globalDispatch, false, state);
      if (options?.allowToast) {
        showToast(
          globalDispatch,
          result?.message ?? "Success",
          4000,
          "success"
        );
      }
      return {
        ...result,
        error: false,
        data: result?.data || result?.model || result?.list,
        message: result?.message
      };
    } else {
      setLoading(globalDispatch, false, state);
      if (options?.allowToast) {
        showToast(
          globalDispatch,
          result?.message ?? "An Error Occurred",
          4000,
          "error"
        );
      }
      return {
        ...result,
        error: true,
        validation: result?.validation,
        message: result?.message
      };
    }
  } catch (error: unknown) {
    const err = error as ApiError;
    const message =
      err?.response?.data?.message ?? err?.message ?? "An error occurred";
    setLoading(globalDispatch, false, state);
    dataFailure(globalDispatch, { message, error: true }, state);
    if (options?.allowToast) {
      showToast(globalDispatch, message, 4000, "error");
    }
    console.log("error?.response >>", err?.response);
    tokenExpireError(authDispatch, message);
    return { error: true, message };
  }
};

export function computeFilter(
  field: string,
  operator: string,
  value: string | number
): string {
  return `${field},${operator},${value}`;
}
