import React, { memo, Suspense } from "react";
import { Skeleton } from "@/components/Skeleton";
import { MKDLOGO } from "@/assets/images";
import { ViewMapType } from "@/components/ViewWrapper";

interface LazyLoadProps {
  children: React.ReactNode;
  counts?: number[];
  count?: number;
  className?: string;
  circle?: boolean;
  brand?: boolean;
  view?: ViewMapType["value"];
}

const LazyLoad = ({
  children,
  counts = [1],
  count = 1,
  className: propClassName,
  circle = false,
  brand = false,
  view: _view, // Prefix with underscore to indicate it's intentionally unused
}: LazyLoadProps) => {
  const childrenArray = React.Children.toArray(children).filter(
    Boolean
  ) as React.ReactElement[];

  // Use the provided className prop if available, otherwise try to get it from children
  const className =
    propClassName ||
    (childrenArray.length > 0 && childrenArray[0]?.props?.className) ||
    "";
  // console.log("childrenArray >>", childrenArray);
  // console.log("className >>", className);

  return (
    <Suspense
      fallback={
        brand ? (
          <div className="flex h-svh max-h-svh min-h-svh w-full min-w-full max-w-full flex-col items-center justify-center bg-black">
            <img src={MKDLOGO} className="!h-[12.25rem]" />

            <span className="text-[2.8125rem] text-white">Wireframe v5</span>
          </div>
        ) : (
          <Skeleton
            counts={counts}
            count={count}
            className={className}
            circle={circle}
          />
        )
      }
    >
      {children}
    </Suspense>
  );
};

export default memo(LazyLoad);
