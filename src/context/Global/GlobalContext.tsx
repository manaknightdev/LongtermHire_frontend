import React, { useReducer } from "react";
import {
  GlobalState,
  GlobalAction,
  GlobalContextType,
  ToastStatus,
  Model,
  Route,
  Role,
  Settings
} from "./types";
import {
  REQUEST_FAILED,
  REQUEST_LOADING,
  REQUEST_SUCCESS,
  SET_GLOBAL_PROPERTY
} from "./GlobalConstants";
import { ToastStatusEnum } from "@/utils/Enums";
import { Node } from "reactflow";
/**
 * The Value of the Global State .
 * @param {GlobalState} initialState
 */

const initialState: GlobalState = {
  globalMessage: "",
  toastStatus: ToastStatusEnum.SUCCESS,
  isOpen: true,
  showBackButton: false,
  path: "",
  sessionExpired: false,
  projectRow: null,
  leftPanel: [],
  middlePanel: [],
  rightPanel: {},
  selectedComponent: 0,
  rightComponentId: "",
  selectedPageComponent: 0,
  rooms: [],
  openRouteChangeModal: false,

  // Project Config
  nodes: [],
  edges: [],
  selectedNode: null,
  models: [],
  roles: [],
  routes: [],
  activeRoute: null,
  settings: {
    globalKey: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    databaseType: "mysql",
    authType: "session",
    timezone: "UTC",
    dbHost: "localhost",
    dbPort: "3306", // normal MySQL port
    dbUser: "root",
    dbPassword: "root",
    dbName: `database_${new Date().toISOString().split("T")[0]}`, // today's date
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    isPWA: false,
    isMultiTenant: false,
    model_namespace: "",
    payment_option: "none"
  },
  defaultTablesShown: false
};

export const GlobalContext = React.createContext<GlobalContextType>({
  state: initialState,
  dispatch: () => null
});

const reducer = (state: GlobalState, action: GlobalAction): GlobalState => {
  switch (action.type) {
    case "SNACKBAR":
      return {
        ...state,
        globalMessage: action.payload.message,
        toastStatus: action.payload.toastStatus ?? state.toastStatus
      };
    case "SETPATH":
      return {
        ...state,
        path: action.payload.path
      };
    case "OPEN_SIDEBAR":
      return {
        ...state,
        isOpen: action.payload.isOpen
      };
    case "SHOW_BACKBUTTON":
      return {
        ...state,
        showBackButton: action.payload.showBackButton
      };
    case "SET_PROJECT_ROW":
      return {
        ...state,
        projectRow: action.payload
      };
    case "SET_LEFT_PANEL":
      return {
        ...state,
        leftPanel: action.payload
      };
    case "SET_MIDDLE_PANEL":
      return {
        ...state,
        middlePanel: action.payload
      };
    case "SET_RIGHT_PANEL":
      return {
        ...state,
        rightPanel: action.payload,
        rightComponentId: action.rightComponentId
      };
    case "SET_SELECTED_COMPONENT":
      return {
        ...state,
        selectedComponent: action.payload
      };
    case "SET_SELECTED_PAGE_COMPONENT":
      return {
        ...state,
        selectedPageComponent: action.payload
      };
    case "SETROOM":
      const existingRoomIndex = state.rooms.findIndex(
        (room) => room.position === action.payload.position
      );
      if (existingRoomIndex !== -1) {
        const updatedRooms = [...state.rooms];
        updatedRooms[existingRoomIndex] = action.payload;
        return {
          ...state,
          rooms: updatedRooms
        };
      } else {
        return {
          ...state,
          rooms: [...state.rooms, action.payload]
        };
      }
    case SET_GLOBAL_PROPERTY:
      if (action.property?.toString().includes(".")) {
        const [prop, field] = action.property.toString().split(".");
        const stateValue = state[prop as keyof GlobalState];
        return {
          ...state,
          [prop]: {
            ...(typeof stateValue === "object" && stateValue !== null
              ? stateValue
              : {}),
            [field]: action.payload
          }
        };
      }
      return {
        ...state,
        [action.property]: action.payload
      };
    case REQUEST_LOADING:
      const loadingState = state[action.item as keyof GlobalState];
      return {
        ...state,
        [action.item]: {
          ...(typeof loadingState === "object" && loadingState !== null
            ? loadingState
            : {}),
          loading: action.payload
        }
      };
    case REQUEST_SUCCESS:
      const successState = state[action.item as keyof GlobalState];
      return {
        ...state,
        [action.item]: {
          ...(typeof successState === "object" && successState !== null
            ? successState
            : {}),
          ...(action.payload as object),
          error: false,
          success: true,
          loading: false
        }
      };
    case REQUEST_FAILED:
      const failedState = state[action.item as keyof GlobalState];
      return {
        ...state,
        [action.item]: {
          ...(typeof failedState === "object" && failedState !== null
            ? failedState
            : {}),
          ...(action.payload as object),
          error: true,
          success: false,
          loading: false
        }
      };

    case "UPDATE_SETTINGS":
      return { ...state, settings: action.payload };
    case "SET_DEFAULT_TABLES_SHOWN":
      return { ...state, defaultTablesShown: action.payload };
    case "UPDATE_NODE": {
      // console.log("action", action);
      const selectedNode = {
        ...state?.nodes?.find(
          (node: { id: any }) => node.id === action.payload.id
        ),
        data: {
          ...state?.nodes?.find(
            (node: { id: unknown }) => node.id === action.payload.id
          )?.data,
          ...action.payload.data
        }
      };
      const activeRoute = {
        ...state?.activeRoute,
        flowData: {
          ...state?.activeRoute?.flowData,
          nodes: [...(state?.activeRoute?.flowData?.nodes || []), selectedNode]
        }
      };
      const routes = state?.routes?.map((route: { id: any }) =>
        route.id === activeRoute?.id
          ? {
              ...route,
              ...activeRoute
            }
          : route
      );
      // console.log("activeRoute", activeRoute);
      // console.log("routes", routes);
      return {
        ...state,
        selectedNode: selectedNode as Node,
        activeRoute: activeRoute as Route,
        routes: routes as Route[],
        nodes: state?.nodes?.map((node: { id: any; data: any }) =>
          node.id === action.payload.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...action.payload.data
                }
              }
            : node
        ) as Node[]
      };
    }
    case "UPDATE_MODELS":
      return { ...state, models: action.payload };
    case "UPDATE_ROLES":
      return { ...state, roles: action.payload };
    case "UPDATE_ROUTES":
      return { ...state, routes: action.payload };
    default:
      return state;
  }
};

/**
 * @param {"success"| "error" | "warning"} toastStatus
 * @param {any} dispatch
 * @param {string} message
 * @param {number} timeout
 */

export const showToast = (
  dispatch: React.Dispatch<GlobalAction>,
  message: string,
  timeout: number = 3000,
  toastStatus: ToastStatus = ToastStatusEnum.SUCCESS
): void => {
  dispatch({
    type: "SNACKBAR",
    payload: {
      message,
      toastStatus
    }
  });

  setTimeout(() => {
    return dispatch({
      type: "SNACKBAR",
      payload: {
        message: "",
        toastStatus: ToastStatusEnum.SUCCESS
      }
    });
  }, timeout);
};

export const setGlobalProjectRow = (
  dispatch: React.Dispatch<GlobalAction>,
  data: any
): void => {
  dispatch({
    type: "SET_PROJECT_ROW",
    payload: data
  });
};

interface GlobalProviderProps {
  children: React.ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateSettings = (settings: Settings) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings });
  };

  const setDefaultTablesShown = (shown: boolean) => {
    dispatch({ type: "SET_DEFAULT_TABLES_SHOWN", payload: shown });
  };

  const updateNode = (nodeId: string, newData: any) => {
    dispatch({ type: "UPDATE_NODE", payload: { id: nodeId, data: newData } });
  };

  const updateModels = (models: Model[]) => {
    dispatch({ type: "UPDATE_MODELS", payload: models });
  };

  const updateRoles = (roles: Role[]) => {
    dispatch({ type: "UPDATE_ROLES", payload: roles });
  };

  const updateRoutes = (routes: Route[]) => {
    dispatch({ type: "UPDATE_ROUTES", payload: routes });
  };

  return (
    <GlobalContext.Provider
      value={{
        state,
        dispatch,
        updateSettings,
        setDefaultTablesShown,
        updateNode,
        updateModels,
        updateRoles,
        updateRoutes
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
