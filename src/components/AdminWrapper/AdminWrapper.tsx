import React, { Suspense, memo } from "react";

import { AdminHeader } from "@/components/AdminHeader";
import { TopHeader } from "@/components/TopHeader";
import { Spinner } from "@/assets/svgs";
import { LazyLoad } from "@/components/LazyLoad";
import {colors} from "@/utils/config"

interface AdminWrapperProps {
  children: React.ReactNode;
}

const AdminWrapper = ({ children }: AdminWrapperProps) => {
  return (
    <>
      <div></div>
      <LazyLoad>
        <div
          className={`relative flex h-full max-h-full min-h-full w-full max-w-full overflow-hidden`}
        >
          <AdminHeader />
          <div
            className={`grid h-full max-h-full min-h-full w-full grow grid-rows-[auto_1fr] overflow-x-hidden`}
          >
            <TopHeader />
            <Suspense
              fallback={
                <div
                  className={`flex h-full max-h-full min-h-full w-full items-center justify-center`}
                >
                  <Spinner size={40} color={colors.primary} />
                </div>
              }
            >
              <div className="h-full max-h-full min-h-full w-full overflow-y-auto overflow-x-hidden">
                {children}
              </div>
            </Suspense>
          </div>
        </div>
      </LazyLoad>
    </>
  );
};

export default memo(AdminWrapper);
