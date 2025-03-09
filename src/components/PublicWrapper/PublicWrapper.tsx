import React, { Suspense, memo } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { Spinner } from "@/assets/svgs";

interface PublicWrapperProps {
  children: React.ReactNode;
}
const PublicWrapper = ({ children }: PublicWrapperProps) => {
  return (
    <>
      <PublicHeader />

      <div className={`min-h-full w-full h-full max-h-full`}>
        <Suspense
          fallback={
            <div
              className={`flex min-h-full w-full h-full max-h-full  items-center justify-center`}
            >
              <Spinner size={40} color="#4F46E5" />
            </div>
          }
        >
          <div className={`min-h-full w-full h-full max-h-full`}>
            {children}
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default memo(PublicWrapper);
