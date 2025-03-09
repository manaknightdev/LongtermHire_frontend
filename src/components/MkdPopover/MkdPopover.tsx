import { ReactNode, useId } from "react";
import { Tooltip as ReactTooltip, PlacesType } from "react-tooltip";
import "./MkdPopover.css";

interface MkdPopoverProps {
  display: ReactNode | any;
  className?: string;
  children: ReactNode | any;
  tooltipClasses?: string;
  place?: PlacesType;
  openOnClick?: boolean;
  zIndex?: number;
  onPopoverStateChange?: (e: boolean) => void;
  backgroundColor?: string;
  textColor?: string;
  noArrow?: boolean;
  classNameArrow?: string;
  show?: boolean;
}

const MkdPopover = ({
  display,
  className,
  children,
  tooltipClasses,
  place = "bottom",
  openOnClick = true,
  zIndex = 99999,
  onPopoverStateChange,
  backgroundColor = "#FFF",
  textColor = "#000",
  noArrow = false,
  classNameArrow = "border-b border-r",
  show = true,
}: MkdPopoverProps) => {
  const tooltipId = useId();
  const handleTooltipShow = () => {
    if (onPopoverStateChange) {
      onPopoverStateChange(true);
    }
  };

  const handleTooltipHide = () => {
    if (onPopoverStateChange) {
      onPopoverStateChange(false);
    }
  };

  return (
    <>
      <div data-tooltip-id={tooltipId} className={`${className}`}>
        {display ? display : null}
      </div>

      {show ? (
        <ReactTooltip
          // globalCloseEvents={{ scroll: true }}
          id={tooltipId}
          openOnClick={openOnClick}
          style={{ backgroundColor, color: textColor, zIndex: zIndex }}
          className={`z-[${zIndex}]  pr-5 !shadow-md  ${tooltipClasses}`}
          clickable
          place={place}
          opacity={1}
          afterShow={handleTooltipShow}
          afterHide={handleTooltipHide}
          noArrow={noArrow}
          classNameArrow={classNameArrow}
          // disableTooltip={!show}
          // getTextColor={() => textColor}
        >
          {children}
        </ReactTooltip>
      ) : null}
    </>
  );
};

export default MkdPopover;
