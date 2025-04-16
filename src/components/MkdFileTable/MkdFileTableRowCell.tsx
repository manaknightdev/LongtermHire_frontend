import { useCallback } from "react";
import moment from "moment";
import { getNonNullValue } from "@/utils/utils";

const MkdFileTableRowCell = ({ property, row, validation }: any) => {
  const getCellClassName = (
    isValid: boolean,
    customClasses: {
      validClasses?: string | null;
      invalidClasses?: string | null;
    }
  ) => {
    const validClasses =
      customClasses?.validClasses ||
      "text-green-600 bg-green-100 border-green-600";
    const invalidClasses =
      customClasses?.invalidClasses || "text-red-600 bg-red-100 border-red-600";

    return `!w-fit !min-w-fit !max-w-fit !whitespace-nowrap px-[.75rem] py-[.5rem] border border-gray-600 text-left text-sm font-medium uppercase tracking-wider ${
      isValid ? validClasses : invalidClasses
    }`;
  };
  const isBoolean = useCallback((value: any) => {
    if (typeof value === "boolean") {
      return true;
    }
    if (typeof value === "string") {
      return [
        "true",
        "1",
        "false",
        "0",
        "true",
        1,
        0,
        "yes",
        "no",
        "on",
        "off",
      ].includes(value.toLowerCase())
        ? true
        : false;
    }

    if (typeof Number(value) === "number") {
      return [1, 0].includes(value) ? true : false;
    }
    return false;
  }, []);

  const renderCell = () => {
    const value = getNonNullValue(row[property?.key])?.toLowerCase();
    const type = property?.type.toLowerCase();
    const isRequired = property?.required;

    if (isRequired && !value) {
      return (
        <td
          className={getCellClassName(false, {
            invalidClasses: "border-red-600 bg-red-100 text-red-600",
          })}
        ></td>
      );
    }

    if (validation?.validateKeyType) {
      switch (type) {
        case "number":
          const isNotANumber = isNaN(Number(value));
          return (
            <td
              className={getCellClassName(!isNotANumber, {
                invalidClasses: !isRequired
                  ? "border-yellow-600 bg-yellow-100 text-yellow-600"
                  : null,
              })}
            >
              {value}
            </td>
          );
        case "string":
          return (
            <td
              className={getCellClassName(typeof value === "string", {
                invalidClasses: !isRequired
                  ? "border-yellow-600 bg-yellow-100 text-yellow-600"
                  : null,
              })}
            >
              {value}
            </td>
          );
        case "boolean":
          return (
            <td
              className={getCellClassName(isBoolean(value), {
                invalidClasses: !isRequired
                  ? "border-yellow-600 bg-yellow-100 text-yellow-600"
                  : null,
              })}
            >
              {value?.toString()}
            </td>
          );
        case "date":
          return (
            <td
              className={getCellClassName(
                moment(value, "DD/MM/YYYY", true).isValid(),
                {
                  invalidClasses: !isRequired
                    ? "border-yellow-600 bg-yellow-100 text-yellow-600"
                    : null,
                }
              )}
            >
              {value}
            </td>
          );
        case "array":
          return (
            <td
              className={getCellClassName(Array.isArray(value), {
                invalidClasses: !isRequired
                  ? "border-yellow-600 bg-yellow-100 text-yellow-600"
                  : null,
              })}
            >
              {value?.toString()}
            </td>
          );
        default:
          return (
            <td
              className={getCellClassName(true, {
                invalidClasses: !isRequired
                  ? "border-yellow-600 bg-yellow-100 text-yellow-600"
                  : null,
              })}
            >
              {value}
            </td>
          );
      }
    }

    return (
      <td
        className={` ${getCellClassName(true, {
          invalidClasses: !isRequired
            ? "border-yellow-600 bg-yellow-100 text-yellow-600"
            : null,
        })}`}
      >
        {value}
      </td>
    );
  };

  return renderCell();
};

export default MkdFileTableRowCell;
