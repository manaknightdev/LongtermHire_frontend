import { Fragment, memo } from "react";
import { MkdPopover } from "@/components/MkdPopover";

export const mappingValues: Record<string, any> = {
  damaged: {
    // icon: <CycleCountIcon />,
    text: "damaged",
    details: "The item is damaged and needs attention.",
  },
  "place order": {
    // icon: <SubmittedIcon />,
    text: "Place Order",
    details: "The order has been placed and is awaiting processing.",
  },
  verified: {
    // icon: <CircleCheckMarkIcon />,
    text: "Verified",
    details: "The address has been verified against the database.",
  },
  unverified: {
    // icon: <CircleCheckMarkIcon fill="#A1A1A9" />,
    text: "unverified",
    details: "The address validation failed during pre-validation.",
  },
  warning: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 13C11.45 13 11 12.55 11 12V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V12C13 12.55 12.55 13 12 13ZM13 17H11V15H13V17Z"
          fill="#F59E0B"
        />
      </svg>
    ),
    text: "warning",
    details:
      "The address validation succeeded, but it should be double-checked.",
  },
  error: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.4902 2.84406C11.1661 1.69 12.8343 1.69 13.5103 2.84406L22.0156 17.3654C22.699 18.5321 21.8576 19.9999 20.5056 19.9999H3.49483C2.14281 19.9999 1.30147 18.5321 1.98479 17.3654L10.4902 2.84406ZM12 9C12.4142 9 12.75 9.33579 12.75 9.75V13.25C12.75 13.6642 12.4142 14 12 14C11.5858 14 11.25 13.6642 11.25 13.25V9.75C11.25 9.33579 11.5858 9 12 9ZM13 15.75C13 16.3023 12.5523 16.75 12 16.75C11.4477 16.75 11 16.3023 11 15.75C11 15.1977 11.4477 14.75 12 14.75C12.5523 14.75 13 15.1977 13 15.75Z"
          fill="#DC2626"
        />
      </svg>
    ),
    text: "error",
    details: "The address validation failed with no certainty.",
  },
  submitted: {
    // icon: <SubmittedIcon />,
    text: "submitted",
    details: "The data has been submitted.",
  },
  processing: {
    // icon: <PendingIcon />,
    text: "Processing",
    details: "The data is currently being processed.",
  },
  label_created: {
    // icon: <PendingIcon />,
    text: "Label Created",
    details: "A shipping label has been created for the order.",
  },
  pending: {
    // icon: <PendingIcon />,
    text: "pending",
    details: "The process is pending and awaiting further action.",
  },
  completed: {
    // icon: <CircleCheckMarkIcon />,
    text: "completed",
    details: "The process has been completed successfully.",
  },
  cancelled: {
    // icon: <ExCircleIcon fill="red" stroke="white" />,
    text: "cancelled",
    details: "The process has been cancelled.",
  },
  voided: {
    // icon: <VoidedIcon />,
    text: "Voided",
    details: "The order has been voided.",
  },
  deleted: {
    // icon: <ExCircleIcon fill="red" stroke="white" />,
    text: "deleted",
    details: "The data has been deleted.",
  },
  false: {
    // icon: <CircleCheckMarkIcon fill="#A1A1A9" />,
    text: "false",
    details: "The status is false.",
  },
  active: {
    // icon: <CircleCheckMarkIcon />,
    text: "Active",
    details: "The status is active.",
  },
  inactive: {
    // icon: <CircleCheckMarkIcon fill="#A1A1A9" />,
    text: "Inactive",
    details: "The status is inactive.",
  },
  save: {
    // icon: <CircleCheckMarkIcon />,
    text: "",
    details: "The status is saved.",
  },
  no_save: {
    // icon: <CircleCheckMarkIcon fill="#A1A1A9" />,
    text: "",
    details: "The status is not saved.",
  },
  closed: {
    // icon: <CircleCheckMarkIcon />,
    text: "Closed",
    details: "The status is closed.",
  },
  open: {
    // icon: <CircleCheckMarkIcon fill="#A1A1A9" />,
    text: "Open",
    details: "The status is open.",
  },
  true: {
    // icon: <CircleCheckMarkIcon />,
    text: "true",
    details: "The status is true.",
  },
  "not held": {
    // icon: <CircleCheckMarkIcon />,
    text: "Not Held",
    details: "The inventory is not held.",
  },
  held: {
    // icon: <CircleCheckMarkIcon fill="#A1A1A9" />,
    text: "Held",
    details: "The inventory is held.",
  },
  approved: {
    // icon: <CircleCheckMarkIcon />,
    text: "approved",
    details: "The status is approved.",
  },
  charged: {
    // icon: <CircleDollarIcon />,
    text: "Charge Added",
    details: "A charge has been added.",
  },
};

interface StatusCellProps {
  value: string;
  mappings: Record<any, any>;
}

const StatusCell = ({ value, mappings }: StatusCellProps) => {
  console.log("value", value, mappings);
  const statusInfo =
    ["object"].includes(typeof mappings?.[value]) &&
    !Array.isArray(mappings?.[value])
      ? (mappingValues[mappings?.[value]?.text?.toLowerCase()] as any)
      : ["string", "number"].includes(typeof mappings?.[value])
        ? (mappingValues[mappings?.[value]?.toLowerCase()] as any)
        : null;
  const mappingText =
    ["object"].includes(typeof mappings?.[value]) &&
    !Array.isArray(mappings?.[value])
      ? mappings?.[value]?.text?.toLowerCase()
      : ["string", "number"].includes(typeof mappings?.[value])
        ? mappings?.[value]?.toLowerCase()
        : null;

  return (
    <Fragment>
      {statusInfo?.text || mappingText ? (
        <MkdPopover
          display={
            <span
              style={{
                backgroundColor: mappings?.[value]?.bg,
                color: mappings?.[value]?.color,
              }}
              className="flex w-fit items-center justify-normal gap-[.3125rem] rounded-full border border-black p-[.3125rem] capitalize"
            >
              {statusInfo?.icon ? (
                <span className="cursor-pointer">{statusInfo?.icon}</span>
              ) : null}
              <span className="max-w-[9.375rem] truncate whitespace-normal break-words font-inter text-[.875rem] font-[400] leading-[1.125rem] text-black ">
                {statusInfo?.text ?? mappingText}
              </span>
            </span>
          }
          place="left"
          backgroundColor="#000"
          openOnClick={false}
        >
          <div className="flex max-w-[9.375rem] items-center gap-2">
            <span className="w-full whitespace-normal break-words font-inter text-[.875rem] font-[400] leading-[1.125rem] text-white">
              {statusInfo?.details ?? statusInfo?.text ?? mappingText}
            </span>
          </div>
        </MkdPopover>
      ) : null}
    </Fragment>
  );
};

export default memo(StatusCell);
