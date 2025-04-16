import { Fragment, useState, memo, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@/assets/svgs";
import selectClasses from "./CustomSelect.module.css";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface CustomSelectProps {
  options: any[];
  initialValue: any;
  showBorder: boolean;
  disabled: boolean;
  onSelectedChange: (selected: any) => void;
  label: string;
}

const CustomSelect = ({
  options = [],
  initialValue,
  showBorder,
  disabled,
  onSelectedChange,
  label,
}: CustomSelectProps) => {
  const [selected, setSelected] = useState(initialValue);

  useEffect(() => {
    if (onSelectedChange) {
      onSelectedChange(selected);
    }
  }, [selected]);

  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

  return (
    <Listbox disabled={disabled} value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative grow">
            {selected && label && (
              <label className=" text-sm font-bold text-gray-700">
                {label}
              </label>
            )}
            <Listbox.Button
              style={{ borderColor: "#aaa", zIndex: 10 }}
              className={`h-full max-h-full min-h-full w-full text-[.875rem] ${
                showBorder ? "border-b border-l-0 border-r-0 border-t-0 " : ""
              } cursor-pointer rounded !border-primaryBlue pl-2 font-normal leading-[1.5rem] tracking-[.0313rem] text-[#636363]`}
            >
              <span className="flex max-h-[2rem] min-h-[2rem] max-w-full items-center">
                <span
                  title={selected}
                  className="block max-h-full min-h-full max-w-full truncate"
                >
                  {!selected
                    ? label || "Select"
                    : selected && selected.length > 35
                      ? `${selected.substring(0, 30)}...`
                      : selected}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpIcon
                  className={`h-[.5919rem] w-[.9375rem] rotate-180 cursor-pointer`}
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                style={{ zIndex: 999999 }}
                className={`absolute z-[9999999] max-h-56 w-full overflow-auto rounded-b-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${selectClasses.scrollBarNone}`}
              >
                {options?.map((option, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-primary-light" : "text-gray-900",
                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                          options.length - 1 === index ? "rounded-b-md" : ""
                        }`
                      )
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex cursor-pointer items-center">
                          <span
                            title={option}
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {option}
                          </span>
                        </div>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default memo(CustomSelect);
