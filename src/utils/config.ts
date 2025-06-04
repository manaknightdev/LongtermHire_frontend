export const formType = {
  login: "login",
  signup: "signup",
  add: "add",
  edit: "edit",
  search: "search",
  custom: "custom",
};

export const Colors = {
  DARK: {
    PRIMARY: "#4F46E5",
    SECONDARY: "#292929",
    BACKGROUND: "#121212",
    // #E0E0E0 #FAFAFA #121212
  },
  LIGHT: {
    PRIMARY: "#4F46E5",
    SECONDARY: "#4F46E5",
    BACKGROUND: "#FFFFFF",
  },
};

export const optionTypes = {
  STATIC: "static",
  DROPDOWN: "dropdown",
};
export const actionsDefault = {
  export: {
    show: true,
    multiple: true,
    action: null,
    showText: false,
    className: "!bg-transparent !border-0 !p-0",
  },
  add: {
    show: true,
    action: null,
    multiple: true,
    showChildren: true,
    children: "+ Add",
  },
};
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

export const operationActions = {
  VISIBILITY: "hide",
  INTERACTION: "disable",
};

export const MKD_DOMAIN = "manaknightdigital.com";
