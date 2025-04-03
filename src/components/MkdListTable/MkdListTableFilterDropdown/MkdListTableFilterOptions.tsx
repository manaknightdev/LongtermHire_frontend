import { StringCaser } from "@/utils/utils";
import { useSDK } from "@/hooks/useSDK";

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
  "allowed_customer"
];

interface MkdListTableFilterOptionsProps {
  selectedOptions?: string[];
  columns?: {
    accessor: string;
    header: string;
    filter_field: string;
    isFilter?: boolean;
    selected_column?: boolean;
    join?: string;
  }[];
  onColumnClick?: (column: string, operation?: string, config?: any) => void;
  setShowFilterOptions?: (show: boolean) => void;
}

const MkdListTableFilterOptions = ({
  columns = [],
  onColumnClick
}: MkdListTableFilterOptionsProps) => {
  const { operations } = useSDK();
  const stringCaser = new StringCaser();

  return (
    <div
      style={{
        maxHeight: "31.25rem",
        height: "fit-content",
        overflowY: "auto"
      }}
      className="absolute top-[-2000%] z-10 m-auto w-[12.5rem] min-w-[12.5rem] max-w-[12.5rem] bg-white p-2 text-gray-600 opacity-0 shadow-md transition-all hover:top-[80%] hover:opacity-100 focus:top-[80%] focus:opacity-100 peer-focus:top-[80%] peer-focus:opacity-100 peer-focus-visible:top-[80%] peer-focus-visible:opacity-100"
    >
      {columns
        .map((column) => {
          if (
            column?.hasOwnProperty("isFilter") &&
            column.isFilter &&
            column.hasOwnProperty("selected_column") &&
            column?.selected_column
          ) {
            return (
              <button
                type="button"
                key={column?.header}
                className={`h-[2.25rem] w-full cursor-pointer text-left font-inter text-[.875rem] font-[400] capitalize leading-[1.25rem] tracking-[-0.006em] text-black`}
                onClick={() => {
                  if (column.join) {
                    onColumnClick && onColumnClick(column?.header);
                  } else {
                    onColumnClick && onColumnClick(column?.accessor);
                  }
                }}
              >
                {stringCaser.Capitalize(column?.header, {
                  separator: ""
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
                  className={` h-[2.25rem] w-full cursor-pointer text-left font-inter text-[.875rem] font-[400] capitalize leading-[1.25rem] tracking-[-0.006em] text-black`}
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
                    separator: ""
                  })}
                </button>
              );
          }
        })
        .filter(Boolean)}

      <button
        type="button"
        className={`h-[2.25rem] w-full cursor-pointer text-left font-inter text-[.875rem] font-[400] capitalize leading-[1.25rem] tracking-[-0.006em] text-black`}
        onClick={() => {
          onColumnClick?.("created_at", operations?.BETWEEN, {
            format: "date_range"
          });
        }}
      >
        Date Range
      </button>
    </div>
  );
};

export default MkdListTableFilterOptions;
