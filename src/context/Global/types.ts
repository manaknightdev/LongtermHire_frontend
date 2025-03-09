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

export interface GlobalState extends Record<string, any> {
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
  | RequestAction
  | GlobalPropertyAction;

export interface GlobalContextType {
  state: GlobalState;
  dispatch: React.Dispatch<GlobalAction>;
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
