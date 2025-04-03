import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChevronUpIcon } from "@/assets/svgs";
import { Skeleton as SkeletonLoader } from "@/components/Skeleton";
import { StringCaser } from "@/utils/utils";
import { useContexts } from "@/hooks/useContexts";

const getMaxHeight = (maxHeight: any) => {
  if (maxHeight) {
    return `max-h-[${maxHeight}]`;
  }
  return `max-h-[18.75rem]`;
};

interface SearchableDropdownProps {
  onSelect?: (option: any, clear?: boolean) => void;
  showBorder?: boolean;
  display: string | string[] | { and: string[]; or: string[] };
  value?: string | number;
  uniqueKey: string;
  selector?: any;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  maxHeight?: string;
  height?: string;
  selectedOptions?: any[];
  table?: string;
  errors?: any;
  name?: string;
  className?: string;
  join?: string[];
  filter?: string[];
  mode?: string;
  useExternalData?: boolean;
  externalDataLoading?: boolean;
  externalDataOptions?: any[];
  onReady?: (data: any[]) => void;
  refreshRef?: React.Ref<any>;
  clearRef?: React.Ref<any>;
  showSearchIcon?: boolean;
  required?: boolean;
  dataRetrievalState?: any;
  displaySeparator?: string;
  customOptions?: {
    show: boolean;
    action?: () => void;
    icon?: JSX.Element;
    children?: string;
  }[];
  onPopoverStateChange?: (show: boolean) => void;
  popoverShown?: boolean;
}

const SearchableDropdown = ({
  onSelect,
  display = "display",
  value,
  uniqueKey,
  disabled = false,
  placeholder = "- search -",
  label = "Select",
  maxHeight = "18.75rem",

  table = "",
  errors,
  name,
  className = "w-[23rem]",
  join = [],
  filter = [],

  useExternalData = false,
  externalDataLoading = false,
  externalDataOptions = [],
  onReady,
  refreshRef = null,
  clearRef = null,
  showSearchIcon = false,
  required = false,
  dataRetrievalState,
  displaySeparator = "",
  customOptions = [],
  onPopoverStateChange,
  popoverShown
}: SearchableDropdownProps) => {
  const stringCaser = new StringCaser();
  // Refs
  const uniqueId = uuidv4();
  const uniqueClassName = btoa(uniqueId);

  // Context
  const { globalState, getMany: getList } = useContexts();
  const dropdownModel = globalState[dataRetrievalState ?? table];

  // State
  const [options, setOptions] = useState<any[]>([]);
  const [showLists, setShowLists] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [localOptions, setLocalOptions] = useState<any[]>([]);

  // Hooks
  const memoizedFilter = useMemo(() => filter, [filter]);
  const memoizedExternalDataOptions = useMemo(
    () => JSON.stringify(externalDataOptions),
    [externalDataOptions]
  );

  const getDropdowList = async () => {
    const result = await getList(table, {
      ...{ ...(memoizedFilter?.length ? { filter: memoizedFilter } : null) },
      ...{ ...(join && join?.length ? { join } : null) }
    });
    if (!result.error) {
      if (table === "user") {
        const usersWithFullName = result?.data?.map(
          (item: { first_name: any; last_name: any }) => {
            if (item?.first_name || item?.last_name) {
              return {
                ...item,
                full_name: stringCaser.Capitalize(
                  `${item.first_name} ${item.last_name}`,
                  {
                    separator: " "
                  }
                )
              };
            } else {
              return item;
            }
          }
        );
        setOptions(() => [...usersWithFullName]);
        setLocalOptions(() => [...usersWithFullName]);
      } else {
        setOptions(() => [...result?.data]);
        setLocalOptions(() => [...result?.data]);
      }
      if (value) {
        const selectedOption = result?.data.find(
          (option: { [x: string]: string | number }) =>
            option[uniqueKey] == value
        );
        // console.log("value >>", value);
        // console.log("result?.data >>", result?.data);
        // console.log("selectedOption >>", selectedOption);
        if (selectedOption) {
          setSelectedOption(() => selectedOption);
        }
      }

      if (onReady) {
        onReady(result?.data);
      }
    }
  };

  const displayName = (
    option: any,
    display: string | number | any[] | { and: string[]; or: string[] },
    _where?: string
  ) => {
    if (typeof display === "string") {
      return String(option[display]);
    }
    if (typeof display === "object") {
      if (Array.isArray(display)) {
        // handle array case
        const invalid = display.some((item) => typeof item !== "string");
        if (invalid) {
          return String(option[Object.keys(option)[0]]);
        }
        const result = display.map((key) => option[key]);

        return String(
          result.length
            ? result.join(` ${displaySeparator} `)
            : result.join(" ")
        );
      } else {
        // handle object case

        const isNotOneOrTwoFields = ![1, 2].includes(
          Object.keys(display).length
        );
        if (isNotOneOrTwoFields) {
          return String(option[Object.keys(option)[0]]);
        }

        const isNotOnlyAndOr = Object.keys(display).some(
          (key) => !["and", "or"].includes(key)
        );
        if (isNotOnlyAndOr) {
          return String(option[Object.keys(option)[0]]);
        }

        const andField = display["and"];
        const orField = display["or"];

        if (andField && orField) {
          if (typeof andField === "string" && typeof orField === "string") {
            const andValue = option[andField];
            const orValue = option[orField];

            return String(
              andValue || orValue || option[Object.keys(option)[0]]
            );
          }
          if (Array.isArray(andField) && Array.isArray(orField)) {
            const someAndValuesNotExist = andField.some((key) => !option[key]);
            if (someAndValuesNotExist) {
              const orValue = orField
                .map((key) => {
                  if (option[key]) {
                    return option[key];
                  }
                })
                .filter(Boolean);

              return String(
                orValue.length
                  ? orValue.length
                    ? orValue.join(` ${displaySeparator} `)
                    : orValue.join(" ")
                  : option[Object.keys(option)[0]]
              );
            }

            const andValue = andField
              .map((key) => {
                if (option[key]) {
                  return option[key];
                }
              })
              .filter(Boolean);

            return String(
              andValue.length
                ? andValue.join(` ${displaySeparator} `)
                : andValue.join(" ")
            );
          }

          if (Array.isArray(andField) && typeof orField === "string") {
            const someAndValuesNotExist = andField.some((key) => !option[key]);
            if (someAndValuesNotExist) {
              const orValue = option[orField];

              return String(orValue || option[Object.keys(option)[0]]);
            }
            const andValue = andField
              .map((key) => {
                if (option[key]) {
                  return option[key];
                }
              })
              .filter(Boolean);

            return String(
              andValue.length
                ? andValue.join(` ${displaySeparator} `)
                : andValue.join(" ")
            );
          }

          if (Array.isArray(orField) && typeof andField === "string") {
            const andValue = option[andField];
            if (andValue) {
              return String(andValue);
            }

            const orValue = orField
              .map((key) => {
                if (option[key]) {
                  return option[key];
                }
              })
              .filter(Boolean);

            return String(
              orValue.length
                ? orValue.length
                  ? orValue.join(` ${displaySeparator} `)
                  : orValue.join(" ")
                : option[Object.keys(option)[0]]
            );
          }
        } else if (andField && !orField) {
          if (typeof andField === "string") {
            const andValue = option[andField];

            return String(andValue || option[Object.keys(option)[0]]);
          }
          if (Array.isArray(andField)) {
            const andValue = andField
              .map((key) => {
                if (option[key]) {
                  return option[key];
                }
              })
              .filter(Boolean);

            return String(
              andValue.length
                ? andValue.length
                  ? andValue.join(` ${displaySeparator} `)
                  : andValue.join(" ")
                : option[Object.keys(option)[0]]
            );
          }
        } else if (!andField && orField) {
          if (typeof orField === "string") {
            const orValue = option[orField];

            return String(orValue || option[Object.keys(option)[0]]);
          }

          if (Array.isArray(orField)) {
            const orValue = orField
              .map((key) => {
                if (option[key]) {
                  return option[key];
                }
              })
              .filter(Boolean);

            return String(
              orValue.length
                ? orValue.length
                  ? orValue.join(` ${displaySeparator} `)
                  : orValue.join(" ")
                : option[Object.keys(option)[0]]
            );
          }
        }
      }
    }
  };
  const selectOption = (
    option: React.SetStateAction<null>,
    clear = false,
    externalUpdate = true
  ) => {
    // setSelectedOption(option[display])
    if (externalUpdate && !onSelect) {
      return;
    }
    if (clear) {
      setSelectedOption(null);
      onSelect && onSelect(null, true);
      return setShowLists(false);
    }
    setSelectedOption(option);
    if (externalUpdate) {
      onSelect && onSelect(option);
    }
    if (searchValue) {
      setSearchValue("");
    }
    if (options.length && options?.length > localOptions?.length) {
      setLocalOptions(options);
    }
    if (showLists) {
      setShowLists(false);
    }
    // setShowLists((prev) => !prev);
  };

  // const isChecked = useCallback(
  //   (option: { [x: string]: any; }) => {
  //     if (uniqueKey) {
  //       const exist = selectedOptions.find(
  //         (opt) => opt[uniqueKey] === option[uniqueKey]
  //       );
  //       if (exist) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }
  //   },
  //   [options, localOptions, selectedOptions]
  // );
  const getDisplayValue = useCallback(() => {
    if (showLists || searchValue) {
      return searchValue;
    } else if (selectedOption) {
      return displayName(selectedOption, display, "selectedOption in value");
    } else if (value && options && options?.length) {
      const valueOption = options?.find(
        (opt) => opt[uniqueKey] === Number(value)
      );
      if (valueOption) {
        return displayName(valueOption, display, "options in value");
      } else {
        return "";
      }
    } else {
      return "";
    }
  }, [showLists, value, searchValue, selectOption, options]);

  const onSetSearchValue = useCallback(
    (value: string) => {
      // console.log("onSetSearchValue")
      setSearchValue(value);
      if (value) {
        const matches = options.filter((option) =>
          displayName(option, display, "search")
            ?.toLowerCase()
            .includes(value?.toLowerCase())
        );
        setLocalOptions(matches);
      } else {
        setLocalOptions(options);
      }
      // setLedgerSelected(false)
    },
    [searchValue]
  );

  useEffect(() => {
    const abortController = new AbortController();

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${uniqueClassName}`)) {
        setShowLists((prev) => {
          if (prev) {
            return !prev;
          }
          return prev;
        });
      }
    };

    window.addEventListener("click", handleClick, {
      signal: abortController.signal
    });

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    // console.log("memoizedExternalDataOptions >>", memoizedExternalDataOptions);
    if (!useExternalData && !options?.length) {
      getDropdowList();
    }
  }, [useExternalData]);

  useEffect(() => {
    if (useExternalData) {
      setOptions(() => [...externalDataOptions]);
      setLocalOptions(() => [...externalDataOptions]);
    }
  }, [useExternalData, memoizedExternalDataOptions]);

  // useEffect(() => {
  //   if (["reactive"].includes(mode)) {
  //     console.log("options?.length >>", options?.length);
  //     // getDropdowList();
  //   }
  // }, [memoizedFilter]);

  useEffect(() => {
    if (onPopoverStateChange) {
      if (!popoverShown && showLists) {
        onPopoverStateChange(true);
      }
    }
  }, [popoverShown, showLists]);
  // console.log("selectedOption >>", selectedOption);
  return (
    <>
      <button
        ref={refreshRef}
        type="button"
        hidden
        onClick={() => {
          // console.log("value >>", value);
          if (useExternalData) {
            if (localOptions?.length) {
              const option = localOptions.find(
                (item) => item[uniqueKey] === value
              );

              if (option) {
                // console.log("localOptions option >>", option);
                selectOption(option, false, false);
              }
            } else if (externalDataOptions?.length) {
              const option = externalDataOptions.find(
                (item) => item[uniqueKey] === value
              );

              if (option) {
                // console.log("externalDataOptions option >>", option);
                selectOption(option, false, false);
              }
            }
            // setOptions(() => [...externalDataOptions]);
            // setLocalOptions(() => [...externalDataOptions]);
          } else {
            getDropdowList();
          }
        }}
      ></button>
      <button
        ref={clearRef}
        type="button"
        hidden
        onClick={() => setSelectedOption(null)}
      ></button>
      <div className={`relative ${uniqueClassName} ${className}`}>
        {label && (
          <label className="block text-[.875rem] mb-2 text-sm font-bold text-black cursor-pointer">
            {label}
            {required && <sup className="text-[.825rem] text-red-600">*</sup>}
          </label>
        )}
        {/* <div
            className={`text-text-secondary group relative w-full min-w-full max-w-full rounded border text-base shadow-md ${
              showBorder ? "border" : ""}`}
          > */}
        {externalDataLoading || dropdownModel?.loading ? (
          <SkeletonLoader
            count={1}
            counts={[2]}
            className={`!h-[3rem] !max-h-[3rem] !min-h-[3rem] !gap-0 overflow-hidden rounded-[.625rem] !bg-[#ebebeb] !p-0 ${className}`}
          />
        ) : (
          <>
            <div
              className={`flex h-[3rem] w-full items-center justify-normal rounded-[.625rem] border pl-3 shadow ${
                disabled ? "bg-gray-200" : "bg-white"
              }`}
            >
              {showSearchIcon && !disabled && (
                <div className="!w-4 ">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
              <div className="grow">
                <input
                  type="text"
                  disabled={disabled}
                  placeholder={placeholder}
                  id={uniqueId}
                  className={`${
                    disabled ? "bg-gray-200" : "bg-white"
                  } showListButton h-full w-full appearance-none truncate rounded-[.625rem] border-0 px-3  py-2 leading-tight text-black focus:outline-none focus:outline-0 focus:ring-0`}
                  // title={selectedOption && displayName(selectedOption, display, "title")}
                  value={getDisplayValue()}
                  onFocus={() => {
                    if (!showLists) {
                      setShowLists(true);
                    }
                  }}
                  // onBlur={() => showLists && setShowLists(false)}
                  onChange={(e) =>
                    onSetSearchValue(e.target.value.toLowerCase())
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              {!disabled && (
                <div className="flex flex-col justify-center items-center mr-3">
                  <ChevronUpIcon className="p-0 w-5 h-4" stroke="#717179" />
                  <ChevronUpIcon
                    className="p-0 w-5 h-4 rotate-180"
                    stroke="#717179"
                  />
                </div>
              )}
            </div>

            <div
              style={{
                zIndex: 99999999
                // maxHeight,
                // height: height,
                // minHeight: height,
              }}
              className={`group-hover:block ${
                showLists ? "block" : "hidden"
              } absolute top-full h-fit w-full overflow-y-auto rounded-b-md bg-white py-3 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${getMaxHeight(
                maxHeight
              )}`}
            >
              <div className="">
                <div
                  className={`flex h-[2.8rem] min-h-[2.8rem] cursor-pointer items-center justify-start gap-5 truncate px-3 py-2 text-sm font-normal capitalize text-gray-900 hover:bg-primary-light
                  ${!selectedOption && !value ? "bg-primary-light" : ""}
                  `}
                  onClick={() => selectOption(null, true)}
                >
                  None
                </div>
                {customOptions.length &&
                customOptions.find((customOption) => customOption?.show)
                  ? customOptions?.map((option, optionIndex) => {
                      if (option?.show) {
                        return (
                          <div
                            key={optionIndex}
                            title={
                              option?.children &&
                              typeof option?.children === "string"
                                ? option?.children
                                : option?.icon &&
                                    typeof option?.icon === "string"
                                  ? option?.icon
                                  : ""
                            }
                            className={`flex h-[2.8rem] min-h-[2.8rem] cursor-pointer items-center justify-start gap-3 truncate px-3 py-2 text-sm font-normal capitalize text-gray-900 hover:bg-primary-light `}
                            onClick={() => option?.action && option?.action()}
                          >
                            {option?.icon ? option.icon : null}
                            {option?.children ? option.children : null}
                          </div>
                        );
                      }
                    })
                  : null}
                {localOptions.length
                  ? localOptions?.map((option, index) => {
                      if (option?.searchableType === "section") {
                        return (
                          <div
                            aria-disabled={true}
                            key={index}
                            className={`flex h-[2.8rem] min-h-[2.8rem] w-full items-center justify-start gap-5 truncate bg-black px-3 py-2 text-sm font-bold capitalize text-white`}
                          >
                            {option?.display}
                          </div>
                        );
                      }
                      return (
                        <button
                          type="button"
                          key={index}
                          title={
                            option && displayName(option, display, "title")
                          }
                          className={`flex h-[2.8rem] min-h-[2.8rem] w-full cursor-pointer items-center justify-start gap-5 truncate px-3 py-2 text-sm font-normal capitalize text-gray-900 hover:bg-primary-light ${
                            selectedOption &&
                            ((value && value === option[uniqueKey]) ||
                              displayName(
                                option,
                                display,
                                "item condition 1"
                              ) ===
                                displayName(
                                  selectedOption,
                                  display,
                                  "item condition 2"
                                ))
                              ? "bg-primary-light"
                              : ""
                          } `}
                          onClick={() => selectOption(option)}
                        >
                          {displayName(option, display, "display value")}
                        </button>
                      );
                    })
                  : null}
              </div>
            </div>
            {/* </div> */}

            {errors && name && errors?.[name!] && (
              <p className="text-field-error absolute inset-x-0 top-[90%] m-auto mt-2 text-[.8rem] italic text-red-500">
                {stringCaser.Capitalize(errors?.[name!]?.message, {
                  separator: " "
                })}
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default memo(SearchableDropdown);
