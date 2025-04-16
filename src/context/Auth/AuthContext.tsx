import React, { useReducer, useEffect } from "react";
import { AuthState, AuthAction, AuthContextType, UserDetails } from "./types";
import { updatedRolesFn } from "@/utils/utils";
import { useSDK } from "@/hooks/useSDK";
import { RoleEnum } from "@/utils/Enums";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  userDetails: {
    firstName: null,
    lastName: null,
    photo: null
  },
  token: null,
  role: null,
  sessionExpired: null
};

export const AuthContext = React.createContext<AuthContextType>({
  ...initialState,
  dispatch: () => null,
  state: initialState
});

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN": {
      const { user_id, token, role, first_name, last_name, photo } =
        action.payload;
      localStorage.setItem("user", user_id);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      const userDetails: UserDetails = {
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        photo: photo ?? null
      };

      return {
        ...state,
        isAuthenticated: true,
        user: Number(user_id),
        token,
        role,
        userDetails
      };
    }
    case "UPDATE_PROFILE":
      return {
        ...state,
        role: localStorage.getItem("role"),
        profile: action.payload
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return {
        ...initialState
      };
    case "SESSION_EXPIRED":
      return {
        ...state,
        sessionExpired: action.payload
      };
    default:
      return state;
  }
};

export const tokenExpireError = (
  dispatch: React.Dispatch<AuthAction>,
  errorMessage: string
): void => {
  // const _role = localStorage.getItem("role") as RoleEnum;
  if (errorMessage === "TOKEN_EXPIRED") {
    dispatch({ type: "SESSION_EXPIRED", payload: true });
  }
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { sdk } = useSDK();

  const [state, dispatch] = useReducer(reducer, initialState);

  const checkToken = async (token: string, user: string, role: RoleEnum) => {
    try {
      const res = await sdk.getProfile();

      if (res.error) {
        throw new Error(res.message);
      }

      dispatch({
        type: "LOGIN",
        payload: {
          user_id: user,
          token,
          role
        }
      });
    } catch (error) {
      dispatch({ type: "LOGOUT" });
      const updatedRole = updatedRolesFn(role, window.location);

      if (updatedRole) {
        window.location.href = `/${updatedRole}/login`;
      } else {
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as RoleEnum;

    if (token && user && role) {
      checkToken(token, user, role as RoleEnum);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
