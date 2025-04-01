import { StringCaser } from "@/utils/utils";
import { MkdButton } from "@/components/MkdButton";
interface TableActionsProps {
  actions: any;
  selectedItems: any;
}
const TableActions = ({ actions, selectedItems }: TableActionsProps) => {
  const { Capitalize } = new StringCaser();

  return (
    <div className="flex gap-2">
      {Object.keys(actions)
        .map((key) => actions[key].show)
        .includes(true) ? (
        <>
          {Object.keys(actions)
            .map((key) => {
              if (
                actions[key].show &&
                !["static"].includes(actions[key].type) &&
                !["select", "add", "export"].includes(key)
              ) {
                if (
                  selectedItems &&
                  selectedItems?.length === 1 &&
                  !actions[key]?.multiple
                ) {
                  return (
                    <MkdButton
                      key={key}
                      showPlus={false}
                      loading={actions[key]?.loading ?? false}
                      disabled={actions[key]?.disabled ?? false}
                      icon={actions[key]?.icon ?? null}
                      className={`!h-[2.5rem] cursor-pointer px-2 py-2 text-lg  font-medium leading-loose tracking-wide ${
                        key === "view"
                          ? "text-blue-500"
                          : key === "delete"
                            ? "text-red-500"
                            : "text-[#292829fd]"
                      } hover:underline`}
                      onClick={() => {
                        if (actions[key]?.action) {
                          actions[key].action(selectedItems);
                        }
                      }}
                    >
                      {Capitalize(key, {
                        separator: " "
                      })}
                    </MkdButton>
                  );
                }
                if (
                  selectedItems &&
                  selectedItems?.length >= 1 &&
                  actions[key]?.multiple
                ) {
                  return (
                    <MkdButton
                      key={key}
                      showPlus={false}
                      loading={actions[key]?.loading ?? false}
                      disabled={actions[key]?.disabled ?? false}
                      icon={actions[key]?.icon ?? null}
                      className={`!h-[2.5rem] cursor-pointer px-2 py-2 text-lg  font-medium leading-loose tracking-wide ${
                        key === "view"
                          ? "text-blue-500"
                          : key === "delete"
                            ? "text-red-500"
                            : "text-[#292829fd]"
                      } hover:underline`}
                      onClick={() => {
                        if (actions[key]?.action) {
                          actions[key].action(selectedItems);
                        }
                      }}
                    >
                      {Capitalize(key, {
                        separator: " "
                      })}
                    </MkdButton>
                  );
                }
              }
            })
            .filter(Boolean)}
        </>
      ) : null}
    </div>
  );
};

export default TableActions;
