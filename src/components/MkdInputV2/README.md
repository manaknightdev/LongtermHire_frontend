# MkdInputV2 Component

This is a flexible, compound component implementation of the input field that allows for maximum customization and control over the structure and layout of form fields.

## Features

- Fully typed with TypeScript
- Inherits all HTML attributes for each element
- Flexible layout and structure
- Support for all input types (text, textarea, select, toggle, etc.)
- Built-in error handling
- Accessibility support
- Automatic prop validation based on input type

## Usage

```tsx
import { MkdInputV2 } from "@/components/MkdInputV2";

// Basic usage
<MkdInputV2
  name="email"
  type="email"
  value={email}
  onChange={handleChange}
  errors={errors}
  required
>
  <MkdInputV2.Container>
    <MkdInputV2.Label>Email Address</MkdInputV2.Label>
    <MkdInputV2.Field placeholder="Enter your email" />
    <MkdInputV2.Error />
  </MkdInputV2.Container>
</MkdInputV2>

// Custom layout
<MkdInputV2
  name="message"
  type="textarea"
  value={message}
  onChange={handleChange}
  errors={errors}
>
  <MkdInputV2.Container>
    <div className="flex justify-between">
      <MkdInputV2.Label>Your Message</MkdInputV2.Label>
      <span className="text-sm text-gray-500">Max 500 characters</span>
    </div>
    <MkdInputV2.Field rows="4" placeholder="Type your message here..." />
    <MkdInputV2.Error />
  </MkdInputV2.Container>
</MkdInputV2>

// Toggle with inline label
<MkdInputV2
  name="subscribe"
  type="toggle"
  value={subscribe}
  onChange={handleToggleChange}
>
  <MkdInputV2.Container className="flex items-center gap-3">
    <MkdInputV2.Field />
    <MkdInputV2.Label>Subscribe to newsletter</MkdInputV2.Label>
  </MkdInputV2.Container>
</MkdInputV2>
```

## Components

### MkdInputV2

The main wrapper component that provides context to all child components.

#### Props

- `name`: Input field name
- `type`: Input type (text, email, password, textarea, select, toggle, etc.)
- `value`: Input value
- `onChange`: Change handler function
- `register`: React Hook Form register function (optional)
- `errors`: Form validation errors
- `disabled`: Whether the input is disabled
- `required`: Whether the input is required
- `placeholder`: Input placeholder
- `options`: Options for select/dropdown inputs
- `mapping`: Mapping for select/dropdown inputs
- `customField`: Whether this is a custom field
- `children`: Child components
- `className`: Additional CSS classes

### MkdInputV2.Container

Container component for the input field.

#### Props

- `page`: Page context (e.g., "list")
- `children`: Child components
- `className`: Additional CSS classes
- All HTML div attributes

### MkdInputV2.Label

Label component for the input field.

#### Props

- `children`: Label text or elements
- `className`: Additional CSS classes
- All HTML label attributes

### MkdInputV2.Field

The actual input field component.

#### Props

- `className`: Additional CSS classes
- `placeholder`: Input placeholder (overrides the placeholder from the parent MkdInputV2 component)
- `cols`: Number of columns for textarea
- `rows`: Number of rows for textarea
- `checked`: Whether checkbox/radio is checked
- `step`: Step value for number inputs
- `min`: Minimum value for number inputs
- `loading`: Whether to show a loading skeleton
- All HTML input/textarea/select attributes

### MkdInputV2.Error

Error message component.

#### Props

- `className`: Additional CSS classes
- All HTML paragraph attributes

## Examples

### Basic Example

See `MkdInputV2.example.tsx` for a complete example of how to use this component in a form with manual state management.

### React Hook Form Example

See `MkdInputV2.hookform.example.tsx` for an example of using this component with React Hook Form and Yup validation.

```tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MkdInputV2 from "@/components/MkdInputV2";

// Define validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

// Initialize form
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(validationSchema),
});

// Form component
return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <MkdInputV2
      name="name"
      type="text"
      register={register}
      errors={errors}
      required
    >
      <MkdInputV2.Container>
        <MkdInputV2.Label>Name</MkdInputV2.Label>
        <MkdInputV2.Field placeholder="Enter your name" />
        <MkdInputV2.Error />
      </MkdInputV2.Container>
    </MkdInputV2>

    <MkdButton type="submit">Submit</MkdButton>
  </form>
);
```

## Type Safety and Automatic Prop Validation

The MkdInputV2 component uses TypeScript's discriminated unions to automatically enforce required props based on the input type:

```tsx
// For standard input types (text, email, password, etc.)
<MkdInputV2 type="text">
  {/* options and mapping props are not required */}
</MkdInputV2>

// For dropdown/select input types
<MkdInputV2
  type="dropdown"
  options={["Option 1", "Option 2"]} // options prop is required
>
  {/* TypeScript will error if options is missing */}
</MkdInputV2>

// For mapping input types
<MkdInputV2
  type="mapping"
  mapping={{ key1: "Value 1", key2: "Value 2" }} // mapping prop is required
>
  {/* TypeScript will error if mapping is missing */}
</MkdInputV2>
```

This ensures that you always provide the necessary props for each input type, preventing runtime errors.

## Advantages Over MkdInput

1. **Flexibility**: You can arrange the label, input, and error message in any order or layout
2. **Customization**: Each part of the input can be styled independently
3. **Type Safety**: Each component properly inherits all HTML attributes of its underlying element
4. **Composition**: You can add additional elements between the label and input
5. **Reusability**: Components can be reused in different contexts
6. **Automatic Validation**: Required props are enforced based on input type
