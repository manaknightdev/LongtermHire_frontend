import React from "react";
import * as yup from "yup";
import MkdInputV2 from "./index";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdButton } from "@/components/MkdButton";

/**
 * Example component demonstrating how to use MkdInputV2 with React Hook Form and Yup validation
 */
export const MkdInputV2HookFormExample: React.FC = () => {
  const categoryMapping = {
    support: "Support",
    feedback: "Feedback",
    partnership: "Partnership",
    other: "Other",
  };
  // Define the validation schema using Yup
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    message: yup
      .string()
      .min(10, "Message must be at least 10 characters")
      .required("Message is required"),
    subscribe: yup.boolean().required().default(false),
    category: yup.string().required("Please select a category"),
  });

  // Initialize React Hook Form with Yup resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver<yup.InferType<typeof schema>>(schema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      subscribe: false,
      category: "",
    },
  });

  // Watch form values for display purposes
  const formValues = watch();

  // Handle toggle change (special case for boolean values)
  const handleToggleChange = (e: any) => {
    setValue("subscribe", e.target.checked);
  };

  // Handle form submission
  const onSubmit = (data: yup.InferType<typeof schema>) => {
    console.log("Form submitted:", data);
    // Process form data
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">React Hook Form + Yup Example</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Text input with React Hook Form */}
        <LazyLoad>
          <MkdInputV2
            name="name"
            type="text"
            register={register}
            errors={errors}
            required
          >
            <MkdInputV2.Container>
              <MkdInputV2.Label>Your Name</MkdInputV2.Label>
              <MkdInputV2.Field placeholder="Enter your name" />
              <MkdInputV2.Error />
            </MkdInputV2.Container>
          </MkdInputV2>
        </LazyLoad>

        {/* Email input with React Hook Form */}
        <LazyLoad>
          <MkdInputV2
            name="email"
            type="email"
            register={register}
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

        {/* Textarea with React Hook Form */}
        <LazyLoad>
          <MkdInputV2
            name="message"
            type="textarea"
            register={register}
            errors={errors}
            required
          >
            <MkdInputV2.Container>
              <div className="flex justify-between">
                <MkdInputV2.Label>Your Message</MkdInputV2.Label>
                <span className="text-sm text-gray-500">Min 10 characters</span>
              </div>
              <MkdInputV2.Field
                rows="4"
                placeholder="Type your message here..."
              />
              <MkdInputV2.Error />
            </MkdInputV2.Container>
          </MkdInputV2>
        </LazyLoad>

        {/* Toggle with React Hook Form */}
        <LazyLoad>
          <MkdInputV2
            name="subscribe"
            type="toggle"
            value={formValues.subscribe}
            onChange={handleToggleChange}
            errors={errors}
          >
            <MkdInputV2.Container className="flex gap-3 items-center">
              <MkdInputV2.Field />
              <MkdInputV2.Label>Subscribe to newsletter</MkdInputV2.Label>
            </MkdInputV2.Container>
          </MkdInputV2>
        </LazyLoad>

        {/* Dropdown with React Hook Form */}
        <LazyLoad>
          <MkdInputV2
            name="category"
            type="mapping"
            register={register}
            errors={errors}
            mapping={categoryMapping}
            required
          >
            <MkdInputV2.Container>
              <MkdInputV2.Label>Category</MkdInputV2.Label>
              <MkdInputV2.Field placeholder="Select a category" />
              <MkdInputV2.Error />
            </MkdInputV2.Container>
          </MkdInputV2>
        </LazyLoad>

        {/* Form values preview (for demonstration) */}
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Current Form Values:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(formValues, null, 2)}
          </pre>
        </div>

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

export default MkdInputV2HookFormExample;
