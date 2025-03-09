import { LazyLoad } from "@/components/LazyLoad";
import { MkdButton } from "@/components/MkdButton";
import { processBind } from "./MkdListTableBindOperations";
import { Action, ActionLocations } from "./MkdListTableV2";

interface MkdListTableRowDropdownProps {
  row: Record<any, any>;
  actions: { [key: string]: Action };
  actionId?: string;
  setDeleteId: (id: any) => void;
}

const MkdListTableRowDropdown = ({
  row,
  actions,
  actionId = "id",
  setDeleteId,
}: MkdListTableRowDropdownProps) => {
  return (
    <>
      <div className="z-3 relative flex h-fit w-fit items-center gap-2">
        <LazyLoad>
          {Object.keys(actions)
            .filter(
              (key) =>
                actions[key]?.show &&
                actions[key]?.locations &&
                actions[key]?.locations?.length &&
                actions[key]?.locations?.includes(ActionLocations.BUTTONS)
            )
            .map((key, keyIndex) => {
              if (actions[key]?.bind) {
                switch (actions[key]?.bind?.action) {
                  case "hide":
                    if (!processBind(actions[key], row)) {
                      return (
                        <LazyLoad key={keyIndex}>
                          <MkdButton
                            key={keyIndex}
                            title={actions[key]?.children ?? key}
                            onClick={() => {
                              if (["delete"].includes(key)) {
                                if (setDeleteId) {
                                  setDeleteId(row[actionId]);
                                }
                              } else if (actions[key]?.action) {
                                actions[key]?.action([row[actionId]]);
                              }
                            }}
                            showPlus={false}
                            className={`!border-soft-200 !bg-brown-main-bg  !flex !h-[2rem] !w-[2.0713rem] !justify-center !text-black !shadow-none `}
                          >
                            {actions[key]?.icon ? actions[key]?.icon : null}

                            {actions[key]?.showChildren
                              ? actions[key]?.children
                                ? actions[key]?.children
                                : key
                              : null}
                          </MkdButton>
                        </LazyLoad>
                      );
                    }
                }
              }
              if (!actions[key]?.bind) {
                return (
                  <LazyLoad key={keyIndex}>
                    <MkdButton
                      key={keyIndex}
                      title={actions[key]?.children ?? key}
                      onClick={() => {
                        if (["delete"].includes(key) && !actions[key]?.action) {
                          if (setDeleteId) {
                            setDeleteId(row[actionId]);
                          }
                        } else if (actions[key]?.action) {
                          actions[key]?.action([row[actionId]]);
                        }
                        // if (actions[key]?.action) {
                        //   actions[key]?.action([row[actionId]]);
                        // }
                      }}
                      showPlus={false}
                      className={`!border-soft-200 !bg-brown-main-bg !flex !h-[2rem] !w-[2.0713rem] !justify-center !text-black !shadow-none `}
                    >
                      {actions[key]?.icon ? actions[key]?.icon : null}

                      {actions[key]?.showChildren
                        ? actions[key]?.children
                          ? actions[key]?.children
                          : key
                        : null}
                    </MkdButton>
                  </LazyLoad>
                );
              }
            })}
        </LazyLoad>
      </div>
    </>
  );
};

export default MkdListTableRowDropdown;
