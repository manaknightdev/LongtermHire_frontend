import React from "react";
import { Tabs } from "@/components/ViewWrapper";
import { LazyLoad } from "@/components/LazyLoad";

export type ViewMapType = {
  value: string;
  hasCount?: boolean;
  count?: number;
  icon?: React.ReactNode;
};

// Define a type for the children that includes the view prop
interface ChildWithViewProp {
  view: ViewMapType["value"];
  // Add any other props that the child might have
}

interface ViewWrapperProps {
  children: React.ReactElement<ChildWithViewProp>[]; // Specify that children are React elements with a view prop
  view: string;
  views: Array<ViewMapType["value"]>;
  setView: (view: ViewMapType["value"]) => void;
  viewsMap: Record<string, ViewMapType>;
  className?: string;
  tabClassName?: string;
  tabContainerClassName?: string;
}

const ViewWrapper = ({
  children,
  view,
  views,
  setView,
  viewsMap,
  className,
  tabClassName,
  tabContainerClassName
}: ViewWrapperProps) => {
  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement[];

  return (
    <div
      className={`grid h-full max-h-full min-h-full w-full min-w-full max-w-full grid-rows-[auto_1fr] ${className}`}
    >
      <div
        className={`mb-5 w-full min-w-full max-w-full overflow-auto ${tabContainerClassName}`}
      >
        <LazyLoad>
          <Tabs
            tabs={views}
            view={view}
            setView={setView}
            viewsMap={viewsMap}
            tabClassName={tabClassName}
          />
        </LazyLoad>
      </div>
      {childrenArray.map((child) => (child.props.view === view ? child : null))}
    </div>
  );
};

export default ViewWrapper;
