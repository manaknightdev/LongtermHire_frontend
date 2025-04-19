# Project Template

## Getting Started

This project serves as a template for all other projects. It includes initial setup and testing configurations that work out of the box.

## E2E Testing with AI

This project uses Playwright for end-to-end testing. We encourage developers to write e2e tests as they develop new features, and to leverage AI tools to help with this process.

### Why E2E Testing?

End-to-end tests ensure that the entire application works correctly from a user's perspective. They test complete user flows and catch integration issues that unit tests might miss.

### Using AI for Test Creation

To streamline the testing process, developers should use AI to help write e2e tests. This approach:

- Saves development time
- Ensures consistent test coverage
- Helps identify edge cases
- Maintains testing best practices

For detailed instructions on how to use AI to write e2e tests, see the [E2E Testing Guide](src/test/e2e/README.md).

## Component Development Guide

This section provides guidelines for creating well-typed, properly structured React components using TypeScript. Previous implementations in this template project have had issues with component typing and attribute inheritance that we want to address moving forward.

### Using AI for Component Development

We encourage using AI to help create and refine components. When using AI for component development:

1. Provide clear requirements and context about the component's purpose
2. Specify TypeScript typing requirements
3. Review and test the generated code thoroughly

### TypeScript Component Requirements

All components must be properly typed with TypeScript. This includes:

- Explicit prop interfaces/types
- Proper typing of event handlers
- Correct use of generics when needed
- Type-safe state management

### Component Attribute Inheritance

A critical requirement that was previously overlooked is ensuring components properly inherit all attributes of their underlying HTML elements. Components should:

1. Extend the appropriate HTML element interface
2. Forward all relevant props to the underlying element
3. Properly type event handlers

#### Multi-Element Components

For components that contain multiple HTML elements (e.g., a form field with label, input, error message, and button), you need to provide a way to pass specific attributes to each individual element. There are several approaches:

1. **Namespaced Props**: Use prefixes to target specific elements
2. **Compound Components**: Split into sub-components that can be composed
3. **Prop Objects**: Pass objects containing props for each element

Here's an example of the prop objects approach for a form field component:

```tsx
import React from "react";

// Define types for each element's props
type FormFieldContainerProps = React.HTMLAttributes<HTMLDivElement>;
type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

// Main component props
interface FormFieldProps {
  // Base props
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  error?: string;

  // Element-specific props
  containerProps?: FormFieldContainerProps;
  labelProps?: LabelProps;
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
}

export const FormField: React.FC<FormFieldProps> = ({
  // Base props
  label,
  value,
  onChange,
  onClear,
  error,

  // Element-specific props
  containerProps = {},
  labelProps = {},
  inputProps = {},
  buttonProps = {},
}) => {
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    // Container div with containerProps spread
    <div
      className={`form-field ${error ? "has-error" : ""} ${containerProps.className || ""}`}
      {...containerProps}
    >
      {/* Label with labelProps spread */}
      <label
        className={`form-label ${labelProps.className || ""}`}
        {...labelProps}
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="input-wrapper">
        {/* Input with inputProps spread */}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={`form-input ${error ? "input-error" : ""} ${inputProps.className || ""}`}
          aria-invalid={error ? "true" : "false"}
          {...inputProps}
        />

        {/* Clear button with buttonProps spread */}
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className={`clear-button ${buttonProps.className || ""}`}
            aria-label="Clear input"
            {...buttonProps}
          >
            ×
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
```

Usage example:

```tsx
<FormField
  label="Email Address"
  value={email}
  onChange={setEmail}
  onClear={() => setEmail("")}
  error={emailError}
  // Pass specific props to each element
  containerProps={{
    "data-testid": "email-field-container",
    onMouseEnter: handleMouseEnter,
  }}
  labelProps={{
    htmlFor: "email-input",
    className: "required-label",
  }}
  inputProps={{
    id: "email-input",
    placeholder: "Enter your email",
    autoComplete: "email",
    maxLength: 100,
  }}
  buttonProps={{
    "data-testid": "clear-email-button",
    tabIndex: 0,
  }}
/>
```

Alternatively, you can use the compound component pattern for more flexibility:

```tsx
import React, { createContext, useContext, useState } from "react";

// Context for the form field
type FormFieldContextType = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

const FormFieldContext = createContext<FormFieldContextType | undefined>(
  undefined
);

// Hook to use the context
const useFormField = () => {
  const context = useContext(FormFieldContext);
  if (!context) {
    throw new Error("FormField.* components must be used within FormField");
  }
  return context;
};

// Main component props
interface FormFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  children: React.ReactNode;
}

// Main component
const FormField: React.FC<FormFieldProps> & {
  Label: typeof FormFieldLabel;
  Input: typeof FormFieldInput;
  Error: typeof FormFieldError;
  ClearButton: typeof FormFieldClearButton;
} = ({ id, value, onChange, error, children }) => {
  return (
    <FormFieldContext.Provider value={{ id, value, onChange, error }}>
      <div className={`form-field ${error ? "has-error" : ""}`}>{children}</div>
    </FormFieldContext.Provider>
  );
};

// Label component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const FormFieldLabel: React.FC<LabelProps> = ({ children, ...props }) => {
  const { id } = useFormField();
  return (
    <label htmlFor={id} {...props}>
      {children}
    </label>
  );
};

// Input component
interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {}

const FormFieldInput: React.FC<InputProps> = (props) => {
  const { id, value, onChange, error } = useFormField();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      id={id}
      value={value}
      onChange={handleChange}
      aria-invalid={error ? "true" : "false"}
      className={error ? "input-error" : ""}
      {...props}
    />
  );
};

// Error message component
interface ErrorProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormFieldError: React.FC<ErrorProps> = (props) => {
  const { error } = useFormField();
  if (!error) return null;

  return (
    <div className="error-message" {...props}>
      {error}
    </div>
  );
};

// Clear button component
interface ClearButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClear: () => void;
}

const FormFieldClearButton: React.FC<ClearButtonProps> = ({
  onClear,
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClear}
      className="clear-button"
      aria-label="Clear input"
      {...props}
    >
      ×
    </button>
  );
};

// Assign sub-components
FormField.Label = FormFieldLabel;
FormField.Input = FormFieldInput;
FormField.Error = FormFieldError;
FormField.ClearButton = FormFieldClearButton;

export { FormField };
```

Usage example:

```tsx
const [email, setEmail] = useState("");
const [emailError, setEmailError] = useState("");

const validateEmail = (value: string) => {
  if (!value) return "Email is required";
  if (!value.includes("@")) return "Invalid email format";
  return "";
};

const handleChange = (value: string) => {
  setEmail(value);
  setEmailError(validateEmail(value));
};

const handleClear = () => {
  setEmail("");
  setEmailError("");
};

return (
  <FormField
    id="email"
    value={email}
    onChange={handleChange}
    error={emailError}
  >
    <FormField.Label className="custom-label">Email Address</FormField.Label>
    <div className="input-container">
      <FormField.Input
        placeholder="Enter your email"
        autoComplete="email"
        maxLength={100}
        data-testid="email-input"
      />
      <FormField.ClearButton
        onClear={handleClear}
        data-testid="clear-email"
        disabled={!email}
      />
    </div>
    <FormField.Error data-testid="email-error" />
  </FormField>
);
```

This compound component pattern provides several advantages:

1. **Flexibility**: More control over the structure and layout
2. **Clarity**: Clear separation of concerns for each element
3. **Reusability**: Sub-components can be reused in different contexts
4. **Type Safety**: Each sub-component has its own properly typed props
5. **Customization**: Easy to add, remove, or rearrange elements

#### Choosing the Right Approach

When deciding which approach to use for multi-element components:

- **Use Prop Objects** when:

  - The component has a fixed structure
  - You need a simpler API with fewer components
  - The component is used in a consistent way across the application

- **Use Compound Components** when:

  - You need maximum flexibility in component structure
  - Different instances might have different layouts
  - You want to allow developers to add or remove elements
  - The component is complex with many configurable parts

- **Use Namespaced Props** when:
  - You have a simpler component with just a few elements
  - You prefer a flatter prop structure
  - Example: `inputId`, `inputClassName`, `labelFor`, `labelClassName`

Regardless of the approach, always ensure that each HTML element in your component can receive its full set of native attributes through props.

### Example: Button Component

```tsx
// Bad example - doesn't inherit button attributes
type BadButtonProps = {
  label: string;
  onClick: () => void;
};

const BadButton = ({ label, onClick }: BadButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};

// Good example - inherits all button attributes
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  variant?: "primary" | "secondary" | "outline";
};

const Button = ({
  label,
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2";
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-primary text-primary hover:bg-primary-light",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {label || children}
    </button>
  );
};
```

### Component Structure Guidelines

1. **File Organization**:

   - One component per file
   - Use index files for exporting multiple components from a directory
   - Group related components in subdirectories

2. **Naming Conventions**:

   - Use PascalCase for component names
   - Use camelCase for props and variables
   - Suffix interfaces with `Props` (e.g., `ButtonProps`)

3. **Props Handling**:

   - Destructure props in function parameters
   - Provide default values where appropriate
   - Use the spread operator (`...props`) to forward additional props

4. **Component Template**:

```tsx
import React from "react";

interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add custom props here
  customProp?: string;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  customProp = "default",
  className = "",
  children,
  ...props
}) => {
  // Component logic here

  return (
    <div className={`base-classes ${className}`} {...props}>
      {children}
    </div>
  );
};
```

### AI Prompting for Component Creation

When asking AI to create a component, use a prompt like this:

```
Please create a [component name] component in TypeScript with the following requirements:

1. Purpose: [Describe what the component does]
2. Props: [List required and optional props]
3. Behavior: [Describe component behavior, events, etc.]
4. Styling: [Describe styling approach - Tailwind, CSS modules, etc.]

Important requirements:
- The component must properly extend the HTML [element] interface to inherit all attributes
- Use proper TypeScript typing for all props and event handlers
- Follow our project's component structure guidelines
- Include JSDoc comments for the component and its props
```

### Testing Components

All components should have appropriate tests:

1. Unit tests for logic and rendering
2. Integration tests for component interactions
3. E2E tests for critical user flows

See the [E2E Testing Guide](src/test/e2e/README.md) for more details on testing.

### Accessibility

Components must be accessible:

1. Use semantic HTML elements
2. Include proper ARIA attributes when needed
3. Ensure keyboard navigation works
4. Maintain sufficient color contrast
5. Support screen readers

### Performance Considerations

1. Memoize expensive calculations with `useMemo`
2. Optimize re-renders with `React.memo` when appropriate
3. Use `useCallback` for event handlers passed to child components
4. Avoid unnecessary state updates

By following these guidelines and leveraging AI assistance, we can create well-typed, properly structured, and maintainable components that avoid the issues present in previous implementations.
