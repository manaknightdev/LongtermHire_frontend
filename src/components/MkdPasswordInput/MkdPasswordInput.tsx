import { useState } from "react";
import { MkdInputV2 } from "@/components/MkdInputV2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface MkdPasswordInputProps {
  register?: any;
  errors?: any;
  name?: string;
  label?: string;
  inputClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MkdPasswordInput = ({
  register,
  errors,
  name = "password",
  label = "Password",
  inputClassName,
  labelClassName,
  containerClassName,
  required = true,
  disabled = false,
  placeholder = "Enter your password",
  value,
  onChange,
}: MkdPasswordInputProps) => {
  const [type, setType] = useState("password");

  return (
    <MkdInputV2
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      errors={errors}
      register={register}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
    >
      <MkdInputV2.Container className={containerClassName}>
        <MkdInputV2.Label className={labelClassName}>{label}</MkdInputV2.Label>
        <div className="relative">
          <MkdInputV2.Field className={`pr-12 ${inputClassName}`} />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {type === "password" ? (
              <AiOutlineEye
                className="h-[1.5rem] w-[1.5rem] cursor-pointer text-icon hover:text-icon-hover transition-colors duration-200"
                onClick={() => setType("text")}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="h-[1.5rem] w-[1.5rem] cursor-pointer text-icon hover:text-icon-hover transition-colors duration-200"
                onClick={() => setType("password")}
              />
            )}
          </div>
        </div>
        <MkdInputV2.Error />
      </MkdInputV2.Container>
    </MkdInputV2>
  );
};

export default MkdPasswordInput;
