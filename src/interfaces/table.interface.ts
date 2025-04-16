import { ReactNode } from "react";
import { operations } from "@/utils/config";
import { ActionLocations } from "@/utils/Enums";

export interface ColumnDataState {
  views: any[] | undefined;
  data: any | null | undefined;
  columns: any[] | undefined;
  columnId: number | undefined;
  columnsReady: boolean | undefined;
  order: string | undefined;
  direction: string | undefined;
}

export interface ActionBindType {
  column: Array<string>;
  action: "hide" | "disable";
  operator: keyof typeof operations | Array<keyof typeof operations>;
  logic?: "or" | "and";
  ifValue: string | number | null | any | Array<number | string | null | any>;
}

export interface Action {
  show: boolean;
  multiple?: boolean;
  max?: number;
  action?: null | ((selections: Array<number> | any) => void);
  bind?: ActionBindType;
  multipleFrom?: number;
  type?: string;
  children?: ReactNode | any;
  showChildren?: boolean;
  className?: string;
  locations: Array<
    | ActionLocations.DROPDOWN
    | ActionLocations.ONTOP
    | ActionLocations.OVERLAY
    | ActionLocations.BUTTONS
    | ActionLocations.TABLE
  >;
  icon?: ReactNode | any;
  [key: string]: any; // allow for additional properties
}
