import React, { useState } from "react";
import { StringCaser } from "@/utils/utils";

interface MkdTabContainerProps {
  tabs?: string[];
  children: React.ReactNode;
  className?: string;
}

const MkdTabContainer = ({
  tabs = ["Tab One", "Tab Two"],
  children,
  className = "",
}: MkdTabContainerProps) => {
  const stringCaser = new StringCaser();

  const [activeId, setActiveId] = useState(0);

  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement[];

  return (
    <>
      <div
        className={`h-fit w-full cursor-pointer rounded-md transition-all ${className}`}
      >
        <div className="flex h-full max-h-full min-h-full w-full min-w-full max-w-full flex-col items-center">
          <div className="mb-5 flex w-full items-center border-b border-t border-border bg-background p-2 px-7 font-medium text-secondary">
            {tabs?.length
              ? tabs?.map((tab, tabKey) => (
                  <button
                    key={tabKey}
                    onClick={() => setActiveId(tabKey)}
                    className={`grow cursor-pointer rounded-lg px-3 py-1 transition-all hover:bg-background-hover ${
                      activeId === tabKey
                        ? "bg-background-active text-text"
                        : "text-secondary"
                    }`}
                  >
                    {stringCaser.Capitalize(tab, {
                      separator: " ",
                    })}
                  </button>
                ))
              : null}
          </div>
          {childrenArray.map((child) =>
            child.props.componentId === activeId ? child : null
          )}
        </div>
      </div>
    </>
  );
};

export default MkdTabContainer;
