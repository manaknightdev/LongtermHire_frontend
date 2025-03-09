import React from "react";
import { Skeleton } from "@/components/Skeleton";
import { useContexts } from "@/hooks/useContexts";

export interface ViewModelItemProps {
  icon?: () => JSX.Element;
  name?: string;
  value?: string | (() => string) | undefined;
  hasCopy?: boolean;
  isValueFunc?: boolean;
  hasBadge?: boolean;
  hasTopBorder?: boolean;
  topHeader?: string;
  isLoading?: boolean;
}

const ViewModelItem: React.FC<ViewModelItemProps> = ({
  icon = () => <></>,
  name = "",
  value = "",
  hasCopy = false,
  isValueFunc = false,
  hasBadge = false,
  hasTopBorder = false,
  topHeader = undefined,
  isLoading = false,
}) => {
  const { showToast } = useContexts();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  };

  const getValue = (): string => {
    if (typeof value === "function" && isValueFunc) {
      return value();
    }
    return value?.toString() ?? "";
  };

  const displayValue = getValue();

  return (
    <>
      {topHeader && (
        <div
          className={`mt-2 px-5 font-semibold text-left ${
            hasTopBorder && topHeader ? "border-t pt-3 mt-3" : ""
          }`}
        >
          {topHeader}
        </div>
      )}
      <div
        className={`flex items-center justify-between px-5 py-2 ${
          hasTopBorder && !topHeader ? "border-t pt-3 mt-3" : ""
        }`}
      >
        <div className="w-[40%] flex items-center gap-3 text-[#6F6F6F] text-center mr-[20%]">
          <span className="min-w-[20px]">{icon()}</span>
          <span className="whitespace-nowrap">{name}</span>
        </div>
        <div className="w-[60%] flex items-center gap-3 font-medium">
          {isLoading ? (
            <Skeleton
              count={1}
              counts={[1]}
              className="h-[1.875rem] max-h-[1.875rem]"
            />
          ) : (
            <>
              {hasBadge ? (
                <span
                  className={`bg-[#D1FAE5] rounded-md py-1 px-3 text-[#065F46] ${
                    displayValue === "Active" ? "" : "bg-[#F4F4F4]"
                  }`}
                >
                  {displayValue}
                </span>
              ) : (
                <span className="break-all">
                  {displayValue}
                  {hasCopy && (
                    <button
                      onClick={() =>
                        copyToClipboard(
                          typeof displayValue === "string" ? displayValue : ""
                        )
                      }
                      className="ml-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z"
                          stroke="#6F6F6F"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.33333 10H2.66667C2.31305 10 1.97391 9.85953 1.72386 9.60948C1.47381 9.35943 1.33334 9.02029 1.33334 8.66667V2.66667C1.33334 2.31305 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31305 1.33334 2.66667 1.33334H8.66667C9.02029 1.33334 9.35943 1.47381 9.60948 1.72386C9.85953 1.97391 10 2.31305 10 2.66667V3.33334"
                          stroke="#6F6F6F"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewModelItem;
