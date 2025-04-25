import { Dispatch } from "react";
import { TableAction, TableProperty } from "./types";

import { SET_TABLE_PROPERTY } from "./TableConstants";

export const setTableProperty = (
  dispatch: Dispatch<TableAction>,
  data: TableProperty,
  property: string
): void => {
  dispatch({
    property,
    type: SET_TABLE_PROPERTY,
    payload: data
  });
};
