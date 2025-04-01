import { memo } from "react";

import { SearchableDropdown } from "@/components/SearchableDropdown";
import { StringCaser } from "@/utils/utils";

interface FilterJoinDropdownProps {
  columnData?: {
    accessor: string;
    header: string;
    filter_field?: string;
    selected_column?: boolean;
    join?: string;
    mappings?: { [key: string | number]: any };
    mappingExist?: boolean;
  };
  option?: {
    value: string;
    uid: string;
  };
  setOptionValue: (key: string, value: any, uid: string) => void;
}

const FilterJoinDropdown = ({
  columnData,
  option,
  setOptionValue
}: FilterJoinDropdownProps) => {
  const { Capitalize } = new StringCaser();

  return (
    <>
      {columnData?.join && ["user"].includes(columnData?.join) ? (
        <SearchableDropdown
          table="user"
          className="flex w-full flex-col items-start "
          uniqueKey={"id"}
          displaySeparator={"-"}
          label={Capitalize(columnData?.accessor, {
            separator: " "
          })}
          display={[columnData?.accessor]}
          placeholder={columnData?.accessor}
          filter={[`role,cs,user`, `is_company,eq,1`]}
          onSelect={(data: { id: any }, clear: any) => {
            if (clear) {
              setOptionValue && setOptionValue("value", "", option?.uid!);
            } else {
              setOptionValue && setOptionValue("value", data?.id, option?.uid!);
            }
          }}
          value={option?.value}
          // errors={errors}
          // disabled={disableCustomer}
        />
      ) : null}
      {columnData?.join &&
      [
        "warehouse",
        "warehouse_location",
        "location_type",
        "campaign",
        "division",
        "rate_card"
      ].includes(columnData?.join) ? (
        <SearchableDropdown
          className="flex w-full flex-col items-start "
          uniqueKey={"id"}
          displaySeparator={"-"}
          table={columnData?.join}
          label={Capitalize(columnData?.accessor, {
            separator: " "
          })}
          display={[columnData?.accessor]}
          placeholder={columnData?.accessor}
          onSelect={(data: { id: any }, clear: any) => {
            if (clear) {
              setOptionValue && setOptionValue("value", "", option?.uid!);
            } else {
              setOptionValue && setOptionValue("value", data?.id, option?.uid!);
            }
          }}
          value={option?.value}
          // errors={errors}
          // disabled={disableCustomer}
        />
      ) : null}
    </>
  );
};

export default memo(FilterJoinDropdown);
