import { memo, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FilterOptions, FilterJoinDropdown, FilterDateRange } from "./index";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdButton } from "@/components/MkdButton";
import { InteractiveButton } from "@/components/InteractiveButton";
import { StringCaser } from "@/utils/utils";
import { MkdInput } from "@/components/MkdInput";
import { Column } from "@/interfaces";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface FilterDropdownProps {
  onSubmit: () => void;
  columns?: Column[];
  selectedOptions?: {
    accessor: string;
    operator: string;
    value: string;
    uid: string;
    config?: {
      format?: string;
    };
  }[];
  onColumnClick?: (column: string, operation?: string, config?: any) => void;
  setOptionValue: (key: string, value: any, uid: string) => void;
  removeSelectedOption: (uid: string[]) => void;
  onOptionValueChange?: (value: any) => void;
  onClose: () => void;
}

const FilterDropdown = ({
  onSubmit,
  columns = [],
  selectedOptions = [],
  onColumnClick,
  setOptionValue,
  removeSelectedOption,
  onClose,
}: FilterDropdownProps) => {
  const { state } = useTheme();
  const mode = state?.theme;
  const [_showFilterOptions, setShowFilterOptions] = useState(false);
  const stringCaser = new StringCaser();
  // console.log("selectedOptions >>", selectedOptions);
  return (
    <div
      style={{
        backgroundColor: THEME_COLORS[mode].BACKGROUND,
        boxShadow: `0 25px 50px -12px ${THEME_COLORS[mode].SHADOW}40`,
      }}
      className="filter-form-holder z-[9999999] grid h-full max-h-full min-h-full w-full min-w-full max-w-full grid-cols-1 grid-rows-[auto_1fr_auto_auto] overflow-hidden rounded-md p-5 transition-colors duration-200"
    >
      <div className="relative flex items-center justify-end">
        <MkdButton
          type="button"
          // onClick={() => setShowFilterOptions((prev) => !prev)}
          // disabled={true}
          className={`!shadow-none peer !h-fit !max-h-fit !min-h-fit w-fit !border-0 !bg-transparent !p-0 !py-0 font-[700] !text-primary !underline`}
        >
          Add Filter
        </MkdButton>

        <LazyLoad>
          <FilterOptions
            columns={columns}
            setShowFilterOptions={setShowFilterOptions}
            onColumnClick={(column, operation, config) =>
              onColumnClick && onColumnClick(column, operation, config)
            }
          />
        </LazyLoad>
      </div>
      <div
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   console.log("e >>", e);
        //   if (onSubmit) {
        //     onSubmit();
        //   }
        // }}
        className="overflow-y-auto"
      >
        <div className="!h-full !max-h-full !min-h-full w-full overflow-y-auto">
          {selectedOptions?.map((option, index) => (
            <div
              key={index}
              style={{ color: THEME_COLORS[mode].TEXT_SECONDARY }}
              className="mb-2 grid w-full grid-cols-[1fr_auto] items-end justify-between gap-2 transition-colors duration-200"
            >
              {option?.config?.format &&
              ["date_range"].includes(option?.config?.format) ? (
                <LazyLoad>
                  <FilterDateRange
                    data={option}
                    setValue={setOptionValue}
                    field={"value"}
                  />
                </LazyLoad>
              ) : null}

              {!option?.config?.format && columns?.length ? (
                <>
                  {columns.map((columnData, columnDataIndex) => {
                    if (
                      (columnData?.selected_column &&
                        columnData?.accessor === option?.accessor) ||
                      columnData?.header === option?.accessor ||
                      columnData?.filter_field === option?.accessor
                    ) {
                      if (columnData?.mappingExist) {
                        return (
                          <>
                            <div className="grid w-full grid-cols-1 items-start justify-start">
                              <label
                                style={{ color: THEME_COLORS[mode].TEXT }}
                                className="mb-2 block cursor-pointer text-left text-sm font-bold transition-colors duration-200"
                                htmlFor={option?.uid}
                              >
                                {stringCaser.Capitalize(columnData?.accessor, {
                                  separator: "space",
                                })}
                              </label>
                              <select
                                style={{
                                  backgroundColor: THEME_COLORS[mode].INPUT,
                                  color: THEME_COLORS[mode].TEXT,
                                  borderColor: THEME_COLORS[mode].BORDER,
                                }}
                                className="!h-[3rem] !max-h-[3rem] !min-h-[3rem] appearance-none rounded-md border outline-0 focus:border-primary focus:ring-primary transition-colors duration-200"
                                onChange={(e) => {
                                  setOptionValue &&
                                    setOptionValue(
                                      "value",
                                      e.target.value,
                                      option?.uid
                                    );
                                }}
                                value={option?.value}
                              >
                                <option
                                  value={""}
                                  selected={!option?.value}
                                ></option>
                                {Object.keys(columnData?.mappings ?? {}).map(
                                  (columnDataKey, index) => (
                                    <option
                                      key={index}
                                      value={columnDataKey}
                                      selected={columnDataKey === option?.value}
                                    >
                                      {columnData?.mappings?.[columnDataKey]}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </>
                        );
                      }

                      if (columnData?.join) {
                        return (
                          <div
                            key={columnDataIndex}
                            className="flex w-full items-end justify-start"
                          >
                            <FilterJoinDropdown
                              columnData={columnData}
                              option={option}
                              setOptionValue={setOptionValue}
                            />
                          </div>
                        );
                      }
                      return (
                        <div
                          key={columnDataIndex}
                          className="flex w-full items-end justify-start !px-[.0625rem]"
                        >
                          <LazyLoad>
                            <MkdInput
                              label={stringCaser.Capitalize(
                                columnData?.accessor,
                                {
                                  separator: " ",
                                }
                              )}
                              placeholder="Enter value..."
                              value={option?.value}
                              onChange={(e: any) => {
                                setOptionValue &&
                                  setOptionValue(
                                    "value",
                                    e.target.value,
                                    option?.uid
                                  );
                              }}
                              labelClassName="text-left"
                              className="!h-[3rem] !max-h-[3rem] !min-h-[3rem] !w-full !min-w-full !max-w-full !rounded-md !border !border-border !px-3 !py-2 !leading-tight !text-text !outline-none focus:border-primary focus:ring-primary"
                            />
                          </LazyLoad>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </>
              ) : null}

              <RiDeleteBin5Line
                style={{
                  color:
                    THEME_COLORS[mode].DANGER ||
                    THEME_COLORS[mode].TEXT_SECONDARY,
                }}
                className="cursor-pointer self-end text-2xl transition-colors duration-200"
                onClick={() => {
                  removeSelectedOption([option?.uid]);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="my-5  flex w-full  gap-5">
        <MkdButton
          type="button"
          onClick={() => onClose()}
          // disabled={true}
          className="!text-text !grow self-end !bg-transparent font-bold"
        >
          Cancel
        </MkdButton>

        <InteractiveButton
          type="button"
          onClick={() => {
            if (onSubmit) {
              onClose();
              onSubmit();
            }
          }}
          // loading={true}
          // disabled={selectedOptions?.length === 0}
          className={`!grow self-end rounded px-4 py-2 font-bold capitalize text-white`}
        >
          Apply and Close
        </InteractiveButton>
      </div>
      <div className="flex items-center justify-center">
        <MkdButton
          type="button"
          onClick={() =>
            removeSelectedOption &&
            removeSelectedOption(selectedOptions?.map((item) => item?.uid))
          }
          disabled={selectedOptions?.length === 0 ? true : false}
          className={`!shadow-none !text-text w-fit !border-0 !bg-transparent font-[700] !underline`}
        >
          Clear all Filters
        </MkdButton>
      </div>
    </div>
  );
};

export default memo(FilterDropdown);
