import { LazyLoad } from "@/components/LazyLoad";
import { MkdPopover } from "@/components/MkdPopover";
import { KebabIcon } from "@/assets/svgs";
import { optionTypes } from "@/utils/config";
import RenderDropdownActions from "./RenderDropdownActions";
import RenderActions from "./RenderActions";
import { processBind } from "./MkdListTableBindOperations";
import { Action, ActionLocations } from "./MkdListTableV2";

const checkBinding = (action: Action, row: Record<any, any>) => {
  if (action?.bind && ["hide"].includes(action?.bind?.action)) {
    return !processBind(action, row);
  } else {
    return true;
  }
};

interface MkdListTableRowDropdownProps {
  row: Record<any, any>;
  actions: { [key: string]: Action };
  actionId?: string;
  setDeleteId?: (id: any) => void;
}

const MkdListTableRowDropdown = ({
  row,
  actions,
  actionId = "id"
}: MkdListTableRowDropdownProps) => {
  return (
    <>
      {Object.keys(actions).filter(
        (key) =>
          actions[key]?.show &&
          actions[key]?.locations &&
          actions[key]?.locations?.length &&
          actions[key]?.locations?.includes(ActionLocations.DROPDOWN) &&
          checkBinding(actions[key], row)
      ).length ? (
        // <div className="items center relative flex h-fit w-fit gap-2">
        <LazyLoad>
          <MkdPopover
            display={
              <KebabIcon
                className="h-[1.5rem] w-[1.5rem] rotate-90"
                stroke="#1F1D1A"
              />
            }
            // tooltipClasses="!rounded-[.125rem] !min-w-fit !w-fit !max-w-fit !px-0 !right-[3.25rem]  bg-white"
            tooltipClasses="!rounded-[.5rem] !min-w-fit !w-fit !max-w-fit !px-0 !right-[3.25rem] !border !border-black bg-white"
            place={"left-end"}
            classNameArrow={"!border-b !border-r !border-black"}
          >
            {/* {actions?.edit?.show && (
                <LazyLoad>
                  <DropdownOption
                    className="!w-[11rem] !min-w-[11rem] !max-w-[11rem] !bg-brown-main-bg"
                    icon={<EditIcon />}
                    name={"Edit"}
                    onClick={() => {
                      if (actions?.edit?.action) {
                        actions?.edit?.action([row[actionId]]);
                      }
                    }}
                  />
                </LazyLoad>
              )}

              {actions?.view?.show && (
                <LazyLoad>
                  <DropdownOption
                    className="!w-[11rem] !min-w-[11rem] !max-w-[11rem] !bg-brown-main-bg"
                    icon={<AiFillEye className="text-gray-400" />}
                    name={"View"}
                    onClick={() => {
                      if (actions?.view?.action) {
                        actions?.view?.action([row[actionId]]);
                      }
                    }}
                  />
                </LazyLoad>
              )}

       

              {actions?.delete?.show && (
                <LazyLoad>
                  <DropdownOption
                    className="!w-[11rem] !min-w-[11rem] !max-w-[11rem] !bg-brown-main-bg"
                    icon={<TrashIcon />}
                    name={"Delete"}
                    onClick={() => {
                      if (!actions?.delete?.action) {
                        if (setDeleteId) {
                          setDeleteId(row[actionId]);
                        }
                      } else if (actions?.delete?.action) {
                        actions?.delete?.action([row[actionId]]);
                      }
                      // setDeleteId(row[actionId]);
                    }}
                  />
                </LazyLoad>
              )} */}

            {Object.keys(actions)
              .filter(
                (key) =>
                  actions[key]?.show &&
                  actions[key]?.locations &&
                  actions[key]?.locations?.length &&
                  actions[key]?.locations?.includes(ActionLocations.DROPDOWN)
              )
              .map((key, keyIndex) => {
                if (
                  actions[key]?.type &&
                  [optionTypes.DROPDOWN].includes(actions[key]?.type)
                ) {
                  return (
                    <RenderDropdownActions
                      row={row}
                      key={keyIndex}
                      actionKey={key}
                      actionId={actionId}
                      action={actions[key]}
                    />
                  );
                } else if (!actions[key]?.type) {
                  return (
                    <RenderActions
                      row={row}
                      key={keyIndex}
                      actionId={actionId}
                      action={actions[key]}
                    />
                  );
                }
              })}
          </MkdPopover>
        </LazyLoad>
      ) : // </div>
      null}
    </>
  );
};

export default MkdListTableRowDropdown;
