import React, { useState } from "react";
import Toggle from "react-toggle";
import { Modal } from "@/components/Modal";
import { CalendarIcon } from "@/assets/svgs";
import { determineModalTitle } from "./utils";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdCalendar } from "@/components/MkdCalendar";
import { useMkdInputV2Context } from "./MkdInputV2Context";
// Import Skeleton component or create a simple placeholder if it doesn't exist
const SkeletonLoader: React.FC<{
  count: number;
  counts: number[];
  className: string;
}> = ({ className }) => <div className={className}>Loading...</div>;

// Input Field component props
interface MkdInputV2FieldProps extends React.HTMLAttributes<HTMLElement> {
  cols?: string;
  rows?: string;
  checked?: boolean;
  step?: string;
  min?: string;
  loading?: boolean;
  placeholder?: string; // Add placeholder to the props interface
}

const MkdInputV2Field: React.FC<MkdInputV2FieldProps> = ({
  className = "",
  cols = "30",
  rows = "50",
  checked,
  step,
  min,
  placeholder: fieldPlaceholder, // Rename to avoid conflict with context placeholder
  ...props
}) => {
  const {
    id,
    type,
    name,
    value,
    onChange,
    register,
    errors,
    disabled,
    required,
    placeholder,
    options,
    mapping,
    customField,
  } = useMkdInputV2Context();

  const [selectedDay, setSelectedDay] = useState(null);
  const [inputData, setInputData] = useState({
    modal: null as string | null,
    showModal: false,
  });

  const onToggleModal = (modal: string | null, toggle: boolean) => {
    setInputData((prev) => ({ ...prev, modal, showModal: toggle }));
  };

  // Common props for input elements
  const commonProps = {
    id,
    name,
    disabled,
    placeholder: fieldPlaceholder || placeholder, // Prioritize field placeholder over context placeholder
    ...(value !== null ? { value } : {}),
    ...(register
      ? register(name, {
          ...(required && customField ? { required: true } : null),
        })
      : {
          onChange,
        }),
    className: `focus:shadow-outline font-inter w-full appearance-none rounded border px-3 py-2 leading-tight text-black shadow focus:outline-none ${className} ${
      name && errors && errors?.[name] && errors?.[name]?.message
        ? "!border-red-500"
        : "border-gray-200"
    } ${disabled ? "appearance-none bg-gray-200" : ""}`,
  };

  // Loading state
  if (props.loading) {
    return (
      <SkeletonLoader
        count={1}
        counts={[2]}
        className={`!h-[3rem] !max-h-[3rem] !min-h-[3rem] !gap-0 overflow-hidden rounded-[.625rem] !bg-[#ebebeb] !p-0`}
      />
    );
  }

  // Render different input types
  if (type === "textarea") {
    return <textarea {...commonProps} cols={cols} rows={rows} />;
  }

  if (type === "radio" || type === "checkbox" || type === "color") {
    return (
      <div className="flex h-[1.875rem] items-center gap-2 pb-1 pt-3">
        <input
          {...commonProps}
          type={type}
          checked={checked}
          className={`focus:shadow-outline font-inter !h-4 !w-4 cursor-pointer appearance-none rounded border leading-tight text-primary shadow focus:outline-none focus:ring-0 ${className} ${
            name && errors && errors?.[name] && errors?.[name]?.message
              ? "!border-red-500"
              : "border-gray-200"
          } ${
            type === "color" ? "min-h-[3.125rem] min-w-[6.25rem]" : ""
          } ${disabled ? "appearance-none bg-gray-200" : ""}`}
          autoComplete="new-password"
          aria-autocomplete="none"
        />
      </div>
    );
  }

  if (type === "toggle") {
    return (
      <Toggle
        className={`toggle_class ${className}`}
        disabled={disabled}
        icons={false}
        onChange={onChange}
        checked={[true, false].includes(value) ? value : undefined}
      />
    );
  }

  if (type === "dropdown" || type === "select") {
    if (!options?.length) {
      return (
        <div className="text-red-500 p-2 border border-red-300 rounded">
          Error: options prop is required for {type} type. Please provide an
          array of options, e.g. {`["option1", "option2"]`}
        </div>
      );
    }

    return (
      <select
        {...commonProps}
        className={`focus:shadow-outline font-inter h-[3rem] w-full appearance-none truncate rounded-[.625rem] border p-[.625rem] px-3 py-2 leading-tight text-black shadow focus:outline-none focus:ring-0 ${className} ${
          name && errors && errors?.[name] && errors?.[name]?.message
            ? "!border-red-500"
            : "border-gray-200"
        } ${disabled ? "appearance-none bg-gray-200" : ""}`}
      >
        <option></option>
        {options?.map((option: string | number | boolean, key: number) => (
          <option value={String(option)} key={key + 1}>
            {String(option)}
          </option>
        ))}
      </select>
    );
  }

  if (type === "mapping") {
    if (!mapping) {
      return (
        <div className="text-red-500 p-2 border border-red-300 rounded">
          Error: mapping prop is required for mapping type. Please provide a
          mapping object, e.g. {`{key:value}`}
        </div>
      );
    }

    return (
      <select
        {...commonProps}
        className={`focus:shadow-outline font-inter h-[3rem] w-full truncate rounded-[.625rem] border p-[.625rem] px-3 py-2 leading-tight text-black shadow focus:outline-none focus:ring-0 ${className} ${
          name && errors && errors?.[name] && errors?.[name]?.message
            ? "!border-red-500"
            : "border-gray-200"
        } ${disabled ? "appearance-none bg-gray-200" : ""}`}
      >
        <option></option>
        {mapping &&
          Object.entries(mapping).map(([key, value], indexKey: number) => (
            <option value={key} key={indexKey + 1}>
              {value?.toString()}
            </option>
          ))}
      </select>
    );
  }

  if (type === "number" || type === "decimal") {
    return (
      <input
        {...commonProps}
        type={type}
        step={step || "0.01"}
        min={min || "0.00"}
        onInput={(e) => {
          let value = (e.target as HTMLInputElement).value;

          // If the input starts with '.', prepend '0'
          if (value.startsWith(".")) {
            value = `0${value}`;
          }

          // Allow only numbers with up to 2 decimal places
          if (!/^\d+(\.\d{0,2})?$/.test(value)) {
            value = value.slice(0, -1); // Remove last invalid character
          }

          (e.target as HTMLInputElement).value = value; // Update the input value
        }}
        className={`focus:shadow-outline font-inter h-[3rem] w-full appearance-none rounded-[.625rem] border p-[.625rem] px-3 py-2 leading-tight text-black shadow focus:outline-none focus:ring-0 ${className} ${
          name && errors && errors?.[name] && errors?.[name]?.message
            ? "!border-red-500"
            : "border-gray-200"
        } ${disabled ? "appearance-none bg-gray-200" : ""}`}
        autoComplete="new-password"
        aria-autocomplete="none"
      />
    );
  }

  if (type === "custom_date") {
    return (
      <>
        <div
          onClick={() => {
            if (disabled) return;
            onToggleModal("custom_date", true);
          }}
          className="relative cursor-pointer"
        >
          <input
            {...commonProps}
            type={type}
            disabled={true}
            className={`focus:shadow-outline bg-brown-main-bg h-[3rem] w-full appearance-none truncate rounded-sm border-[.125rem] border-[#1f1d1a] text-center text-sm font-normal leading-tight text-[#1f1d1a] shadow focus:outline-none focus:ring-0 ${className} ${
              name && errors && errors?.[name] && errors?.[name]?.message
                ? "!border-red-500"
                : "border-gray-200"
            }`}
            autoComplete="new-password"
            aria-autocomplete="none"
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer" />
        </div>

        {inputData?.showModal ? (
          <Modal
            modalHeader
            title={inputData.modal ? determineModalTitle(inputData?.modal) : ""}
            isOpen={inputData.showModal}
            modalCloseClick={() => onToggleModal(null, false)}
            classes={{
              modalDialog:
                "!px-0 !rounded-[.125rem] h-fit min-h-fit max-h-fit !w-full !max-w-full !min-w-full ",
              modalContent: `!z-10 !mt-0 overflow-hidden !pt-0`,
              modal: "h-full",
            }}
          >
            {inputData.showModal &&
            ["custom_date"].includes(inputData.modal!) ? (
              <LazyLoad>
                <MkdCalendar
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  onSave={() => {
                    onChange({ target: { value: selectedDay } });
                    onToggleModal(null, false);
                  }}
                />
              </LazyLoad>
            ) : null}
          </Modal>
        ) : null}
      </>
    );
  }

  // Default input type
  return (
    <input
      {...commonProps}
      type={type}
      className={`focus:shadow-outline font-inter h-[3rem] w-full appearance-none rounded-[.625rem] border p-[.625rem] px-3 py-2 leading-tight text-black shadow focus:outline-none focus:ring-0 ${className} ${
        name && errors && errors?.[name] && errors?.[name]?.message
          ? "!border-red-500"
          : "border-gray-200"
      } ${disabled ? "appearance-none bg-gray-200" : ""}`}
      autoComplete="new-password"
      aria-autocomplete="none"
    />
  );
};

export default MkdInputV2Field;
