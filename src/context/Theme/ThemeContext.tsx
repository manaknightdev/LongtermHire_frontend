import React, { useReducer, useEffect } from "react";
import { ThemeState, ThemeAction, ThemeContextType, ThemeType } from "./types";
import { Theme } from "@/utils/Enums";
import { SET_THEME, TOGGLE_THEME } from "./index";

const initialState: ThemeState = {
  theme: Theme.LIGHT,
};

export const ThemeContext = React.createContext<ThemeContextType>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    case TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
      };
    default:
      return state;
  }
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Apply theme class to document on theme change
  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme") as ThemeType | null;
    const prefersDark = window.matchMedia(
      `(prefers-color-scheme: ${Theme.DARK})`
    ).matches;

    const initialTheme = savedTheme || (prefersDark ? Theme.DARK : Theme.LIGHT);
    dispatch({ type: SET_THEME, payload: initialTheme });
  }, []);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (state.theme === Theme.DARK) {
      document.documentElement.classList.add(Theme.DARK);
    } else {
      document.documentElement.classList.remove(Theme.DARK);
    }

    localStorage.setItem("theme", state.theme);
  }, [state.theme]);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
