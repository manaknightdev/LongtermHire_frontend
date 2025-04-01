import { useId, useState } from "react";
import { StringCaser } from "@/utils/utils";
import Toggle from "react-toggle";
import { Skeleton as SkeletonLoader } from "@/components/Skeleton";
import { LazyLoad } from "@/components/LazyLoad";
import { Modal } from "@/components/Modal";
import { MkdCalendar } from "@/components/MkdCalendar";
import { CalendarIcon } from "@/assets/svgs";

interface MkdInputProps {
  type?: string;
  page?: string;
  cols?: string;
  rows?: string;
  name?: string;
  label?: string | React.ReactNode;
  errors?: any;
  register?: any;
  className?: string;
  placeholder?: string;
  options?: any[];
  mapping?: any;
  disabled?: boolean;
  value?: any;
  checked?: any;
  onChange?: any;
  loading?: boolean;
  required?: boolean;
  labelClassName?: string;
  customField?: boolean;
  showErrorMessage?: boolean;
}

const { Capitalize } = new StringCaser();

const MkdInput = ({
  type = "text",
  page,
  cols = "30",
  rows = "50",
  name,
  label,
  errors = null,
  register = null,
  className,
  placeholder,
  options = [],
  mapping = null,
  disabled = false,
  value = null,
  checked = null,
  onChange,
  loading = false,
  required = false,
  labelClassName = "",
  customField = false,
  showErrorMessage = true
}: MkdInputProps) => {
  const uniqueId = useId();

  const [selectedDay, setSelectedDay] = useState(null);
  const [inputData, setInputData] = useState({
    modal: null as string | null,
    showModal: false
  });

  const onToggleModal = (modal: string | null, toggle: boolean) => {
    setInputData((prev) => ({ ...prev, modal, showModal: toggle }));
  };

  return (
    <>
      <div
        className={`relative grow ${
          page === "list" ? "w-full pl-2 pr-2 md:w-1/2" : ""
        }`}
      >
        {["radio", "checkbox", "color", "toggle"].includes(type) ? null : (
          <>
            {label && (
              <label
                className={`mb-2 block cursor-pointer text-[.875rem] font-bold ${labelClassName}`}
                htmlFor={uniqueId}
              >
                {label}
                {required && (
                  <sup className="z-[99999] text-[.825rem] text-red-600">*</sup>
                )}
              </label>
            )}
          </>
        )}
        {loading ? (
          <SkeletonLoader
            count={1}
            counts={[2]}
            className={`!h-[3rem] !max-h-[3rem] !min-h-[3rem] !gap-0 overflow-hidden rounded-[.625rem] !bg-[#ebebeb] !p-0`}
          />
        ) : type === "textarea" ? (
          <>
            <textarea
              className={`focus:shadow-outline font-inter w-full appearance-none rounded border px-3 py-2 leading-tight text-black shadow focus:outline-none ${className} ${
                name && errors && errors?.[name] && errors?.[name]?.message
                  ? "!border-red-500"
                  : "border-gray-200"
              } ${disabled ? "appearance-none bg-gray-200" : ""}`}
              disabled={disabled}
              id={uniqueId}
              cols={cols}
              name={name}
              placeholder={placeholder}
              rows={rows}
              {...(value ? { value: value } : null)}
              {...(register
                ? register(name, {
                    ...(required && customField ? { required: true } : null)
                  })
                : {
                    onChange: onChange
                  })}
            ></textarea>
          </>
        ) : ["radio", "checkbox", "color", "toggle"].includes(type) ? (
          <div className="flex h-[1.875rem] items-center gap-2 pb-1 pt-3">
            {["toggle"].includes(type) ? (
              <Toggle
                className={`toggle_class ${className}`}
                disabled={disabled}
                icons={false}
                {...(onChange ? { onChange: onChange } : null)}
                {...([true, false].includes(value) ? { checked: value } : null)}
              />
            ) : (
              <input
                autoComplete="new-password" // Ensure no browser autocomplete
                aria-autocomplete="none"
                type={type}
                defaultValue={""}
                disabled={disabled}
                id={uniqueId}
                name={name}
                {...(value ? { value: value } : null)}
                checked={checked}
                placeholder={placeholder}
                {...(register
                  ? register(name, {
                      ...(required && customField ? { required: true } : null)
                    })
                  : {
                      onChange: onChange
                    })}
                className={`focus:shadow-outline font-inter !h-4 !w-4 cursor-pointer appearance-none rounded border leading-tight text-primary shadow focus:outline-none focus:ring-0 ${className} ${
                  name && errors && errors?.[name] && errors?.[name]?.message
                    ? "!border-red-500"
                    : "border-gray-200"
                } ${
                  type === "color" ? "min-h-[3.125rem] min-w-[6.25rem]" : ""
                } ${disabled ? "appearance-none bg-gray-200" : ""}`}
              />
            )}
            <label
              className={`font-inter mb-2 block h-full cursor-pointer whitespace-nowrap text-[.9375rem] font-bold capitalize text-black ${labelClassName}`}
              htmlFor={uniqueId}
            >
              {label}
            </label>
          </div>
        ) : type === "dropdown" || type === "select" ? (
          <select
            type={type}
            defaultValue={""}
            id={uniqueId}
            name={name}
            disabled={disabled}
            placeholder={placeholder}
            {...(register
              ? register(name, {
                  ...(required && customField ? { required: true } : null)
                })
              : {
                  onChange: onChange
                })}
            className={`focus:shadow-outline font-inter h-[3rem] w-full appearance-none truncate rounded-[.625rem]  border p-[.625rem] px-3 py-2 leading-tight text-black shadow focus:outline-none focus:ring-0  ${className} ${
              name && errors && errors?.[name] && errors?.[name]?.message
                ? "!border-red-500"
                : "border-gray-200"
            }  ${disabled ? "appearance-none bg-gray-200" : ""}`}
          >
            <option></option>
            {options.map((option, key) => (
              <option value={option} key={key + 1}>
                {option}
              </option>
            ))}
          </select>
        ) : type === "mapping" ? (
          <>
            {mapping ? (
              <select
                id={uniqueId}
                name={name}
                disabled={disabled}
                {...(value ? { value: value } : null)}
                placeholder={placeholder}
                {...(register
                  ? register(name, {
                      ...(required && customField ? { required: true } : null)
                    })
                  : {
                      onChange: onChange
                    })}
                className={`focus:shadow-outline font-inter h-[3rem] w-full truncate rounded-[.625rem]  border p-[.625rem] px-3 py-2 leading-tight text-black shadow focus:outline-none focus:ring-0  ${className} ${
                  name && errors && errors?.[name] && errors?.[name]?.message
                    ? "!border-red-500"
                    : "border-gray-200"
                } ${disabled ? "appearance-none bg-gray-200" : ""}`}
              >
                <option></option>
                {options.map((option, key) => (
                  <option value={option} key={key + 1}>
                    {mapping[option]}
                  </option>
                ))}
              </select>
            ) : (
              `Please Pass the mapping e.g {key:value}`
            )}
          </>
        ) : ["number", "decimal"].includes(type) ? (
          <input
            autoComplete="new-password" // Ensure no browser autocomplete
            aria-autocomplete="none"
            type={type}
            defaultValue={""}
            id={uniqueId}
            name={name}
            disabled={disabled}
            placeholder={placeholder}
            {...(value ? { value: value } : null)}
            {...(register
              ? register(name, {
                  ...(required && customField ? { required: true } : null)
                })
              : {
                  onChange: onChange
                })}
            step={"0.01"}
            min={"0.00"}
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
          />
        ) : ["custom_date"].includes(type) ? (
          <div
            onClick={() => {
              if (disabled) return;
              onToggleModal("custom_date", true);
            }}
            className="relative cursor-pointer"
          >
            <input
              autoComplete="new-password" // Ensure no browser autocomplete
              aria-autocomplete="none"
              type={type}
              defaultValue={""}
              id={uniqueId}
              name={name}
              disabled={true}
              placeholder={placeholder}
              {...(value ? { value: value } : null)}
              {...(register
                ? register(name, {
                    ...(required && customField ? { required: true } : null)
                  })
                : {
                    onChange: onChange
                  })}
              {...(type === "number" ? { step: "0.01" } : null)}
              min={type === "number" ? "0.00" : undefined} //
              className={`focus:shadow-outline bg-brown-main-bg h-[3rem] w-full appearance-none truncate rounded-sm border-[.125rem] border-[#1f1d1a]  text-center text-sm font-normal leading-tight text-[#1f1d1a] shadow focus:outline-none focus:ring-0 ${className} ${
                name && errors && errors?.[name] && errors?.[name]?.message
                  ? "!border-red-500"
                  : "border-gray-200"
              }`}
            />
            {/* p-[.75rem_1rem_.75rem_1rem] */}
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer" />
          </div>
        ) : (
          <input
            autoComplete="new-password" // Ensure no browser autocomplete
            aria-autocomplete="none"
            type={type}
            defaultValue={""}
            id={uniqueId}
            name={name}
            disabled={disabled}
            placeholder={placeholder}
            {...(value ? { value: value } : null)}
            {...(register
              ? register(name, {
                  ...(required && customField ? { required: true } : null)
                })
              : {
                  onChange: onChange
                })}
            {...(type === "number" ? { step: "0.01" } : null)}
            min={type === "number" ? "0.00" : undefined} //
            className={`focus:shadow-outline font-inter h-[3rem] w-full appearance-none rounded-[.625rem] border p-[.625rem] px-3 py-2 leading-tight text-black shadow focus:outline-none focus:ring-0 ${className} ${
              name && errors && errors?.[name] && errors?.[name]?.message
                ? "!border-red-500"
                : "border-gray-200"
            } ${disabled ? "appearance-none bg-gray-200" : ""}`}
          />
        )}

        {showErrorMessage && name && errors && errors?.[name] && (
          <p className="text-field-error absolute inset-x-0 top-[90%] m-auto mt-2 text-[.8rem] italic text-red-500">
            {Capitalize(errors?.[name]?.message, {
              separator: " "
            })}
          </p>
        )}
      </div>

      <Modal
        modalHeader
        title={inputData.modal ? determineModalTitle(inputData?.modal) : ""}
        isOpen={inputData.showModal}
        modalCloseClick={() => onToggleModal(null, false)}
        classes={{
          modalDialog:
            "!px-0 !rounded-[.125rem] h-fit min-h-fit max-h-fit !w-full !max-w-full !min-w-full ",
          modalContent: `!z-10 !mt-0 overflow-hidden !pt-0`,
          modal: "h-full"
        }}
      >
        {inputData.showModal && ["custom_date"].includes(inputData.modal!) ? (
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
    </>
  );
};

export default MkdInput;
function determineModalTitle(modal: string) {
  const modalSplit = modal.split("_");
  const includesDate = modalSplit.includes("date");
  const includesTime = modalSplit.includes("time");

  if (includesDate && includesTime) {
    return "Pick date & time";
  }

  if (includesDate) {
    return "Pick date";
  }

  if (includesTime) {
    return "Select Time";
  }

  const title = Capitalize(modal, { separator: "space" });
  return title;
}
