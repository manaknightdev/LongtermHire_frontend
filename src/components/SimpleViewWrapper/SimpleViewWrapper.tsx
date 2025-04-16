import React from "react";
import { LazyLoad } from "@/components/LazyLoad";
import { SimpleTabs } from "@/components/SimpleViewWrapper";

interface SimpleViewWrapperProps {
  children: React.ReactNode;
  view: string;
  views: any[];
  setView: (view: string) => void;
  viewsMap: any;
  mode?: "static" | "tabs";
}
const ViewWrapper = ({
  children,
  view,
  views,
  setView,
  viewsMap,
  mode = "static"
}: SimpleViewWrapperProps) => {
  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement[];

  return (
    <div className="grid h-full max-h-full min-h-full w-full grid-rows-[auto_1fr] items-start">
      <div className="mb-5 flex w-full min-w-full max-w-full flex-col items-center justify-between gap-5 overflow-x-hidden md:flex-row">
        <LazyLoad>
          <SimpleTabs
            tabs={views}
            view={view}
            setView={setView}
            viewsMap={viewsMap}
          />
        </LazyLoad>
      </div>
      {["static"].includes(mode) ? (
        children
      ) : ["tabs"].includes(mode) ? (
        <>
          {childrenArray.map((child) =>
            child.props.view === view ? child : null
          )}
        </>
      ) : null}
    </div>
  );
};

export default ViewWrapper;
