export const operations = {
  EQUAL: "eq",
  NOT_EQUAL: "neq",
  CONTAINS: "cs",
  NOT_CONTAINS: "ncs",
  START_WITH: "sw",
  NOT_START_WITH: "nsw",
  END_WITH: "ew",
  NOT_END_WITH: "new",
  LESS_THAN: "lt",
  NOT_LESS_THAN: "nlt",
  GREATER_THAN: "gt",
  BETWEEN: "bt",
  NOT_BETWEEN: "nbt",
  LESS_THAN_OR_EQUAL: "le",
  NOT_LESS_THAN_OR_EQUAL: "nle",
  GREATER_THAN_OR_EQUAL: "ge",
  NOT_GREATER_THAN_OR_EQUAL: "nge",
  NOT_GREATER_THAN: "ngt",
  IS_NULL: "is",
  IS_NOT_NULL: "nis",
  IN: "in",
  NOT_IN: "nin",
};

export const runEqualOperation = (row: any, column: any, value: any) => {
  // return row[column] == value;

  if (Array.isArray(row[column])) {
    return row[column]?.length == value;
  }
  return row[column] == value;
};

export const runNotEqualOperation = (row: any, column: any, value: any) => {
  // return row[column] != value;
  if (Array.isArray(row[column])) {
    return row[column]?.length != value;
  }
  return row[column] != value;
};

export const runContainsOperation = (row: any, column: any, value: any) => {
  return row[column].includes(value);
};

export const runIsNullOperation = (row: any, column: any, _value: any) => {
  return row[column] == null || row[column] == undefined;
};

export const runIsNotNullOperation = (row: any, column: any, _value: any) => {
  return row[column] != null || row[column] != undefined;
};

export const runStartWithOperation = (row: any, column: any, value: any) => {
  return row[column].startsWith(value);
};

export const runEndWithOperation = (row: any, column: any, value: any) => {
  return row[column].endsWith(value);
};

export const runGreaterThanOperation = (row: any, column: any, value: any) => {
  if (Array.isArray(row[column])) {
    return row[column]?.length > value;
  }
  if (["number"].includes(typeof row[column])) {
    return row[column] > value;
  }
  if (["string"].includes(typeof row[column])) {
    if (isNaN(Number(row[column]))) {
      return false;
    } else {
      return row[column] > value;
    }
  }
};

export const runLessThanOperation = (row: any, column: any, value: any) => {
  // return row[column] < value;
  if (Array.isArray(row[column])) {
    return row[column]?.length < value;
  }
  if (["number"].includes(typeof row[column])) {
    return row[column] < value;
  }
  if (["string"].includes(typeof row[column])) {
    if (isNaN(Number(row[column]))) {
      return false;
    } else {
      return row[column] < value;
    }
  }
};

export const runOperation = (
  row: any,
  column: any,
  operator: any,
  value: any
) => {
  // console.log("operator >>", operator);
  switch (operator) {
    case operations.EQUAL:
      return runEqualOperation(row, column, value);
    case operations.NOT_EQUAL:
      return runNotEqualOperation(row, column, value);
    case operations.IS_NULL:
      return runIsNullOperation(row, column, value);
    case operations.IS_NOT_NULL:
      return runIsNotNullOperation(row, column, value);
    case operations.CONTAINS:
      return runContainsOperation(row, column, value);
    case operations.START_WITH:
      return runStartWithOperation(row, column, value);
    case operations.END_WITH:
      return runEndWithOperation(row, column, value);
    case operations.GREATER_THAN:
      return runGreaterThanOperation(row, column, value);
    case operations.LESS_THAN:
      return runLessThanOperation(row, column, value);
    default:
      return false;
  }
};
export const logicalOR = (action: any, row: any) => {
  if (
    !Array.isArray(action?.bind?.column) ||
    !Array.isArray(action?.bind?.ifValue)
  ) {
    return false;
  }
  if (action?.bind?.column?.length !== action?.bind?.ifValue?.length) {
    return false;
  }

  const result = action?.bind?.column.map((column: any, index: any) => {
    let operator = null;

    if (["string"].includes(typeof action?.bind?.operator)) {
      operator = action?.bind?.operator;
    } else if (Array.isArray(action?.bind?.operator)) {
      if (action?.bind?.operator[index]) {
        operator = action?.bind?.operator[index];
      }
    }

    return runOperation(row, column, operator, action?.bind?.ifValue[index]);
  });
  return result.some((res: any) => res === true);
};

export const logicalAND = (action: any, row: any) => {
  if (
    !Array.isArray(action?.bind?.column) ||
    !Array.isArray(action?.bind?.ifValue)
  ) {
    return false;
  }
  if (action?.bind?.column?.length !== action?.bind?.ifValue?.length) {
    return false;
  }

  const result = action?.bind?.column.map((column: any, index: any) => {
    let operator = null;

    if (["string"].includes(typeof action?.bind?.operator)) {
      operator = action?.bind?.operator;
    } else if (Array.isArray(action?.bind?.operator)) {
      if (action?.bind?.operator[index]) {
        operator = action?.bind?.operator[index];
      }
    }

    return runOperation(row, column, operator, action?.bind?.ifValue[index]);
  });
  return result.every((res: any) => res === true);
};

export const processBind = (action: any, row: any) => {
  if (action?.bind?.logic) {
    switch (action?.bind?.logic) {
      case "or":
        return logicalOR(action, row);
      case "and":
        return logicalAND(action, row);
    }
  } else {
    return runOperation(
      row,
      action?.bind?.column,
      action?.bind?.operator,
      action?.bind?.ifValue
    );
  }
};

export const processMultipleBind = (action: any, rows: any) => {
  const result = rows?.map((row: any) => {
    return processBind(action, row);
  });

  const allFalse = result?.every((res: any) => res === false);
  if (allFalse) {
    return false;
  }
  const allTrue = result?.every((res: any) => res === true);
  if (allTrue) {
    return true;
  }

  const someFalse = result?.some((res: any) => res === false);
  if (someFalse) {
    return true;
  }
  return false;
};
