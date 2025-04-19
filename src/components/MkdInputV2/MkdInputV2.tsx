import React, { useId } from "react";
import {
  MkdInputV2Context,
  StandardInputType,
  DropdownType,
  MappingType,
} from "./MkdInputV2Context";

// Base props that all input types share
interface BaseMkdInputV2Props {
  name?: string;
  value?: any;
  onChange?: (e: any) => void;
  register?: any;
  errors?: any;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  customField?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Props specific to standard input types (text, email, textarea, etc.)
interface StandardInputProps extends BaseMkdInputV2Props {
  type?: StandardInputType;
  options?: never;
  mapping?: never;
}

// Props specific to dropdown/select input types
interface DropdownInputProps extends BaseMkdInputV2Props {
  type: DropdownType;
  options: string[] | number[] | boolean[];
  mapping?: never;
}

// Props specific to mapping input types
interface MappingInputProps extends BaseMkdInputV2Props {
  type: MappingType;
  mapping: Record<string | number, string>;
  options?: string[] | number[] | boolean[];
}

// Union type of all possible prop combinations
type MkdInputV2Props =
  | StandardInputProps
  | DropdownInputProps
  | MappingInputProps;

// Main component without the sub-components (they will be added in index.ts)
const MkdInputV2: React.FC<MkdInputV2Props> = ({
  name,
  type = "text",
  value = null,
  onChange,
  register = null,
  errors = null,
  disabled = false,
  required = false,
  placeholder,
  options = [],
  mapping,
  customField = false,
  children,
  className,
}) => {
  const id = useId();

  // Runtime validation for required props based on input type
  if ((type === "dropdown" || type === "select") && !options?.length) {
    console.error(
      `MkdInputV2: options prop is required for type="${type}". Please provide an array of options.`
    );
  }

  if (type === "mapping" && !mapping) {
    console.error(
      `MkdInputV2: mapping prop is required for type="mapping". Please provide a mapping object.`
    );
  }

  // Handle onChange based on whether register is provided
  const handleChange = (e: any) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <MkdInputV2Context.Provider
      value={{
        id,
        name,
        type,
        value,
        onChange: handleChange,
        register,
        errors,
        disabled,
        required,
        placeholder,
        options,
        mapping,
        customField,
      }}
    >
      <div className={className}>{children}</div>
    </MkdInputV2Context.Provider>
  );
};

export default MkdInputV2;
