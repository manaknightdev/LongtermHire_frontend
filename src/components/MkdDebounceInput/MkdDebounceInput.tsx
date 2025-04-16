import { useId, useState } from "react";
import { StringCaser } from "@/utils/utils";

let timeout: any | null = null;

interface MkdDebounceInputProps {
  type?: string;
  label?: string;
  className?: string;
  placeholder?: string;
  options?: any[];
  disabled?: boolean;
  setValue?: (value?: any) => void;
  value?: any;
  onReady?: (value: any) => void;
  timer?: number;
  showIcon?: boolean;
}

const MkdDebounceInput = ({
  type = "text",
  label,
  className,
  placeholder = "Search",
  options = [],
  disabled = false,
  setValue,
  value,
  onReady,
  timer = 1000,
  showIcon = true,
}: MkdDebounceInputProps) => {
  const inputId = useId();
  const stringCaser = new StringCaser()
  const [inputValue, setInputValue] = useState("");

  function handleInput(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const inputName = e.target.value;
    setValue?.(inputName);
    setInputValue(inputName);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      // Make the API call here using the `name` state variable
      if (inputName.length) {
        onReady?.(inputName);
      }
    }, timer); // 500 milliseconds = half a second
  }

  return (
    <>
      <div className="w-full">
        <label
          className="mb-2 block cursor-pointer text-sm font-bold text-gray-700"
          htmlFor={inputId}
        >
          {stringCaser?.Capitalize(label ?? "", {
            separator: "space",
          })}
        </label>
        {type === "dropdown" || type === "select" ? (
          <select
            id={inputId}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleInput(e)
            }
            value={value || inputValue}
            className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${className}`}
          >
            <option></option>
            {options.map((option, key) => (
              <option value={option} key={key + 1}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <div className="relative">
            {showIcon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
            )}
            <input
              type={type}
              id={inputId}
              disabled={disabled}
              placeholder={placeholder}
              onChange={(e) => handleInput(e)}
              value={value || inputValue}
              className={`block w-full rounded-lg border border-blue-600  bg-white p-4 pl-10 text-sm text-black placeholder-black focus:border-blue-500 focus:ring-blue-500 dark:text-gray-400 dark:placeholder-gray-400 ${className}`}
            />
          </div>
          // <input
          //   type={type}
          //   id={inputId}
          //   disabled={disabled}
          //   placeholder={placeholder}
          //   onChange={(e)=> handleInput(e)}
          //   value={value||inputValue}
          //   className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${className}`}
          // />
        )}
        {/* <p className="text-field-error italic text-red-500">
          {errors[name]?.message}
        </p> */}
      </div>
    </>
  );
};

// <input type="search" id="search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />

export default MkdDebounceInput;
