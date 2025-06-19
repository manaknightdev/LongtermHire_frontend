import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import { StringCaser } from "@/utils/utils";
import { useContexts } from "@/hooks/useContexts";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LazyLoad } from "@/components/LazyLoad";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";
import OfflineStatusBar from "../OfflineStatusBar";
import OfflineIndicator from "../OfflineIndicator";

const TopHeader = () => {
  const stringCaser = new StringCaser();
  const {
    globalState: { showBackButton },
  } = useContexts();
  const { state } = useTheme();
  const mode = state?.theme;

  const [currentPath, setCurrentPath] = useState("");
  const location = useLocation();

  useEffect(() => {
    const pathArr = location.pathname.split("/");
    if (pathArr[1] !== "user" && pathArr[1] !== "admin") {
      setCurrentPath(pathArr[1]);
    } else {
      setCurrentPath(pathArr[2]);
    }
  }, [location]);

  const headerStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND,
    borderBottomColor: THEME_COLORS[mode].BORDER,
    color: THEME_COLORS[mode].TEXT,
    boxShadow: `0 1px 3px 0 ${THEME_COLORS[mode].SHADOW}20, 0 1px 2px 0 ${THEME_COLORS[mode].SHADOW}10`,
  };

  return (
    <div
      className="sticky right-0 top-0 z-20 flex h-14 max-h-14 w-full items-center justify-between border-b px-6 py-4 transition-colors duration-200"
      style={headerStyles}
    >
      <div className="flex items-center gap-3">
        {showBackButton && <BackButton />}
        <h1
          className="text-base capitalize font-medium transition-colors duration-200"
          style={{ color: THEME_COLORS[mode].TEXT }}
        >
          {currentPath === "generate-ui"
            ? "Generate UI"
            : stringCaser.Capitalize(currentPath, {
                separator: " ",
              })}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <OfflineIndicator showWhenOnline={true} />
        <LazyLoad>
          <ThemeToggle className="transition-all duration-200 hover:scale-105" />
        </LazyLoad>
      </div>
    </div>
  );
};

export default TopHeader;
