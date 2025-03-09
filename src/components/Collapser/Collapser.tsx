import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronUpIcon } from "@/assets/svgs";

interface CollapserProps {
  title?: string;
  children: React.ReactNode;
  expand?: boolean;
  iconStroke?: string;
  titleClasses?: string;
  onExpandRef?: React.RefObject<HTMLButtonElement>;
  onCollapseRef?: React.RefObject<HTMLButtonElement>;
  className?: string;
}

const Collapser = ({
  title = "Title",
  children,
  expand = false,
  iconStroke = "black",
  titleClasses = "",
  onExpandRef,
  onCollapseRef,
  className = "border-y border-soft-200",
}: CollapserProps) => {
  const collapseRef = useRef(null) as any;
  const [collapsed, setCollapsed] = useState(true) as any;

  const toggleCollapse = useCallback(() => {
    if (collapseRef.current) {
      if (collapsed) {
        collapseRef.current.style.maxHeight = `${collapseRef?.current?.scrollHeight}px`;
        // collapseRef.current.style.overflowY = `auto`;
        setCollapsed(false);
      } else {
        collapseRef.current.style.maxHeight = null;
        // collapseRef.current.style.overflowY = "hidden";
        setCollapsed(true);
      }
    }
  }, [collapseRef, collapsed]);

  const onCollapse = useCallback(() => {
    if (collapseRef?.current) {
      if (!collapsed) {
        collapseRef.current.style.maxHeight = null;
        setCollapsed(true);
      }
    }
  }, [collapseRef, collapsed]);

  const onExpand = useCallback(() => {
    if (collapseRef?.current) {
      // if (!collapsed) {
      collapseRef.current.style.maxHeight = `${collapseRef?.current?.scrollHeight}px`;
      setCollapsed(false);
      // }
    }
  }, [collapseRef, collapsed]);

  useEffect(() => {
    if (expand) {
      setTimeout(() => {
        // collapseRef.current.style.maxHeight = `100%`;
        collapseRef.current.style.maxHeight = `${collapseRef?.current?.scrollHeight}px`;
        // collapseRef.current.style.overflowY = `auto`;
        setCollapsed(false);
      }, 1000);
    }
  }, [expand]);

  return (
    <div className={`w-full bg-white ${className}`}>
      <button
        type="button"
        hidden
        ref={onCollapseRef}
        onClick={() => onCollapse()}
      ></button>
      <button
        type="button"
        hidden
        ref={onExpandRef}
        onClick={() => onExpand()}
      ></button>
      {/*  */}
      <div
        onClick={toggleCollapse}
        className={`flex h-[3rem] max-h-[3rem] min-h-[3rem] w-full cursor-pointer items-center justify-between gap-3 self-stretch rounded-md py-[.75rem] pl-[.75rem] font-bold text-black ${titleClasses}`}
      >
        <ChevronUpIcon
          className={`relative h-[1.125rem] w-[1.125rem] cursor-pointer  ${
            collapsed ? "rotate-90" : "rotate-180"
          } `}
          stroke={iconStroke}
        />
        <div className="grow font-inter text-sm font-[600] capitalize leading-[1.25rem] ">
          {title}
        </div>
      </div>
      <br />
      {/*  */}
      <div
        ref={collapseRef}
        className="max-h-0 overflow-y-hidden font-inter transition-all"
      >
        {children}
      </div>
    </div>
  );
};

export default Collapser;
