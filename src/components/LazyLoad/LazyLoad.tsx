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
  // className,
  circle = false,
  brand = false
}: LazyLoadProps) => {
  const childrenArray = React.Children.toArray(children).filter(
    Boolean
  ) as React.ReactElement[];
  const className = childrenArray.filter(Boolean)[0]?.props?.className
    ? childrenArray[0]?.props?.className
    : "";
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
