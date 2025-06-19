import React from "react";
import { FilterIcon } from "lucide-react";
import { DisplayEnum } from "@/utils/Enums";
import { ColumnDataState } from "@/interfaces";
import { LazyLoad } from "@/components/LazyLoad";
import { ModalSidebar } from "@/components/ModalSidebar";
import { FilterDropdown, FilterDisplays } from "./index";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

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
  onOptionValueChange,
}: MkdListTableFilterProps) => {
  const { state } = useTheme();
  const mode = state?.theme;
  const [openFilter, setOpenFilter] = React.useState(false);
  // const [showFilterOptions, setShowFilterOptions] = React.useState(false);

  return (
    <>
      <div
        style={{ backgroundColor: THEME_COLORS[mode].BACKGROUND }}
        className="relative flex w-fit items-center justify-between rounded transition-colors duration-200"
      >
        <div
          style={{ color: THEME_COLORS[mode].TEXT }}
          className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center transition-colors duration-200"
        >
          <LazyLoad>
            <FilterDisplays
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
              <div
                style={{ color: THEME_COLORS[mode].TEXT }}
                className="flex items-center gap-2 font-inter text-[1.125rem] font-bold leading-[1.5rem] transition-colors duration-200"
              >
                <FilterIcon /> Filter
              </div>
            }
            side="left"
            headerClassName={"bg-background text-text"}
            headerContentClassName={"text-text"}
            closePosition={2}
            classes={{
              modalBody: "bg-background",
            }}
          >
            <LazyLoad>
              <FilterDropdown
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
