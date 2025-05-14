import { memo } from "react";
import { MkdPopover } from "@/components/MkdPopover";
import { getManyByIds } from "@/context/Global";

export const getProcessedTableData = async (
  data: any[],
  columnFormats: any[],
  globalDispatch: any,
  authDispatch: any
) => {
  // Filter columns that have list processing requirements
  const listColumns = columnFormats.filter((column) => column?.list);
  // console.log("listColumns >>", listColumns);
  // Map through the data and process each row
  const processedDataPromises = data.map(async (row) => {
    const newRow = { ...row };

    // Process each column that needs list processing
    for (let listColumn of listColumns) {
      const columnKey = listColumn?.accessor; // Assuming column has a key to identify the column in data

      // Apply the processList function to the relevant column
      if (newRow[columnKey]) {
        newRow[columnKey] = await processList(
          newRow[columnKey],
          listColumn,
          globalDispatch,
          authDispatch
        );

        // console.log("newRow[columnKey] >>", newRow[columnKey]);
        // console.log("newRow >>", newRow);
      }
    }

    return newRow;
  });

  // Wait for all promises to resolve
  const processedData = await Promise.all(processedDataPromises);

  return processedData;
};

function processNumberArray(value: any, _options: any) {
  return value;
}
function processStringArray(value: any, _options: any) {
  return value;
}

function addObjectArrayKey(value = [], options: any) {
  const result = value.reduce((prev, current, _index) => {
    return prev + Number(current[options?.action?.key]);
  }, 0);

  return result;
}
const addListArrayKey = (value: any[] = [], options: any) =>
  value.map((item) => item[options?.action?.key]);

function buildReturnValue(
  item: { [x: string]: { [x: string]: any } },
  options: { action: any }
) {
  const { action } = options;
  const { init, join, key, table_key } = action;

  switch (init) {
    case "join":
      return table_key
        ? `${item[join][key]} - ${item[table_key]}`
        : item[join][key];
    case "table":
      return table_key
        ? `${item[table_key]} - ${item[join][key]}`
        : item[table_key];
    default:
      return item[join][key];
  }
}

async function fetchIDArrayJoinData(
  value: any,
  options: any,
  globalDispatch: any,
  authDispatch: any
) {
  if (!value.length) return [];
  try {
    const result = await getManyByIds(
      globalDispatch,
      authDispatch,
      options?.action?.table,
      value,
      {
        join: options?.action?.join
      }
    );
    if (!result?.error) {
      return result?.data?.map((item: { [x: string]: any; id: any }) =>
        item[options?.action?.join ?? ""]
          ? buildReturnValue(item, options)
          : (item?.id ?? item)
      );
    }
  } catch (error) {
    console.error("Error fetching ID array join data:", error);
  }
  return value;
}

function processObjectArray(
  value: any,
  options: { action: { operation: string | number } }
) {
  if (!options?.action) return "";

  const processors = {
    add: addObjectArrayKey,
    list: addListArrayKey
  };

  const processor =
    processors[options?.action?.operation as keyof typeof processors];
  return processors ? processor(value, options) : "";
}

async function processIDArray(
  value: any,
  options: { action: { operation: string | number } },
  globalDispatch: any,
  authDispatch: any
) {
  if (!options?.action) {
    return value;
  }

  const processors = {
    add: addObjectArrayKey,
    join: async (v: never[] | undefined, o: any) =>
      fetchIDArrayJoinData(v, o, globalDispatch, authDispatch)
  };

  const processor =
    processors[options?.action?.operation as keyof typeof processors];
  return processor ? await processor(value, options) : "";
}

async function processJson(
  value: any,
  contentType: string | number,
  options: any,
  globalDispatch: any,
  authDispatch: any
) {
  if (!contentType) return "";

  const processors = {
    object_array: processObjectArray,
    id_array: (v: any, o: any) =>
      processIDArray(v, o, globalDispatch, authDispatch),
    number_array: processNumberArray,
    string_array: processStringArray
  };

  const processor = processors[contentType as keyof typeof processors];
  return processor ? processor(value, options) : "";
}

async function processList(
  value: string,
  options: any,
  globalDispatch: any,
  authDispatch: any
) {
  const [type, contentType] = options?.listType?.split("|");
  if (!type) return "";

  if (type === "json") {
    try {
      const parsedValue = JSON.parse(value);
      return processJson(
        parsedValue,
        contentType,
        options,
        globalDispatch,
        authDispatch
      );
    } catch (e) {
      // console.error("Error parsing JSON:", e);
      return value;
    }
  }

  return value;
}

interface MkdListTableRowListColumnProps {
  column: any;
  data: any;
  expandRow?: boolean;
  currentTableData?: any[];
}

const MkdListTableRowListColumn = ({
  column,
  data,
  expandRow = false
}: MkdListTableRowListColumnProps) => {
  return (
    <div className="flex items-center gap-[.25rem]">
      {data ? (
        <>
          {expandRow ? (
            <>
              {["string", "number"].includes(typeof data) ? (
                <span
                  className={`flex w-fit items-center justify-normal gap-[.25rem] rounded-[.375rem] border border-soft-200  p-[.25rem_.5rem_.25rem_.25rem] capitalize`}
                >
                  {data}
                </span>
              ) : typeof data === "object" && Array.isArray(data) ? (
                <>
                  {data.map((item, itemKey) => {
                    return (
                      <span
                        className={`flex w-fit items-center justify-normal gap-[.25rem] rounded-[.375rem] border border-soft-200  p-[.25rem_.5rem_.25rem_.25rem] capitalize`}
                        key={itemKey}
                      >
                        {item}
                      </span>
                    );
                  })}
                </>
              ) : null}
            </>
          ) : null}

          {!expandRow ? (
            <>
              {["string", "number"].includes(typeof data) ? (
                <span
                  className={`flex w-fit items-center justify-normal gap-[.25rem] rounded-[.375rem] border border-soft-200  p-[.25rem_.5rem_.25rem_.25rem] capitalize`}
                >
                  {data}
                </span>
              ) : typeof data === "object" && Array.isArray(data) ? (
                <>
                  {Array.from({
                    length:
                      data?.length > column?.limit
                        ? column?.limit
                        : data?.length
                  }).map((_, itemKey) => {
                    return (
                      <span
                        className={`flex w-fit items-center justify-normal gap-[.25rem] rounded-[.375rem] border border-soft-200  p-[.25rem_.5rem_.25rem_.25rem] capitalize`}
                        key={itemKey}
                      >
                        {data[itemKey]}
                      </span>
                    );
                  })}
                  {data?.length > column?.limit ? (
                    <MkdPopover
                      display={
                        <span
                          className={`cursor-pointer flex w-fit items-center justify-normal gap-[.25rem] rounded-[.375rem] border border-soft-200  p-[.25rem_.5rem_.25rem_.25rem] capitalize`}
                        >
                          + {data.length - column?.limit}
                        </span>
                      }
                      openOnClick={true}
                      backgroundColor="#fff"
                      place="top-start"
                      classNameArrow={"!border-b !border-r !border-soft-200"}
                      tooltipClasses={`overflow-y-auto border-soft-200 h-[18.75rem] max-h-[18.75rem] min-h-[18.75rem] w-[18.75rem] min-w-[18.75rem] max-w-[18.75rem]`}
                    >
                      <div
                        className={`grid h-fit border-soft-200 max-h-fit min-h-fit w-full min-w-full max-w-full grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))]  items-start  gap-2`}
                      >
                        {data?.map((item, itemKey) => {
                          return (
                            <span
                              title={item}
                              className={`h-fit truncate rounded-[.375rem] border border-soft-200  p-[.25rem_.5rem_.25rem_.25rem] capitalize text-black`}
                              key={itemKey}
                            >
                              {item}
                            </span>
                          );
                        })}
                      </div>
                    </MkdPopover>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default memo(MkdListTableRowListColumn);
