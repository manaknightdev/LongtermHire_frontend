import { useState } from "react";
import { MkdInput } from "@/components/MkdInput";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface MkdPasswordInputProps {
  register?: any;
  errors?: any;
  name?: string;
  label?: string;
  className?: string;
  required?: boolean;
}

const MkdPasswordInput = ({
  register,
  errors,
  name = "password",
  label = "Password",
  className,
  required = true,
}: MkdPasswordInputProps) => {
  const [type, setType] = useState("password");

  return (
    <div>
      <label
        className="mb-2 block cursor-pointer text-[.875rem] font-bold"
        htmlFor={name}
      >
        {label}
        {required && (
          <sup className="z-[99999] text-[.825rem] text-red-600">*</sup>
        )}
        {/* {StringCaser(label, { casetype: "capitalize", separator: "space" })} */}
      </label>
      <div
        className={`border-soft-200 focus:shadow-outline font-inter h-[3rem] flex  w-full appearance-none items-center rounded-[.625rem] border pr-2 font-inter leading-tight text-black shadow focus:outline-none focus:ring-0  ${className}`}
      >
        <div className="grow">
          <MkdInput
            type={type}
            name={name}
            // label={label}
            className={
              "w-full !h-full !min-h-full !max-h-full !border-0 !shadow-none"
            }
            errors={errors}
            register={register}
          />
        </div>
        <div className="h-[1.5rem] max-h-[1.5rem] min-h-[1.5rem] w-[1.5rem] min-w-[1.5rem] max-w-[1.5rem]">
          {type === "password" ? (
            <AiOutlineEye
              className="h-[1.5rem] max-h-[1.5rem] min-h-[1.5rem] w-[1.5rem] min-w-[1.5rem] max-w-[1.5rem] cursor-pointer text-gray-400"
              onClick={() => setType("text")}
            />
          ) : (
            <AiOutlineEyeInvisible
              className="h-[1.5rem] max-h-[1.5rem] min-h-[1.5rem] w-[1.5rem] min-w-[1.5rem] max-w-[1.5rem] cursor-pointer text-gray-400"
              onClick={() => setType("password")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MkdPasswordInput;
