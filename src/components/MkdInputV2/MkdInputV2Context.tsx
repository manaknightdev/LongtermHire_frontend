import React, { createContext, useContext } from "react";

// Define the possible input types
export type StandardInputType =
  | React.InputHTMLAttributes<HTMLInputElement>["type"]
  | "textarea"
  | "toggle"
  | "custom_date";
export type DropdownType = "dropdown" | "select";
export type MappingType = "mapping";
export type MkdInputV2Type = StandardInputType | DropdownType | MappingType;

// Context for the input field
export type MkdInputV2ContextType = {
  id: string;
  name?: string;
  type: MkdInputV2Type;
  value: any;
  onChange: (e: any) => void;
  register?: any;
  errors?: any;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  options?: string[] | number[] | boolean[];
  mapping?: Record<string | number, string>;
  customField?: boolean;
};

export const MkdInputV2Context = createContext<
  MkdInputV2ContextType | undefined
>(undefined);

// Hook to use the context
export const useMkdInputV2Context = () => {
  const context = useContext(MkdInputV2Context);
  if (!context) {
    throw new Error("MkdInputV2.* components must be used within MkdInputV2");
  }
  return context;
};
