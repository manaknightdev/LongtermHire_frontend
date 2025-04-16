import { useEffect, useId, useState } from "react";
interface MkdControlledInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: any;
  ref?: React.RefObject<HTMLInputElement>;
  id?: string;
  className?: string;
  placeholder?: string;
  label?: string;
  children?: React.ReactNode;
  component?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
}
const MkdControlledInput = ({
  onChange,
  value,
  ref,
  id,
  className,
  type = "text",
  placeholder,
  label,
  children,
  component,
}: MkdControlledInputProps) => {
  const generatedId = useId();
  const [focus, setFocus] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (initialLoad) {
      return setInitialLoad(false);
    }
    if (onChange) {
      onChange({
        target: { value: inputValue },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [inputValue]);

  return (
    <div className={`relative h-fit w-full ${className}`}>
      <label
        htmlFor={id ?? generatedId}
        className={`${
          focus || inputValue
            ? "translate-y-0 text-sm"
            : "translate-x-2 translate-y-[1.89rem] cursor-text"
        } block w-fit font-bold text-gray-700 transition-all`}
      >
        {label}
      </label>

      <div
        className={`flex w-full items-end rounded border-b border-l-0 border-r-0 border-t-0 border-primaryBlue`}
      >
        <input
          className={`h-full grow resize-none appearance-none overflow-scroll break-words rounded border-0 px-2 leading-[.9375rem] focus:outline-none focus:ring-0`}
          type={type}
          ref={ref}
          id={id ?? generatedId}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={!focus || inputValue ? "" : placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {children ? (
          <div className={`h-fit w-fit shrink-0 cursor-pointer`}>
            {children}
          </div>
        ) : null}
      </div>
      {component ? (
        <div className={`h-fit w-fit shrink-0 cursor-pointer`}>{component}</div>
      ) : null}
    </div>
  );
};

export default MkdControlledInput;
