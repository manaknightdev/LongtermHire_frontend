import { LazyLoad } from "@/components/LazyLoad";
import { MkdPopover } from "@/components/MkdPopover";
// import { ChevronRightIcon } from "@/assets/svgs";
import RenderActions from "./RenderActions";

interface RenderDropdownActionsProps {
  action: any;
  actionKey: any;
  row: any;
  actionId: any;
}

const RenderDropdownActions = ({
  action,
  actionKey,
  row,
  actionId,
}: RenderDropdownActionsProps) => {
  return (
    <LazyLoad>
      <MkdPopover
        display={
          <span
            className={`flex  w-full cursor-pointer items-center justify-between gap-3 px-2 capitalize text-[#262626] hover:bg-[#F4F4F4]`}
          >
            <span className="flex grow gap-3">
              {action?.icon}
              {action?.children ?? actionKey}
            </span>
            {/* <ChevronRightIcon /> */}
          </span>
        }
        className={`w-full`}
        tooltipClasses="!rounded-[.5rem] w-full !min-w-fit !w-fit !max-w-fit !px-0 !right-[3.25rem] !border bg-white"
        place={"left-start"}
        backgroundColor="#fff"
      >
        {action?.options && Object.keys(action?.options).length
          ? Object.keys(action?.options).map((key, keyIndex) => {
              return (
                <RenderActions
                  key={keyIndex}
                  action={action?.options[key]}
                  actionId={actionId}
                  row={row}
                />
              );
            })
          : null}
      </MkdPopover>
    </LazyLoad>
  );
};

export default RenderDropdownActions;
