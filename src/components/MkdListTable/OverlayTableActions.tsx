import { StringCaser } from "@/utils/utils";
import { MkdButton } from "@/components/MkdButton";
import { optionTypes } from "@/utils/config";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdPopover } from "@/components/MkdPopover";
import { DropdownOption } from "@/components/DropdownOptions";
import { processMultipleBind } from "./MkdListTableBindOperations";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { ComponentProps } from "react";

interface OverlayTableActionsProps {
  actions: any;
  selectedItems: any;
  currentTableData: any;
}

const { Capitalize } = new StringCaser();
const OverlayTableActions = ({
  actions,
  selectedItems,
  currentTableData
}: OverlayTableActionsProps) => {
  return (
    <div className="fixed inset-x-0 bottom-5 z-[999999] m-auto flex !h-[3.25rem] !max-h-[3.25rem] w-fit items-center justify-start gap-2 rounded-[.875rem] bg-black px-[.75rem] pb-[.5rem] pt-[.5rem]">
      <div className="font-inter text-white">
        Selected: {selectedItems.length}
      </div>
      {Object.keys(actions).filter(
        (key) =>
          actions[key]?.show &&
          actions[key]?.locations &&
          actions[key]?.locations?.includes("overlay")
      )?.length ? (
        <>
          {Object.keys(actions)
            .filter(
              (key) =>
                actions[key]?.show &&
                actions[key]?.locations &&
                actions[key]?.locations?.includes("overlay")
            )
            .map((key, keyIndex) => {
              if (
                actions[key]?.type &&
                [optionTypes.DROPDOWN].includes(actions[key]?.type)
              ) {
                return (
                  <RenderButtonDropdownActions
                    key={keyIndex}
                    actionKey={key}
                    action={actions[key]}
                    selectedItems={selectedItems}
                    currentTableData={currentTableData}
                  />
                );
              } else if (!actions[key]?.type) {
                return (
                  <RenderActions
                    key={keyIndex}
                    actionKey={key}
                    action={actions[key]}
                    selectedItems={selectedItems}
                    currentTableData={currentTableData}
                  />
                );
              }
            })
            .filter(Boolean)}
        </>
      ) : null}
    </div>
  );
};

export default OverlayTableActions;

interface RenderButtonDropdownActionsProps {
  action: any;
  actionKey: any;
  selectedItems: any;
  currentTableData: any;
}

const RenderButtonDropdownActions = ({
  action,
  actionKey,
  selectedItems,
  currentTableData
}: RenderButtonDropdownActionsProps) => {
  return (
    <LazyLoad>
      <MkdPopover
        display={
          <span
            className={`hover:text[#262626] !border-white-200 !bg-white-100 font-inter relative flex h-[3rem] w-full cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-[.625rem] border border-primary bg-primary  px-2 py-2 text-sm font-medium capitalize  leading-loose tracking-wide  text-white hover:bg-[#F4F4F4]`}
          >
            <span className="flex grow items-center justify-start gap-3 text-white">
              {action?.icon}
              {action?.children ?? actionKey}
            </span>
            <ChevronRightIcon className="-rotate-90" />
          </span>
        }
        zIndex={999}
        className={`w-full`}
        tooltipClasses="!rounded-[.5rem] !text-white w-full !min-w-[11rem] !px-0 !right-[3.25rem] !border"
        place={"top-start"}
        backgroundColor="#18181B"
      >
        {action?.options && Object.keys(action?.options).length
          ? Object.keys(action?.options).map((key, keyIndex) => {
              return (
                <RenderButtonActions
                  key={keyIndex}
                  action={action?.options[key]}
                  selectedItems={selectedItems}
                  currentTableData={currentTableData}
                />
              );
            })
          : null}
      </MkdPopover>
    </LazyLoad>
  );
};

interface RenderButtonActionsProps extends ComponentProps<any> {
  action: any;
  selectedItems: any;
  currentTableData: any;
}

const RenderButtonActions = ({
  action,
  selectedItems,
  currentTableData,
  ...props
}: RenderButtonActionsProps) => {
  const selectedTableData = currentTableData.filter((item: any) =>
    selectedItems.includes(item?.id)
  );
  // console.log("selectedTableData >>", selectedTableData);

  if (action?.bind) {
    switch (action?.bind?.action) {
      case "hide":
        if (!processMultipleBind(action, selectedTableData)) {
          return (
            <LazyLoad>
              <DropdownOption
                name={action?.children ?? props?.key}
                // key={keyIndex}
                className="hover:!bg-white-100 !text-white "
                icon={action?.icon}
                onClick={() => {
                  if (action?.action) {
                    action?.action(selectedItems);
                  }
                }}
              />
            </LazyLoad>
          );
        }
    }
  }
  if (!action?.bind) {
    return (
      <LazyLoad>
        <DropdownOption
          name={action?.children ?? props?.key}
          // key={keyIndex}
          className="hover:!bg-white-100 !text-white "
          icon={action?.icon}
          onClick={() => {
            if (action?.action) {
              action?.action(selectedItems);
            }
          }}
        />
      </LazyLoad>
    );
  }
};

interface RenderActionsProps {
  selectedItems: any;
  action: any;
  actionKey: any;
  currentTableData: any;
}

const RenderActions = ({
  selectedItems,
  action,
  actionKey,
  currentTableData
}: RenderActionsProps) => {
  const selectedTableData = currentTableData.filter((item: any) =>
    selectedItems.includes(item?.id)
  );
  // console.log("selectedTableData >>", selectedTableData);

  if (selectedItems && selectedItems?.length === 1 && !action?.multiple) {
    return (
      <RenderActionButtons
        action={action}
        actionKey={actionKey}
        selectedItems={selectedItems}
        rows={selectedTableData}
      />
    );
  }
  if (selectedItems && selectedItems?.length >= 1 && action?.multiple) {
    if (action?.multipleFrom) {
      const multipleFrom =
        action?.multipleFrom && selectedItems?.length >= action?.multipleFrom
          ? true
          : false;
      if (multipleFrom) {
        return (
          <RenderActionButtons
            action={action}
            actionKey={actionKey}
            selectedItems={selectedItems}
            rows={selectedTableData}
          />
        );
      }
    } else {
      return (
        <RenderActionButtons
          action={action}
          actionKey={actionKey}
          selectedItems={selectedItems}
          rows={selectedTableData}
        />
      );
    }
  }
};

interface RenderActionButtonsProps {
  action: any;
  actionKey: any;
  selectedItems: any;
  rows: any;
}

const RenderActionButtons = ({
  action,
  actionKey,
  selectedItems,
  rows
}: RenderActionButtonsProps) => {
  if (action?.bind) {
    switch (action?.bind?.action) {
      case "hide":
        if (!processMultipleBind(action, rows)) {
          return (
            <LazyLoad>
              <MkdButton
                showPlus={false}
                loading={action?.loading ?? false}
                disabled={action?.disabled ?? false}
                icon={action?.icon ?? null}
                className={`!border-white-200 !bg-white-100 flex cursor-pointer gap-2 px-2 py-2 text-lg font-medium  leading-loose tracking-wide !text-white ${
                  actionKey === "view"
                    ? "text-blue-500"
                    : actionKey === "delete"
                      ? "!text-red-500"
                      : "text-[#292829fd]"
                } hover:underline`}
                onClick={() => {
                  if (action?.action) {
                    // console.log("actionKey >>", actionKey);
                    action.action(selectedItems);
                  }
                }}
              >
                {actionKey === "delete" ? <TrashIcon /> : null}
                {action.children ? (
                  action.children
                ) : (
                  <>
                    {Capitalize(actionKey === "delete" ? "Remove" : actionKey, {
                      separator: " "
                    })}
                  </>
                )}
              </MkdButton>
            </LazyLoad>
          );
        }
    }
  }
  if (!action?.bind) {
    return (
      <LazyLoad>
        <MkdButton
          showPlus={false}
          loading={action?.loading ?? false}
          disabled={action?.disabled ?? false}
          icon={action?.icon ?? null}
          className={`!border-white-200 !bg-white-100 flex cursor-pointer gap-2 px-2 py-2 text-lg font-medium  leading-loose tracking-wide !text-white ${
            actionKey === "view"
              ? "text-blue-500"
              : actionKey === "delete"
                ? "!text-red-500"
                : "text-[#292829fd]"
          } hover:underline`}
          onClick={() => {
            if (action?.action) {
              // console.log("actionKey >>", actionKey);
              action.action(selectedItems);
            }
          }}
        >
          {actionKey === "delete" ? <TrashIcon /> : null}
          {action.children ? (
            action.children
          ) : (
            <>
              {Capitalize(actionKey === "delete" ? "Remove" : actionKey, {
                separator: " "
              })}
            </>
          )}
        </MkdButton>
      </LazyLoad>
    );
  }
};
