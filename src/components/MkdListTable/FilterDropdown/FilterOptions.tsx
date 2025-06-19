import { StringCaser } from "@/utils/utils";
import { useSDK } from "@/hooks/useSDK";
import { Column } from "@/interfaces";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

const excludedFields = [
  "row",
  "action",
  "photo",
  "image",
  "file",
  "note",
  "files",
  "photos",
  "images",
  "image",
  "thumbnial",
  "thumbnails",
  "warehouse details",
  "regions",
  "Regions",
  "allowed customers",
  "allowed customer",
  "allowed_customers",
  "allowed_customer",
];

interface FilterOptionsProps {
  selectedOptions?: string[];
  columns?: Column[];
  onColumnClick?: (column: string, operation?: string, config?: any) => void;
  setShowFilterOptions?: (show: boolean) => void;
}

const FilterOptions = ({ columns = [], onColumnClick }: FilterOptionsProps) => {
  const { operations } = useSDK();
  const { state } = useTheme();
  const mode = state?.theme;
  const stringCaser = new StringCaser();

  return (
    <div
      style={{
        maxHeight: "31.25rem",
        height: "fit-content",
        overflowY: "auto",
        backgroundColor: THEME_COLORS[mode].BACKGROUND,
        color: THEME_COLORS[mode].TEXT_SECONDARY,
        boxShadow: `0 4px 6px -1px ${THEME_COLORS[mode].SHADOW}20, 0 2px 4px -1px ${THEME_COLORS[mode].SHADOW}10`,
      }}
      className="absolute top-[-2000%] z-10 m-auto w-[12.5rem] min-w-[12.5rem] max-w-[12.5rem] p-2 opacity-0 transition-all hover:top-[80%] hover:opacity-100 focus:top-[80%] focus:opacity-100 peer-focus:top-[80%] peer-focus:opacity-100 peer-focus-visible:top-[80%] peer-focus-visible:opacity-100"
    >
      {columns
        .map((column) => {
          if (
            column?.hasOwnProperty("isFilter") &&
            column?.isFilter &&
            column?.hasOwnProperty("selected_column") &&
            column?.selected_column
          ) {
            return (
              <button
                type="button"
                key={column?.header}
                style={{ color: THEME_COLORS[mode].TEXT }}
                className={`h-[2.25rem] w-full cursor-pointer text-left font-inter text-[.875rem] font-[400] capitalize leading-[1.25rem] tracking-[-0.006em] transition-colors duration-200 hover:bg-background-secondary`}
                onClick={() => {
                  if (column.join) {
                    onColumnClick && onColumnClick(column?.header);
                  } else {
                    onColumnClick && onColumnClick(column?.accessor);
                  }
                }}
              >
                {stringCaser.Capitalize(column?.header, {
                  separator: "",
                })}
              </button>
            );
          } else if (
            !column?.hasOwnProperty("isFilter") &&
            column?.hasOwnProperty("selected_column")
          ) {
            if (
              !excludedFields.includes(column?.header.toLowerCase()) &&
              column?.selected_column
            )
              return (
                <button
                  type="button"
                  key={column.header}
                  style={{ color: THEME_COLORS[mode].TEXT }}
                  className={` h-[2.25rem] w-full cursor-pointer text-left font-inter text-[.875rem] font-[400] capitalize leading-[1.25rem] tracking-[-0.006em] transition-colors duration-200 hover:bg-background-secondary`}
                  onClick={() => {
                    if (column.join) {
                      onColumnClick &&
                        onColumnClick(column?.filter_field || column?.header);
                    } else {
                      onColumnClick && onColumnClick(column?.accessor);
                    }
                  }}
                >
                  {stringCaser.Capitalize(column.header, {
                    separator: "",
                  })}
                </button>
              );
          }
        })
        .filter(Boolean)}

      <button
        type="button"
        style={{ color: THEME_COLORS[mode].TEXT }}
        className={`h-[2.25rem] w-full cursor-pointer text-left font-inter text-[.875rem] font-[400] capitalize leading-[1.25rem] tracking-[-0.006em] transition-colors duration-200 hover:bg-background-secondary`}
        onClick={() => {
          onColumnClick?.("created_at", operations?.BETWEEN, {
            format: "date_range",
          });
        }}
      >
        Date Range
      </button>
    </div>
  );
};

export default FilterOptions;
