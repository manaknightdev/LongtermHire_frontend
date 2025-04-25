import React from "react";
import MkdListTableFilterDisplays from "./MkdListTableFilterDisplays";
import { LazyLoad } from "@/components/LazyLoad";
import { ModalSidebar } from "@/components/ModalSidebar";
import MkdListTableFilterDropdownV2 from "./MkdListTableFilterDropdown/MkdListTableFilterDropdownV2";
import { FilterIcon } from "lucide-react";
import { DisplayEnum } from "@/utils/Enums";
import { ColumnDataState } from "@/interfaces";
interface MkdListTableFilterProps {
  onSubmit: () => void;
  columnData: ColumnDataState;
  onColumnClick: (column: string, operation?: string, config?: any) => void;
  setOptionValue: (field: string, value: any, uid: any) => void;
  selectedOptions: any[];
  setSelectedOptions?: React.Dispatch<React.SetStateAction<any[]>>;
  removeSelectedOption: (uid: string[]) => void;
  filterDisplays?: DisplayEnum[];
  onOptionValueChange?: (value: any) => void;
}

const MkdListTableFilter = ({
  onSubmit,
  columnData,
  onColumnClick,
  setOptionValue,
  selectedOptions,
  removeSelectedOption,
  filterDisplays = [],
  onOptionValueChange
}: MkdListTableFilterProps) => {
  const [openFilter, setOpenFilter] = React.useState(false);
  // const [showFilterOptions, setShowFilterOptions] = React.useState(false);

  return (
    <>
      <div className="relative flex w-fit items-center justify-between rounded bg-white">
        <div className="flex w-full flex-col items-start justify-between gap-4 text-gray-700 md:flex-row  md:items-center">
          <LazyLoad>
            <MkdListTableFilterDisplays
              columns={columnData?.columns}
              selectedOptions={selectedOptions}
              display={[DisplayEnum.FILTER, ...filterDisplays]}
              setOpenFilter={() => setOpenFilter((prev) => !prev)}
            />
          </LazyLoad>
        </div>

        <LazyLoad>
          <ModalSidebar
            isModalActive={openFilter}
            closeModalFn={() => setOpenFilter(false)}
            customMinWidthInTw={`md:!w-[25%] !w-full `}
            showHeader
            title={
              <div className="flex items-center gap-2 font-inter text-[1.125rem] font-bold leading-[1.5rem] text-[#18181B]">
                <FilterIcon /> Filter
              </div>
            }
            side="left"
            headerClassName={"bg-white text-black"}
            headerContentClassName={"text-black"}
            closePosition={2}
            classes={{
              modalBody: "bg-white"
            }}
          >
            <LazyLoad>
              <MkdListTableFilterDropdownV2
                onSubmit={onSubmit}
                columns={columnData?.columns}
                onColumnClick={onColumnClick}
                setOptionValue={setOptionValue}
                selectedOptions={selectedOptions}
                onClose={() => setOpenFilter(false)}
                onOptionValueChange={onOptionValueChange}
                removeSelectedOption={removeSelectedOption}
              />
            </LazyLoad>
          </ModalSidebar>
        </LazyLoad>
      </div>
    </>
  );
};

export default MkdListTableFilter;
