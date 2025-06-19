import { ColumnsIcon, FilterIcon, SortAscIcon } from "lucide-react";
import { DisplayEnum } from "@/utils/Enums";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface MkdListTableFilterDisplaysProps {
  columns?: {
    header: string;
    selected_column: boolean;
  }[];
  selectedOptions?: any[];
  setOpenFilter?: () => void;
  setOpenColumns?: () => void;
  display?: DisplayEnum[];
}

const MkdListTableFilterDisplays = ({
  columns = [],
  selectedOptions = [],
  setOpenFilter,
  setOpenColumns,
  display = [DisplayEnum.FILTER],
}: MkdListTableFilterDisplaysProps) => {
  const { state } = useTheme();
  const mode = state?.theme;
  return (
    <div className="flex w-fit items-center justify-start gap-3">
      {display.includes(DisplayEnum.ROWS) ? (
        <button
          type="button"
          style={{ color: THEME_COLORS[mode].TEXT }}
          className="flex items-center gap-2 transition-colors duration-200"
        >
          <ColumnsIcon />
          <span>2000/2005</span>
          <span>Rows</span>
        </button>
      ) : null}
      {display.includes(DisplayEnum.COLUMNS) ? (
        <button
          type="button"
          onClick={() => setOpenColumns && setOpenColumns()}
          style={{ color: THEME_COLORS[mode].TEXT }}
          className="flex items-center gap-2 transition-colors duration-200"
        >
          <ColumnsIcon />
          <span>
            {
              columns.filter(
                (item) =>
                  !["Row", "Action"].includes(item?.header) &&
                  item?.selected_column
              ).length
            }
            /
            {
              columns.filter(
                (item) => !["Row", "Action"].includes(item?.header)
              ).length
            }
          </span>
          <span>Columns</span>
        </button>
      ) : null}
      {display.includes(DisplayEnum.FILTER) ? (
        <button
          type="button"
          style={{ color: THEME_COLORS[mode].TEXT }}
          className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-1 transition-colors duration-200"
          onClick={() => setOpenFilter && setOpenFilter()}
        >
          <FilterIcon />

          <span className="grow">Filters</span>
          {selectedOptions?.length > 0 && (
            <span
              style={{
                backgroundColor: THEME_COLORS[mode].PRIMARY,
                color:
                  THEME_COLORS[mode].PRIMARY_TEXT ||
                  THEME_COLORS[mode].BACKGROUND,
              }}
              className="flex !h-6 !w-6 items-center justify-center rounded-full text-start transition-colors duration-200"
            >
              {selectedOptions?.length > 0 ? selectedOptions?.length : null}
            </span>
          )}
        </button>
      ) : null}
      {display.includes(DisplayEnum.SORT) ? (
        <button
          type="button"
          style={{ color: THEME_COLORS[mode].TEXT }}
          className="flex items-center gap-2 transition-colors duration-200"
        >
          <SortAscIcon />
          <span>Sort</span>
        </button>
      ) : null}
    </div>
  );
};

export default MkdListTableFilterDisplays;
