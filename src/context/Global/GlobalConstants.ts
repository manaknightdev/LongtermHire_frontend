export const REQUEST_LOADING = "REQUEST_LOADING";
export const REQUEST_SUCCESS = "REQUEST_SUCCESS";
export const REQUEST_FAILED = "REQUEST_FAILED";
export const SET_GLOBAL_PROPERTY = "SET_GLOBAL_PROPERTY";
export const ADD_BACKGROUND_PROCESS = "ADD_BACKGROUND_PROCESS";
export const SET_BACKGROUND_PROCESSES = "SET_BACKGROUND_PROCESSES";
export const REMOVE_BACKGROUND_PROCESS = "REMOVE_BACKGROUND_PROCESS";

interface RequestItemsType {
  readonly viewModel: string;
  readonly createModel: string;
  readonly updateModel: string;
  readonly listModel: string;
  readonly deleteModel: string;
  readonly customRequest: string;
}

const RequestItems: RequestItemsType = {
  viewModel: "viewModel",
  createModel: "createModel",
  updateModel: "updateModel",
  listModel: "listModel",
  deleteModel: "deleteModel",
  customRequest: "customRequest",
} as const

interface ViewsType {
  readonly RouteList: string;
  readonly BasicRouteEditor: string;
  readonly AdvancedRouteEditor: string;
}

const Views: ViewsType = {
  RouteList: "routelist",
  BasicRouteEditor: "basicrouteeditor",
  AdvancedRouteEditor: "advancedrouteeditor",
} as const

interface ViewsMapType {
  readonly RouteList: string;
  readonly RouteEditor: string;
}

const ViewsMap: ViewsMapType = {
  RouteList: "Route List",
  RouteEditor: "Route Editor",
} as const


const BackgroundProcessStatus = {
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  FULFILLED: "FULFILLED",
} as const

export { RequestItems, Views, ViewsMap,BackgroundProcessStatus };
