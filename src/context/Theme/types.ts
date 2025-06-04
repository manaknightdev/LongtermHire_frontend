import { Theme } from "@/utils/Enums";
import { Dispatch } from "react";

export type ThemeType = Theme.LIGHT | Theme.DARK;

export interface ThemeState {
  theme: Theme;
}

export type ThemeAction =
  | { type: "SET_THEME"; payload: ThemeType }
  | { type: "TOGGLE_THEME" };

export interface ThemeContextType {
  state: ThemeState;
  dispatch: Dispatch<ThemeAction>;
}
