// svg declaration
declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.jpg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.ico" {
  const content: any;
  export default content;
}

declare module "*.css" {
  const content: any;
  export default content;
}

declare module "*.gif" {
  const content: any;
  export default content;
}

declare module "*.webp" {
  const content: any;
  export default content;
}

// Fallback type for @hassanmojab/react-modern-calendar-datepicker
declare module "@hassanmojab/react-modern-calendar-datepicker" {
  export const Calendar: any;
  export const utils: any;
}
declare module "qrcode" {
  export const toDataURL: any;
}

// Fallback type for papaparse
declare module "papaparse" {
  const content: {
    parse: any;
    unparse: any;
  };
  export default content;
}

// Fallback type for reactflow
declare module "reactflow" {
  export type Edge = any
  export type Node = any
}

// recovery
