import { processBind } from "./BindOperations";
import { LazyLoad } from "@/components/LazyLoad";
import { DropdownOption } from "@/components/DropdownOptions";

interface RenderActionsProps {
  action: any;
  row: any;
  actionId: any;
  key: any;
}

const RenderActions = ({ action, row, actionId, key }: RenderActionsProps) => {
  if (action?.bind) {
    switch (action?.bind?.action) {
      case "hide":
        if (!processBind(action, row)) {
          return (
            <LazyLoad>
              <DropdownOption
                name={action?.children ?? key}
                // key={keyIndex}
                className="hover:!bg-white-100 !w-[11rem] !min-w-[11rem] !max-w-[11rem] !bg-brown-main-bg"
                icon={action?.icon}
                onClick={() => {
                  if (action?.action) {
                    action?.action([row[actionId]]);
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
          name={action?.children ?? key}
          // key={keyIndex}
          className="hover:!bg-white-100 !w-[11rem] !min-w-[11rem] !max-w-[11rem] bg-brown-main-bg"
          icon={action?.icon}
          onClick={() => {
            if (action?.action) {
              action?.action([row[actionId]]);
            }
          }}
        />
      </LazyLoad>
    );
  }
};

export default RenderActions;
