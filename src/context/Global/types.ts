import { Edge, Node } from "reactflow";

export type ToastStatus = "success" | "error" | "warning" | "info";

export interface Room extends Record<string, any> {
  position: number;
  id: string;
  name: string;
  description?: string;
  properties: Record<string, unknown>;
}

export interface PanelItem {
  id: string;
  type: string;
  label: string;
  properties: Record<string, unknown>;
}

export interface Model {
  id: string;
  name: string;
  fields: {
    name: string;
    type: string;
    defaultValue: string;
    validation: string;
    mapping?: string;
  }[];
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  permissions: {
    routes: string[];
    canCreateUsers?: boolean;
    canEditUsers?: boolean;
    canDeleteUsers?: boolean;
    canManageRoles?: boolean;
    canUpdateOtherUsers: boolean;
  };
}

export interface Route {
  id: string;
  name: string;
  method: string;
  url: string;
  flowData?: {
    nodes: any[];
    edges: any[];
  };
}

export interface Settings {
  id: string;
  globalKey: string;
  databaseType: string;
  authType: string;
  timezone: string;
  dbHost: string;
  dbPort: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  isPWA: boolean;
  isMultiTenant: boolean;
  model_namespace: string;
  payment_option: string;
}

export interface FlowState {
  nodes?: Node[];
  edges?: Edge[];
  selectedNode?: Node | null;
  models?: Model[];
  roles?: Role[];
  routes?: Route[];
  activeRoute?: Route | null;
  settings?: Settings;
  defaultTablesShown?: boolean;
}

export interface GlobalState extends FlowState, Record<string, any> {
  globalMessage: string;
  toastStatus: ToastStatus;
  isOpen: boolean;
  showBackButton: boolean;
  path: string;
  sessionExpired: boolean;
  projectRow: Record<string, unknown> | null;
  leftPanel: PanelItem[];
  middlePanel: PanelItem[];
  rightPanel: Record<string, unknown>;
  selectedComponent: number;
  rightComponentId: string;
  selectedPageComponent: number;
  openRouteChangeModal: boolean;
  rooms: Room[];
}

export interface RequestAction {
  item: string;
  type: "REQUEST_LOADING" | "REQUEST_SUCCESS" | "REQUEST_FAILED";
  payload: unknown;
}

export interface GlobalPropertyAction {
  type: "SET_GLOBAL_PROPERTY";
  property: keyof GlobalState;
  payload: unknown;
}

export type GlobalAction =
  | { type: "SNACKBAR"; payload: { message: string; toastStatus: ToastStatus } }
  | { type: "SETPATH"; payload: { path: string } }
  | { type: "OPEN_SIDEBAR"; payload: { isOpen: boolean } }
  | { type: "SHOW_BACKBUTTON"; payload: { showBackButton: boolean } }
  | { type: "SET_PROJECT_ROW"; payload: Record<string, unknown> | null }
  | { type: "SET_LEFT_PANEL"; payload: PanelItem[] }
  | { type: "SET_MIDDLE_PANEL"; payload: PanelItem[] }
  | {
      type: "SET_RIGHT_PANEL";
      payload: Record<string, unknown>;
      rightComponentId: string;
    }
  | { type: "SET_SELECTED_COMPONENT"; payload: number }
  | { type: "SET_SELECTED_PAGE_COMPONENT"; payload: number }
  | { type: "SETROOM"; payload: Room }
  | { type: "UPDATEROOM"; payload: Room }
  | { type: "DELETEROOM"; payload: { position: number } }
  | { type: "SETROOM"; payload: any }
  | { type: "UPDATE_SETTINGS"; payload: Settings }
  | { type: "SET_DEFAULT_TABLES_SHOWN"; payload: boolean }
  | { type: "UPDATE_NODE"; payload: { id: string; data: any } }
  | { type: "UPDATE_MODELS"; payload: Model[] }
  | { type: "UPDATE_ROLES"; payload: Role[] }
  | { type: "UPDATE_ROUTES"; payload: Route[] }
  | RequestAction
  | GlobalPropertyAction;

export interface GlobalContextType {
  state: GlobalState;
  dispatch: React.Dispatch<GlobalAction>;
  updateSettings?: (settings: Settings) => void;
  setDefaultTablesShown?: (shown: boolean) => void;
  updateNode?: (nodeId: string, newData: any) => void;
  updateModels?: (models: Model[]) => void;
  updateRoles?: (roles: Role[]) => void;
  updateRoutes?: (routes: Route[]) => void;
}

export interface ApiErrorResponse {
  message?: string;
  data?: {
    message?: string;
  };
}

export class ApiError extends Error {
  response?: ApiErrorResponse;
  data?: ApiErrorResponse;

  constructor(message?: string) {
    super(message);
    this.name = "ApiError";
  }
}
