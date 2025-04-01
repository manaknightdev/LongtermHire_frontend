import { MkdDebounceInput } from "@/components/MkdDebounceInput";
import { memo, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  MkdListTableFilterOptions,
  FilterJoinDropdown,
  MkdListTableFilterDateRange
} from "./index";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdButton } from "@/components/MkdButton";
import { InteractiveButton } from "@/components/InteractiveButton";
import { StringCaser } from "@/utils/utils";
import { MkdInput } from "@/components/MkdInput";

interface MkdListTableFilterDropdownV2Props {
  onSubmit: () => void;
  columns?: {
    accessor: string;
    header: string;
    filter_field: string;
    selected_column: boolean;
    join?: string;
    mappings?: { [key: string | number]: any };
    mappingExist?: boolean;
  }[];
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
  setSelectedOptions: any;
  onOptionValueChange?: (value: any) => void;
  onClose: () => void;
}

const MkdListTableFilterDropdownV2 = ({
  onSubmit,
  columns = [],
  selectedOptions = [],
  onColumnClick,
  setOptionValue,
  setSelectedOptions,
  onClose
}: MkdListTableFilterDropdownV2Props) => {
  const [_showFilterOptions, setShowFilterOptions] = useState(false);
  const { Capitalize } = new StringCaser();
  // console.log("selectedOptions >>", selectedOptions);
  return (
    <div className="filter-form-holder  z-[9999999] grid h-full max-h-full min-h-full w-full min-w-full max-w-full grid-cols-1 grid-rows-[auto_1fr_auto_auto] overflow-hidden rounded-md bg-white p-5 shadow-xl">
      <div className="relative flex items-center justify-end">
        <MkdButton
          type="button"
          // onClick={() => setShowFilterOptions((prev) => !prev)}
          // disabled={true}
          className={`!shadow-none peer !h-fit !max-h-fit !min-h-fit w-fit !border-0  !bg-white !p-0 !py-0 font-[700] !text-black !underline`}
        >
          Add Filter
        </MkdButton>

        <LazyLoad>
          <MkdListTableFilterOptions
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
              className="mb-2 grid w-full grid-cols-[1fr_auto] items-end justify-between gap-2 text-gray-600"
            >
              {option?.config?.format &&
              ["date_range"].includes(option?.config?.format) ? (
                <LazyLoad>
                  <MkdListTableFilterDateRange
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
                                className="mb-2 block cursor-pointer text-left text-sm font-bold text-gray-700"
                                htmlFor={option?.uid}
                              >
                                {Capitalize(columnData?.accessor, {
                                  separator: "space"
                                })}
                              </label>
                              <select
                                className="!h-[3rem] !max-h-[3rem] !min-h-[3rem] appearance-none rounded-md border !border-soft-200 outline-0 focus:border-primary focus:ring-primary"
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
                              label={Capitalize(columnData?.accessor, {
                                separator: " "
                              })}
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
                              className="!h-[3rem] !max-h-[3rem] !min-h-[3rem] !w-full !min-w-full !max-w-full !rounded-md !border !border-soft-200 !px-3 !py-2 !leading-tight !text-gray-700 !outline-none focus:border-soft-200 focus:ring-soft-200"
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
                className="cursor-pointer self-end text-2xl !text-sub-500"
                onClick={() => {
                  setSelectedOptions((prev: any[]) =>
                    prev.filter((op: any) => op.uid !== option?.uid)
                  );
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
          className="!text-black !grow self-end !bg-transparent font-bold"
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
          onClick={() => setSelectedOptions && setSelectedOptions(() => [])}
          disabled={selectedOptions?.length === 0 ? true : false}
          className={`!shadow-none !text-black w-fit !border-0 !bg-white font-[700] !underline`}
        >
          Clear all Filters
        </MkdButton>
      </div>
    </div>
  );
};

export default memo(MkdListTableFilterDropdownV2);
