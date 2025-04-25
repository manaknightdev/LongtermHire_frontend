import React, { useReducer } from "react";
import { TableState, TableAction, TableContextType } from "./types";
import { SET_TABLE_PROPERTY } from "./TableConstants";

/**
 * The Value of the Table State .
 * @param {TableState} initialState
 */

const initialState: TableState = {};

export const TableContext = React.createContext<TableContextType>({
  state: initialState,
  dispatch: () => null
});

const reducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case SET_TABLE_PROPERTY:
      if (action.property?.toString().includes(".")) {
        const [prop, field] = action.property.toString().split(".");
        const stateValue = state[prop as keyof TableState];
        return {
          ...state,
          [prop]: {
            ...(typeof stateValue === "object" && stateValue !== null
              ? stateValue
              : {}),
            [field]: action.payload
          }
        };
      }
      return {
        ...state,
        [action.property]: action.payload
      };
    default:
      return state;
  }
};

interface TableProviderProps {
  children: React.ReactNode;
}

const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TableContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export default TableProvider;
