import {
  ColumnDataState,
  FilterState,
  PaginationState,
  ModalState
} from "@/interfaces";
import { TreeSDKOptions } from "@/utils/TreeSDK";

export interface TableProperty {
  paginationState?: PaginationState;
  columnState?: ColumnDataState;
  filterState?: FilterState;
  modalState?: ModalState;
  queryOptions?: TreeSDKOptions;
  reload?: boolean;
}

export interface TableState extends Record<string, TableProperty> {}

export interface TablePropertyAction {
  type: "SET_TABLE_PROPERTY";
  property: keyof TableState;
  payload: TableProperty;
}

export type TableAction = TablePropertyAction;

export interface TableContextType {
  state: TableState;
  dispatch: React.Dispatch<TableAction>;
}
