import React, { useState } from "react";

interface MkdWizardContainerProps {
  children: React.ReactNode;
  className?: string;
}

const MkdWizardContainer = ({
  children,
  className,
}: MkdWizardContainerProps) => {
  const [activeId, setActiveId] = useState(1);

  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement[];

  const activeIndex = childrenArray.findIndex(
    (child) => child.props?.componentId === activeId
  );

  const handlePreviousClick = () => {
    const newIndex = activeIndex - 1;
    if (newIndex >= 0) {
      setActiveId(childrenArray[newIndex].props.componentId);
    }
  };

  const handleNextClick = () => {
    const newIndex = activeIndex + 1;
    if (newIndex < childrenArray.length) {
      setActiveId(childrenArray[newIndex].props.componentId);
    }
  };

  return (
    <div className={`flex w-[100%] flex-col items-center ${className}`}>
      <div className="component-wrapper">
        {childrenArray.map((child) =>
          child.props.componentId === activeId ? child : null
        )}
      </div>
      <div className="flex w-full items-center justify-between">
        <button
          className="rounded-md bg-primary hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed px-6 py-2 text-white transition-colors duration-200"
          onClick={handlePreviousClick}
          disabled={activeIndex === 0}
        >
          Previous
        </button>
        <button
          className="rounded-md bg-primary hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed px-6 py-2 text-white transition-colors duration-200"
          onClick={handleNextClick}
          disabled={activeIndex === childrenArray.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MkdWizardContainer;
