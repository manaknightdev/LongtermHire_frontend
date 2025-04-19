import React, { useState } from "react";
import MkdInputV2 from "./index";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdButton } from "@/components/MkdButton";

/**
 * Example component demonstrating how to use the MkdInputV2 component
 * This shows the flexibility of the compound component pattern
 */
export const MkdInputV2Example: React.FC = () => {
  // Example state for a form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    subscribe: false,
    category: "",
  });

  // Example validation errors
  const [errors, setErrors] = useState<Record<string, { message: string }>>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox/toggle differently
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle toggle change
  const handleToggleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, subscribe: e.target.checked }));
  };

  // Example validation
  const validateForm = () => {
    const newErrors: Record<string, { message: string }> = {};

    if (!formData.name) {
      newErrors.name = { message: "Name is required" };
    }

    if (!formData.email) {
      newErrors.email = { message: "Email is required" };
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = { message: "Email is invalid" };
    }

    if (!formData.message) {
      newErrors.message = { message: "Message is required" };
    }

    if (!formData.category) {
      newErrors.category = { message: "Please select a category" };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Process form data
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Contact Form Example</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic text input with label and error */}
        <LazyLoad>
          <MkdInputV2
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            errors={errors}
            required
          >
            <MkdInputV2.Container>
              <MkdInputV2.Label>Your Name</MkdInputV2.Label>
              <MkdInputV2.Field placeholder="Enter your name" />
              <MkdInputV2.Error />
            </MkdInputV2.Container>
          </MkdInputV2>
        </LazyLoad>{" "}
        {/* Basic usage */}
        {/* Email input with custom styling */}
        <LazyLoad>
          <MkdInputV2
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            errors={errors}
            required
          >
            <MkdInputV2.Container>
              <MkdInputV2.Label className="text-blue-600">
                Email Address
              </MkdInputV2.Label>
              <MkdInputV2.Field
                placeholder="Enter your email"
                className="border-blue-200 focus:border-blue-500"
              />
              <MkdInputV2.Error />
            </MkdInputV2.Container>
          </MkdInputV2>
        </LazyLoad>
        {/* Custom layout */}
        {/* Textarea with custom layout */}
        <LazyLoad>
          <MkdInputV2
            name="message"
            type="textarea"
            value={formData.message}
            onChange={handleChange}
            errors={errors}
            required
            placeholder="Type your message here..."
          >
            <MkdInputV2.Container>
              <div className="flex justify-between">
                <MkdInputV2.Label>Your Message</MkdInputV2.Label>
                <span className="text-sm text-gray-500">
                  Max 500 characters
                </span>
              </div>
              <MkdInputV2.Field
                rows="4"
                placeholder="Type your message here..."
              />
              <MkdInputV2.Error />
            </MkdInputV2.Container>
          </MkdInputV2>
        </LazyLoad>
        {/* Toggle with inline label */}
        <LazyLoad>
          <MkdInputV2
            name="subscribe"
            type="toggle"
            value={formData.subscribe}
            onChange={handleToggleChange}
          >
            <MkdInputV2.Container className="flex items-center gap-3">
              <MkdInputV2.Field />
              <MkdInputV2.Label>Subscribe to newsletter</MkdInputV2.Label>
            </MkdInputV2.Container>
          </MkdInputV2>
        </LazyLoad>
        {/* Dropdown/select with options */}
        <LazyLoad>
          <MkdInputV2
            name="category"
            type="dropdown"
            value={formData.category}
            onChange={handleChange}
            errors={errors}
            options={["Support", "Feedback", "Partnership", "Other"]}
            required
          >
            <MkdInputV2.Container>
              <MkdInputV2.Label>Category</MkdInputV2.Label>
              <MkdInputV2.Field placeholder="Select a category" />
              <MkdInputV2.Error />
            </MkdInputV2.Container>
          </MkdInputV2>
        </LazyLoad>
        {/* Submit button */}
        <div className="pt-4">
          <LazyLoad>
            <MkdButton
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </MkdButton>
          </LazyLoad>
        </div>
      </form>
    </div>
  );
};

export default MkdInputV2Example;
