import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MkdPasswordInput from "./MkdPasswordInput";

// Validation schema
const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

interface FormData {
  password: string;
  confirmPassword: string;
}

const MkdPasswordInputExample = () => {
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: formData,
  });

  // Handle form submission
  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    alert("Password form submitted successfully!");
    reset();
    setFormData({ password: "", confirmPassword: "" });
  };

  // Handle controlled input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-text">Password Input Examples</h2>

      {/* Basic Usage with React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-text">
            Basic Usage with React Hook Form
          </h3>
          
          {/* Password field */}
          <MkdPasswordInput
            name="password"
            label="Password"
            register={register}
            errors={errors}
            placeholder="Enter your password"
            required
          />
        </div>

        <div>
          {/* Confirm Password field */}
          <MkdPasswordInput
            name="confirmPassword"
            label="Confirm Password"
            register={register}
            errors={errors}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-md transition-colors duration-200"
        >
          Submit
        </button>
      </form>

      {/* Controlled Component Usage */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-text">
          Controlled Component Usage
        </h3>
        
        <div className="space-y-4">
          <MkdPasswordInput
            name="password"
            label="Controlled Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Type to see controlled behavior"
          />
          
          <p className="text-sm text-secondary">
            Current value: {formData.password}
          </p>
        </div>
      </div>

      {/* Custom Styling Example */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-text">
          Custom Styling
        </h3>
        
        <MkdPasswordInput
          name="customPassword"
          label="Custom Styled Password"
          placeholder="Custom styled input"
          containerClassName="bg-background-active p-4 rounded-lg"
          labelClassName="text-primary font-bold"
          inputClassName="border-primary focus:border-accent"
        />
      </div>

      {/* Disabled State */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-text">
          Disabled State
        </h3>
        
        <MkdPasswordInput
          name="disabledPassword"
          label="Disabled Password"
          placeholder="This input is disabled"
          disabled
          value="disabled-value"
        />
      </div>
    </div>
  );
};

export default MkdPasswordInputExample;
