import React, { useReducer } from "react";
import {
  GlobalState,
  GlobalAction,
  GlobalContextType,
  ToastStatus,
} from "./types";
import {
  REQUEST_FAILED,
  REQUEST_LOADING,
  REQUEST_SUCCESS,
  SET_GLOBAL_PROPERTY,
} from "./GlobalConstants";

/**
 * The Value of the Global State .
 * @param {GlobalState} initialState
 */

const initialState: GlobalState = {
  globalMessage: "",
  toastStatus: "success",
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
};

export const GlobalContext = React.createContext<GlobalContextType>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: GlobalState, action: GlobalAction): GlobalState => {
  switch (action.type) {
    case "SNACKBAR":
      return {
        ...state,
        globalMessage: action.payload.message,
        toastStatus: action.payload.toastStatus ?? state.toastStatus,
      };
    case "SETPATH":
      return {
        ...state,
        path: action.payload.path,
      };
    case "OPEN_SIDEBAR":
      return {
        ...state,
        isOpen: action.payload.isOpen,
      };
    case "SHOW_BACKBUTTON":
      return {
        ...state,
        showBackButton: action.payload.showBackButton,
      };
    case "SET_PROJECT_ROW":
      return {
        ...state,
        projectRow: action.payload,
      };
    case "SET_LEFT_PANEL":
      return {
        ...state,
        leftPanel: action.payload,
      };
    case "SET_MIDDLE_PANEL":
      return {
        ...state,
        middlePanel: action.payload,
      };
    case "SET_RIGHT_PANEL":
      return {
        ...state,
        rightPanel: action.payload,
        rightComponentId: action.rightComponentId,
      };
    case "SET_SELECTED_COMPONENT":
      return {
        ...state,
        selectedComponent: action.payload,
      };
    case "SET_SELECTED_PAGE_COMPONENT":
      return {
        ...state,
        selectedPageComponent: action.payload,
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
          rooms: updatedRooms,
        };
      } else {
        return {
          ...state,
          rooms: [...state.rooms, action.payload],
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
            [field]: action.payload,
          },
        };
      }
      return {
        ...state,
        [action.property]: action.payload,
      };
    case REQUEST_LOADING:
      const loadingState = state[action.item as keyof GlobalState];
      return {
        ...state,
        [action.item]: {
          ...(typeof loadingState === "object" && loadingState !== null
            ? loadingState
            : {}),
          loading: action.payload,
        },
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
          loading: false,
        },
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
          loading: false,
        },
      };
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
  toastStatus: ToastStatus = "success"
): void => {
  dispatch({
    type: "SNACKBAR",
    payload: {
      message,
      toastStatus,
    },
  });

  setTimeout(() => {
    return dispatch({
      type: "SNACKBAR",
      payload: {
        message: "",
        toastStatus: "success",
      },
    });
  }, timeout);
};

export const setGlobalProjectRow = (
  dispatch: React.Dispatch<GlobalAction>,
  data: any
): void => {
  dispatch({
    type: "SET_PROJECT_ROW",
    payload: data,
  });
};

interface GlobalProviderProps {
  children: React.ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
