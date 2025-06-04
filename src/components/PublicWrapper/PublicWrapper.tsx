import React, { Suspense, memo } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { Spinner } from "@/assets/svgs";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface PublicWrapperProps {
  children: React.ReactNode;
}
const PublicWrapper = ({ children }: PublicWrapperProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  return (
    <>
      <PublicHeader />

      <div className={`min-h-full w-full h-full max-h-full`}>
        <Suspense
          fallback={
            <div
              className={`flex min-h-full w-full h-full max-h-full  items-center justify-center`}
            >
              <Spinner size={40} color={THEME_COLORS[mode].PRIMARY} />
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
