import { useCallback, useContext } from "react";
import {
  AuthContext,
  tokenExpireError as tokenExpiredError,
  AuthState,
  AuthContextType,
  AuthAction
} from "@/context/Auth";

import {
  GlobalContext,
  showToast as toast,
  getSingleModel,
  getList,
  getManyByIds,
  updateRequest,
  createRequest,
  deleteRequest,
  customRequest,
  setGLobalProperty,
  GlobalState,
  GlobalContextType,
  GlobalAction,
  getMany as getManyByFilter,
  GetListOptions,
  GetSingleModelOptions,
  GetManyByIdsOptions,
  UpdateRequestOptions,
  CreateRequestOptions,
  DeleteRequestOptions,
  CustomRequestOptions,
  GetManyOptions,
  setLoading as setLoadingGlobal
} from "@/context/Global";
import { ToastStatusEnum } from "@/utils/Enums";
import { Settings } from "@/context/Global/types";
import { Model, Role } from "@/context/Global/types";
import { Route } from "@/context/Global/types";
import {
  setTableProperty,
  TableAction,
  TableContext,
  TableContextType,
  TableState
} from "@/context/Table";

interface ApiResponse<T = any> {
  error: boolean;
  data?: T;
  message?: string;
}

interface UseContextsResult {
  globalState: GlobalState;
  authState: AuthState;
  tableState: TableState;
  authDispatch: React.Dispatch<AuthAction>;
  tableDispatch: React.Dispatch<TableAction>;
  globalDispatch: React.Dispatch<GlobalAction>;
  showToast: (
    message: string,
    duration?: number,
    status?: ToastStatusEnum
  ) => void;
  setLoading: (state: string, data: any, where?: string) => void;
  setGlobalState: (state: string, value: any) => void;
  setTableState: (state: string, value: any) => void;
  tokenExpireError: (message: string) => void;
  getMany: (table: string, options: GetListOptions) => Promise<ApiResponse>;
  getListByFilter: (
    table: string,
    options: GetManyOptions
  ) => Promise<ApiResponse>;
  getManyByIds: (
    table: string,
    ids: (string | number)[],
    options: GetManyByIdsOptions
  ) => Promise<ApiResponse>;
  getSingle: (
    table: string,
    id: string | number,
    options: GetSingleModelOptions
  ) => Promise<ApiResponse>;
  update: (
    table: string,
    id: string | number,
    data: Record<string, any>,
    options: UpdateRequestOptions
  ) => Promise<ApiResponse>;
  create: (
    table: string,
    data: Record<string, any>,
    options: CreateRequestOptions
  ) => Promise<ApiResponse>;
  remove: (
    table: string,
    id: string | number,
    options: DeleteRequestOptions
  ) => Promise<ApiResponse>;
  custom: (options: CustomRequestOptions) => Promise<ApiResponse>;
  projectConfig: {
    updateSettings: (settings: Settings) => void;
    setDefaultTablesShown: (shown: boolean) => void;
    updateNode: (nodeId: string, newData: any) => void;
    updateModels: (models: Model[]) => void;
    updateRoles: (roles: Role[]) => void;
    updateRoutes: (routes: Route[]) => void;
  };
}

const useContexts = (): UseContextsResult => {
  const {
    state: globalState,
    dispatch: globalDispatch,
    updateSettings,
    setDefaultTablesShown,
    updateNode,
    updateModels,
    updateRoles,
    updateRoutes
  } = useContext<GlobalContextType>(GlobalContext);
  const { state: authState, dispatch: authDispatch } =
    useContext<AuthContextType>(AuthContext);
  const { state: tableState, dispatch: tableDispatch } =
    useContext<TableContextType>(TableContext);

  const showToast = useCallback(
    (
      message: string,
      duration = 5000,
      status: ToastStatusEnum = ToastStatusEnum.SUCCESS
    ) => {
      toast(globalDispatch, message, duration, status);
    },
    [globalDispatch]
  );

  const setGlobalState = useCallback(
    (state: string, value: any) => {
      setGLobalProperty(globalDispatch, value, state);
    },
    [globalDispatch]
  );

  const setTableState = useCallback(
    (state: string, value: any) => {
      setTableProperty(tableDispatch, value, state);
    },
    [tableDispatch]
  );

  const setLoading = useCallback(
    (state: string, data: any, where?: string) => {
      setLoadingGlobal(globalDispatch, data, state, where);
    },
    [globalDispatch]
  );

  const tokenExpireError = useCallback(
    (message: string) => {
      tokenExpiredError(authDispatch, message);
    },
    [authDispatch]
  );

  const getMany = useCallback(
    async (table: string, options: GetListOptions): Promise<ApiResponse> => {
      return await getList(globalDispatch, authDispatch, table, options);
    },
    [globalDispatch, authDispatch]
  );

  const getListByFilter = useCallback(
    async (table: string, options: GetManyOptions): Promise<ApiResponse> => {
      return await getManyByFilter(
        globalDispatch,
        authDispatch,
        table,
        options
      );
    },
    [globalDispatch, authDispatch]
  );

  const getManyById = useCallback(
    async (
      table: string,
      ids: Array<string | number>,
      options: GetManyByIdsOptions
    ): Promise<ApiResponse> => {
      return await getManyByIds(
        globalDispatch,
        authDispatch,
        table,
        ids,
        options
      );
    },
    [globalDispatch, authDispatch]
  );

  const getSingle = useCallback(
    async (
      table: string,
      id: string | number,
      options: GetSingleModelOptions
    ): Promise<ApiResponse> => {
      return await getSingleModel(
        globalDispatch,
        authDispatch,
        table,
        id,
        options
      );
    },
    [globalDispatch, authDispatch]
  );

  const update = useCallback(
    async (
      table: string,
      id: string | number,
      data: Record<string, any>,
      options: UpdateRequestOptions
    ): Promise<ApiResponse> => {
      return await updateRequest(
        globalDispatch,
        authDispatch,
        table,
        id,
        data,
        options
      );
    },
    [globalDispatch, authDispatch]
  );

  const create = useCallback(
    async (
      table: string,
      data: Record<string, any>,
      options: CreateRequestOptions
    ): Promise<ApiResponse> => {
      return await createRequest(
        globalDispatch,
        authDispatch,
        table,
        data,
        options
      );
    },
    [globalDispatch, authDispatch]
  );

  const remove = useCallback(
    async (
      table: string,
      id: string | number,
      options: DeleteRequestOptions
    ): Promise<ApiResponse> => {
      return await deleteRequest(
        globalDispatch,
        authDispatch,
        table,
        id,
        {},
        options
      );
    },
    [globalDispatch, authDispatch]
  );

  const custom = useCallback(
    async (options: CustomRequestOptions): Promise<ApiResponse> => {
      return await customRequest(globalDispatch, authDispatch, options);
    },
    [globalDispatch, authDispatch]
  );

  return {
    globalState,
    authState,
    tableState,
    globalDispatch,
    authDispatch,
    tableDispatch,
    showToast,
    setGlobalState,
    tokenExpireError,
    getMany,
    getListByFilter,
    getManyByIds: getManyById,
    getSingle,
    update,
    create,
    remove,
    custom,
    setLoading,
    setTableState,
    projectConfig: {
      updateSettings: updateSettings || (() => {}),
      setDefaultTablesShown: setDefaultTablesShown || (() => {}),
      updateNode: updateNode || (() => {}),
      updateModels: updateModels || (() => {}),
      updateRoles: updateRoles || (() => {}),
      updateRoutes: updateRoutes || (() => {})
    }
  };
};

export default useContexts;
