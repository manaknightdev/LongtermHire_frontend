import { useContext } from "react";
import {
  ThemeContext,
  ThemeContextType,
  SET_THEME,
  TOGGLE_THEME,
} from "@/context/Theme";

interface UseTheme {
  state: ThemeContextType["state"];
  dispatch: ThemeContextType["dispatch"];
  SET_THEME: typeof SET_THEME;
  TOGGLE_THEME: typeof TOGGLE_THEME;
}

const useTheme = (): UseTheme => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return {
    state: context.state,
    dispatch: context.dispatch,
    SET_THEME,
    TOGGLE_THEME,
  };
};

export default useTheme;
