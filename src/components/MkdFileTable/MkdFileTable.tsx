import React, { useCallback, useRef, useState } from "react";
import * as XLSX from "xlsx";
import moment from "moment";
import Papa from "papaparse";
import {
  CircleCheckMarkIcon,
  CloseIcon,
  CloudUploadIcon,
  CsvIcon,
  Spinner,
  TrashIcon,
} from "@/assets/svgs";
import classes from "./MkdFileTable.module.css";
import { LazyLoad } from "@/components/LazyLoad";
import { Modal } from "@/components/Modal";
import { MkdFileTableRowCell } from "./index";
import { getNonNullValue } from "@/utils/utils";
import { THEME_COLORS } from "@/context/Theme";
import { useTheme } from "@/hooks/useTheme";

const acceptType = (fileType: string) => {
  switch (fileType) {
    case "excel":
      return ".xlsx,.xls";
    case "csv":
      return ".csv";
    default:
      return ".xlsx,.xls";
  }
};
const fieldType: any = {
  string: "Alpha Numerical",
  number: "Number",
  boolean: "0 or 1, true or false, yes or no, on or off",
};
const transformFileType = (fileType: string) => {
  switch (fileType) {
    case "excel":
    case "xls":
    case "xlsx":
    case ".xlsx":
    case ".xls":
    case ".xlsx,.xls":
    case "xlsx,xls":
    case ".xls,.xlsx":
    case "xls,xlsx":
      return "an excel";
    case "csv":
    case ".csv":
      return "a csv";
    case ".png":
    case "png":
      return "a png";
    case ".jpg":
    case "jpg":
      return "a jpg";
    case ".jpeg":
    case "jpeg":
      return "a jpeg";
    case "image":
    case ".png,.jpg,.jpeg":
    case ".png,.jpeg,.jpg":
    case ".jpg,.png,.jpeg":
    case ".jpg,.jpeg,.png":
    case ".jpeg,.png,.jpg":
    case ".jpeg,.jpg,.png":
      return "an image";
    case "doc":
    case "docx":
    case "document":
    case ".doc":
    case ".docx":
    case ".docx,.doc":
    case ".doc,.docx":
    case "docx,doc":
    case "doc,docx":
      return "a word document";
    case "pdf":
    case ".pdf":
      return "a pdf";
    default:
      return "any";
  }
};

interface MkdFileTableProps {
  title?: string;
  className?: string;
  fileType?: string;
  uploadText?: string;
  openStyles?: any;
  onUpdate?: (data?: any) => void;
  validation?: {
    validateKeys?: boolean;
    validateKeyType?: boolean;
    inValidType?: (value: boolean) => void;
    properties?: { key: string; type: string; required: boolean }[];
  };
}

const MkdFileTable = ({
  title = "File Table",
  className = "",
  fileType = "excel",
  onUpdate,
  validation = {
    validateKeys: false,
    validateKeyType: false,
    inValidType: undefined,
    properties: [],
  },
}: MkdFileTableProps) => {
  const inputRef = useRef(null) as any;
  const { state } = useTheme();
  const mode = state?.theme;

  const [dataLoading, setDataLoading] = useState(false);
  const [valid, setValid] = useState(true);
  const [invalidType, setInvalidTypes] = useState(false);
  const [invalidRequiredField, setInvalidRequiredFields] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [_validationSet, setValidationSet] = useState([]);
  const [data, setData] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null) as any;
  const [showFileContent, setShowFileContent] = useState(false);

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

  const validateKeys = (data = []) => {
    if (!data?.length) {
      inputRef.current.value = "";
      return setDataLoading(false);
      //  showToast(globalDispatch, "Inavlid File", 5000, "error");
    }

    const dataKeys = Object.keys(data?.[0]);
    const keyStatuses = validation?.properties?.map((property) => {
      if (
        property?.required &&
        !getNonNullValue(dataKeys.includes(property?.key))
      ) {
        return {
          key: property?.key,
          present: 0,
        };
      }
      if (
        property?.required &&
        getNonNullValue(dataKeys.includes(property?.key))
      ) {
        return {
          key: property?.key,
          present: 1,
        };
      }
      if (
        !property?.required &&
        getNonNullValue(dataKeys.includes(property?.key))
      ) {
        return {
          key: property?.key,
          present: 1,
        };
      }
      if (
        !property?.required &&
        !getNonNullValue(dataKeys.includes(property?.key))
      ) {
        return {
          key: property?.key,
          present: 1,
        };
      }
      return {
        key: property?.key,
        present: 0,
      };
    });
    // console.log("keyStatuses >>", keyStatuses);
    const inValid = keyStatuses?.some((status) => !Boolean(status.present));

    setValid(!inValid);
    setValidationSet(keyStatuses as any);

    if (validation.validateKeyType && validation?.properties?.length) {
      validateKeyType(data);
    }
    inputRef.current.value = "";
    setDataLoading(false);
  };
  const validateKeyType = (data: any) => {
    const invalidFields = validation?.properties
      ?.map((item) => {
        const match = data?.find((dataItem: any) => {
          const type = item?.type?.toLowerCase();

          if (type === "number") {
            return isNaN(Number(getNonNullValue(dataItem[item?.key])));
          }
          if (type === "string") {
            return (
              (typeof getNonNullValue(dataItem[item?.key])).toLowerCase() !==
              item?.type.toLowerCase()
            );
          }
          if (type === "boolean") {
            return !isBoolean(getNonNullValue(dataItem[item?.key]));
          }
          if (type === "date") {
            return moment(
              getNonNullValue(dataItem[item?.key]),
              "DD/MM/YYYY",
              true
            ).isValid();
          }
          if (type === "array") {
            return Array.isArray(getNonNullValue(dataItem[item?.key]));
          }
        });
        // console.log("match >>", match);
        if (match) {
          return {
            ...item,
            value: match[item?.key],
          };
        }
        return null;
      })
      .filter(Boolean);

    // console.log("invalidFields >>", invalidFields);

    // console.log("invalidFields.includes(true) >>", invalidFields.includes(true));
    // console.log("data >>", data);
    const invalidRequiredFields = invalidFields?.some(
      (field) => field?.required
    );
    setInvalidRequiredFields(invalidRequiredFields as any);

    if (invalidFields?.length) {
      setInvalidTypes(true);
      setInvalidFields(invalidFields as any);
      setValid(false);
      if (invalidRequiredFields && validation.inValidType) {
        validation.inValidType(true);
      }
      if (!invalidRequiredFields && validation.inValidType) {
        validation.inValidType(false);
      }
    } else {
      if (validation.inValidType) {
        validation.inValidType(false);
        setInvalidTypes(false);
        setValid(true);
        setInvalidFields([]);
      }
    }
  };

  const handleExcelFile = (target: any) => {
    try {
      setData(() => []);
      setDataLoading(true);
      const reader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        if (validation.validateKeys) {
          validateKeys(parsedData as any);
        } else {
          setValid(true);
          inputRef.current.value = "";
          setDataLoading(false);
        }
        setData(parsedData as any);
      };
    } catch (error) {
      setDataLoading(false);
      inputRef.current.value = "";
    }
  };
  const filterOut = (data: any) => {
    const hasAtLeastOneValue = validation?.properties?.some((prop: any) =>
      getNonNullValue(data[prop?.key])
    );
    return hasAtLeastOneValue;
  };

  const handleCsvFile = (target: any) => {
    setDataLoading(true);
    try {
      setData(() => []);
      const file = target.files[0];
      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          const filteredData = results?.data?.filter((data: any) =>
            filterOut(data)
          );
          // const filteredData = results.data.filter((data) => filterOut(data));

          if (validation.validateKeys) {
            if (filteredData?.length) {
              validateKeys(filteredData as any);
            } else {
              validateKeys(results?.data as any);
            }
          } else {
            setValid(true);
            inputRef.current.value = "";
            setDataLoading(false);
          }
          if (filteredData?.length) {
            setData(filteredData as any);
          } else {
            setData(results?.data as any);
          }
        },
      });
    } catch (error) {
      inputRef.current.value = "";
      setDataLoading(false);
    }
  };

  const handleFileInput = (e: any, dnd = false) => {
    const files = dnd ? e.dataTransfer.files : e.target.files;
    setUploadedFile(files[0]);
    switch (fileType) {
      case "excel":
        return handleExcelFile(dnd ? e.dataTransfer : e.target);
      case "csv":
        return handleCsvFile(dnd ? e.dataTransfer : e.target);
      default:
        return handleExcelFile(dnd ? e.dataTransfer : e.target);
    }
  };

  const handleRemove = (index: any) => {
    const tempData = data.filter((_, i) => i !== index);
    setData(() => [...tempData]);
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    // console.log("handleDragEnter", handleDragEnter);
    setDragging(true);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    // console.log("handleDragOver", handleDragOver);
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    // console.log("handleDragLeave", handleDragLeave);
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    // console.log("handleDrop", handleDrop);
    setDragging(false);
    setUploadedFile(null);

    const droppedFiles = e.dataTransfer.files;
    // console.log(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      // const file = droppedFiles[0];

      handleFileInput(e, true);
    }
  };

  const fileSize = (size: any) => {
    return `${(size / 1024).toFixed(2)} KB`;
  };

  React.useEffect(() => {
    if (data?.length && valid && onUpdate) {
      onUpdate(data as any);
    } else if (data?.length && !valid && !invalidRequiredField && onUpdate) {
      onUpdate(data as any);
    } else if (data?.length && valid && !invalidRequiredField && onUpdate) {
      onUpdate(data as any);
    } else if (data?.length && !valid && invalidRequiredField && onUpdate) {
      onUpdate(data as any);
    } else if (onUpdate) {
      onUpdate([]);
    }
  }, [data?.length, valid]);

  React.useEffect(() => {
    if (validation.validateKeys) {
      validateKeys(data as any);
    }
  }, [data?.length]);

  // console.log("File Data >>", data);

  return (
    <>
      <div className={`w-full ${className}`}>
        <div className="flex flex-col gap-[2.5rem]">
          <div className="flex flex-col justify-start py-4">
            <input
              disabled={dataLoading}
              className="w-[20%] cursor-pointer rounded bg-primary p-4 text-white hover:bg-primary-hover transition-colors duration-200"
              type="file"
              accept={acceptType(fileType)}
              ref={inputRef}
              onChange={(e) => {
                setUploadedFile(null);
                handleFileInput(e, false);
              }}
              hidden
            />

            {data?.length ? (
              <div
                className={`relative flex max-h-[4.5rem] min-h-[4.5rem] min-w-full max-w-full items-center justify-between gap-[1rem] rounded-[.75rem] border ${
                  !valid && invalidRequiredField
                    ? "border-red-600"
                    : valid && !invalidRequiredField
                      ? "border-soft-200"
                      : "border-[#ca8a04]"
                } py-[1rem] pl-[1rem] pr-[.875rem]`}
              >
                <CsvIcon
                  className={`h-[2.5rem] min-w-[2.5rem] max-w-[2.5rem]`}
                  fill={
                    !valid && invalidRequiredField
                      ? "red"
                      : valid && !invalidRequiredField
                        ? "#38C793"
                        : "#ca8a04"
                  }
                />

                <div
                  title={uploadedFile?.name as any}
                  onClick={() => setShowFileContent(true)}
                  className={`text-truncate group flex min-h-[3.125rem] grow cursor-pointer flex-col items-start justify-start overflow-hidden truncate text-ellipsis px-2 text-center text-text`}
                >
                  <span
                    className={`${classes.view_shadow} z-5 absolute ${
                      !valid && invalidRequiredField
                        ? "-left-[25%]"
                        : valid && !invalidRequiredField
                          ? "-left-[30%]"
                          : "-left-[30%]"
                    } -bottom-[35%] m-auto min-w-[23rem] ${
                      !valid && invalidRequiredField
                        ? "text-red-600"
                        : valid && !invalidRequiredField
                          ? "text-[#38C793]"
                          : "text-[#ca8a04]"
                    } opacity-0 group-hover:opacity-100`}
                  >
                    {!valid && invalidRequiredField
                      ? "Click to View Errors"
                      : valid && !invalidRequiredField
                        ? "Click to View"
                        : "Click to View"}
                  </span>
                  <div className="font-inter text-[.875rem] font-medium lowercase leading-[1.25rem] text-text">
                    {uploadedFile?.name}
                  </div>
                  <div className="flex gap-2 justify-start items-center">
                    {valid && (
                      <>
                        {fileSize(uploadedFile?.size)} /
                        {fileSize(uploadedFile?.size)}
                      </>
                    )}
                    <CircleCheckMarkIcon
                      fill={
                        !valid && invalidRequiredField
                          ? "red"
                          : valid && !invalidRequiredField
                            ? "#38C793"
                            : "#ca8a04"
                      }
                    />
                    {!valid ? "Incomplete" : "Completed"}
                  </div>
                </div>
                <div>
                  <TrashIcon
                    onClick={() => {
                      // removeItem()
                      setUploadedFile(null);
                      setData([]);
                      onUpdate && onUpdate([]);
                      setValid(true);
                      setInvalidTypes(false);
                      if (validation.inValidType) {
                        validation.inValidType(false);
                      }
                    }}
                    className="h-[.9375rem] w-[.9375rem] cursor-pointer text-sub-500"
                  />
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex h-[12rem] min-h-[12rem] w-full cursor-pointer flex-col items-center justify-between gap-[1rem] rounded-[.75rem] border border-dashed p-[2rem] font-inter hover:border-accent md:w-full  md:min-w-full md:max-w-full transition-colors duration-200 ${
                  dragging ? "border-accent" : "border-border"
                }`}
                onClick={() => inputRef.current.click()}
              >
                <CloudUploadIcon className="h-[1.125rem] w-[1.2381rem]" />
                <div className="flex flex-col items-center">
                  <div className="text-[.875rem] font-bold">
                    Choose{" "}
                    <span className="lowercase">
                      {transformFileType(fileType)}
                    </span>{" "}
                    File or drag & drop it here.
                  </div>
                  <div className="text-[.75rem] font-bold text-secondary">
                    <span className="uppercase">{fileType}</span> formats, up to
                    50 MB.
                  </div>
                </div>
                <div className="flex h-[2rem] w-full cursor-pointer items-center justify-center rounded-[.5rem] border border-border bg-background text-[.875rem] font-[500] leading-[1.25rem] text-secondary hover:bg-background-hover transition-colors duration-200">
                  Browse File
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <LazyLoad>
        <Modal
          isOpen={showFileContent}
          modalCloseClick={() => setShowFileContent(false)}
          title={
            <div className="flex items-center justify-start gap-[.5rem]">
              {/* Imported File */}
              {!valid ? "Errors" : title ? title : "Data Table"}
            </div>
          }
          modalHeader
          classes={{
            modalDialog: `md:!w-[90%] !px-0 md:min-h-[90%] min-h-[90%] md:!max-h-[90%] max-h-[90%] !grid grid-rows-[auto_90%] !gap-0 !w-full !px-0 !w-full `,
            modalContent: `!z-10 !mt-0 !px-0 overflow-hidden !pt-0`,
            modal: "h-full",
          }}
        >
          <div
            className={`relative mx-auto grid h-full max-h-full min-h-full w-full grow grid-cols-1 grid-rows-1 rounded text-start !font-inter leading-snug tracking-wide`}
          >
            <div className="overflow-auto w-full min-h-full max-h-full">
              {invalidType ? (
                <>
                  {invalidFields?.map((item: any, itemKey: any) => {
                    return (
                      <div className="flex flex-col gap-5" key={itemKey}>
                        <div className="p-3">
                          <code className={"lowercase text-primary"}>
                            {item?.key}
                          </code>{" "}
                          should be <span className={"lowercase"}>a</span>{" "}
                          <code className="rounded-[.625rem] border bg-black p-2 text-white">
                            {fieldType?.[item?.type]}
                          </code>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : null}
              {showFileContent ? (
                <LazyLoad>
                  <div className="relative w-full min-h-fit">
                    {/* <div
                    className={`${
                      !data?.length ? "hidden" : ""
                    } absolute left-0 top-[-15px] m-auto flex gap-5 bg-white text-black`}
                  >
                    {title ? title : "Data Table"}
                  </div> */}

                    {/* <div className={`${!valid ? "":"hidden"mt-10 }`}>
                  <ul className="space-y-5">
                    {validationSet.map((validation, key) => {
                      if (!validation.present) {
                        return (
                          <li
                            className={`rounded-[.625rem] px-2 py-2 hover:border  hover:border-soft-200 hover:bg-soft-200`}
                            key={key}
                          >
                            <code className="mr-2 text-red-600 lowercase">
                              {validation.key}
                            </code>
                            <span>is missing from csv , </span>
                            <i className="text-primary">
                              please upload one that contains it
                            </i>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div> */}

                    {dataLoading || data?.length ? (
                      <div
                        className={`${
                          dataLoading || data?.length ? "" : "hidden"
                        } relative mt-5 min-h-fit w-full max-w-full overflow-auto rounded-md border p-4 shadow-md`}
                      >
                        {dataLoading ? (
                          <div className="flex overflow-hidden justify-center w-full h-fit max-h-fit min-h-fit">
                            <Spinner
                              size={40}
                              color={THEME_COLORS[mode].PRIMARY}
                            />
                          </div>
                        ) : data.length ? (
                          <table className="min-h-[6.25rem] w-full border border-border bg-table">
                            <thead className="min-h-[50px]">
                              <tr className="w-fit">
                                <th className="px-6 py-3 text-sm font-medium tracking-wider text-left text-text uppercase border border-border bg-table-header"></th>
                                <th className="px-6 py-3 text-sm font-medium tracking-wider text-left text-text uppercase border border-border bg-table-header">
                                  SN
                                </th>
                                {data.length ? (
                                  <>
                                    {validation?.properties?.map(
                                      (item: any, index: any) => {
                                        return (
                                          <th
                                            key={`${item}_${index}`}
                                            scope="col"
                                            title="required"
                                            className="!h-[2.65rem] !max-h-[2.65rem] !min-h-[2.65rem] !w-[auto]  !min-w-[6.25rem] !max-w-[auto] shrink-0 grow border border-gray-600 bg-gray-100 px-[.75rem] py-[.5rem] text-left text-sm font-medium uppercase tracking-wider text-gray-500 "
                                          >
                                            <div className="flex gap-2">
                                              {item?.key}{" "}
                                              {item?.required && (
                                                <sup className="text-red-600">
                                                  •
                                                </sup>
                                              )}
                                            </div>
                                          </th>
                                        );
                                      }
                                    )}
                                  </>
                                ) : null}
                              </tr>
                            </thead>
                            <tbody>
                              {data.map((row, rowIndex) => (
                                <tr
                                  key={rowIndex}
                                  className="!h-[3rem] !max-h-[3rem] !min-h-[3rem] border-b"
                                >
                                  <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase border border-gray-600">
                                    <button
                                      type="button"
                                      onClick={() => handleRemove(rowIndex)}
                                    >
                                      <CloseIcon
                                        className="w-4 h-4"
                                        fill="red"
                                      />
                                    </button>
                                  </td>
                                  <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase border border-gray-600">
                                    {rowIndex + 1}
                                  </td>

                                  {validation?.properties?.map(
                                    (property, propertyIndex) => (
                                      <MkdFileTableRowCell
                                        key={propertyIndex}
                                        property={property}
                                        row={row}
                                        validation={validation}
                                      />
                                    )
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </LazyLoad>
              ) : null}
            </div>
          </div>
        </Modal>
      </LazyLoad>
    </>
  );
};

export default MkdFileTable;
