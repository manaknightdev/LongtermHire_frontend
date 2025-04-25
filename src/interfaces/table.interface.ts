import { ReactNode } from "react";
import { operations } from "@/utils/config";
import { ActionLocations } from "@/utils/Enums";

export interface ExternalData {
  page?: number;
  data?: any[];
  limit?: number;
  pages?: number;
  total?: number;
  use?: boolean;
  loading?: boolean;
  isFilter?: boolean;
  canNextPage?: boolean;
  canPreviousPage?: boolean;

  // fetch?: (page: number | any, limit: number | any, filter?: any) => void;
  // search?: (
  //   search: string,
  //   columns?: any,
  //   searchFilter?: any,
  //   query?: any
  // ) => void;
}
export interface Column {
  isFilter?: boolean;
  header: string;
  accessor: string;
  isSorted: boolean;
  selected_column: boolean;
  isSortedDesc: boolean;
  mappingExist?: boolean;
  mappings?: { [key: string | number]: any };
  join?: string;
  list?: string;
  listType?: string;
  searchable?: boolean;
  filter_field?: string;
}

export interface ColumnDataState {
  views?: any[] | undefined;
  data?: any | null | undefined;
  columns?: Column[] | undefined;
  columnId?: number | undefined;
  columnsReady?: boolean | undefined;
  order?: string | undefined;
  direction?: "asc" | "desc" | string | undefined;
}
export interface PaginationState {
  pageSize?: number;
  pageCount?: number;
  currentPage?: number;
  dataTotal?: number;
  canPreviousPage?: boolean;
  canNextPage?: boolean;
}

export interface FilterState {
  selectedOptions?: any[];
  filterConditions?: any[];
  selectedItems?: any[];
  runFilter?: boolean;
  enabled?: boolean;
}

export interface ModalState {
  showDeleteModal?: boolean;
  deleteLoading?: boolean;
  popoverShown?: boolean;
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
