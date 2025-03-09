export interface UserDetails {
  firstName: string | null;
  lastName: string | null;
  photo: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: number | null;
  userDetails: UserDetails;
  token: string | null;
  role: string | null;
  sessionExpired: boolean | null;
  profile?: Record<string, any>;
}

export type AuthAction =
  | {
      type: "LOGIN";
      payload: {
        user_id: string;
        token: string;
        role: string;
        first_name?: string;
        last_name?: string;
        photo?: string;
      };
    }
  | { type: "UPDATE_PROFILE"; payload: Record<string, any> }
  | { type: "LOGOUT" }
  | { type: "SESSION_EXPIRED"; payload: boolean };

export interface AuthContextType {
  dispatch: React.Dispatch<AuthAction>;
  state: AuthState;
}
