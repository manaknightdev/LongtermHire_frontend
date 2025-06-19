import { Link } from "react-router-dom";
import { BrandLogo } from "@/assets/images";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LazyLoad } from "@/components/LazyLoad";
import OfflineIndicator from "../OfflineIndicator";

export const PublicHeader = () => {
  const { state } = useTheme();
  const mode = state?.theme;

  const headerStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND,
    borderBottomColor: THEME_COLORS[mode].BORDER,
  };

  const logoStyles = {
    color: THEME_COLORS[mode].TEXT,
  };

  const supportButtonStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND_SECONDARY,
    borderColor: THEME_COLORS[mode].BORDER,
    color: THEME_COLORS[mode].TEXT,
  };

  return (
    <div>
      <nav
        className="flex min-h-[50px] items-center justify-between border-b px-6 py-2 transition-colors duration-200"
        style={headerStyles}
      >
        <Link
          to="/"
          className="h-14 min-h-14 max-h-14 gap-5 flex items-center font-bold transition-all duration-200 hover:opacity-80"
          style={logoStyles}
        >
          <img
            className="h-[70%] object-contain"
            src={BrandLogo}
            alt="MTP Builder Logo"
          />
          MTP - Builder
        </Link>

        <div className="flex items-center gap-3">
          <OfflineIndicator showWhenOnline={true} />
          <LazyLoad>
            <ThemeToggle className="transition-all duration-200 hover:scale-105" />
          </LazyLoad>
          <div
            className="flex cursor-pointer items-center rounded-md border px-3 py-2 shadow-sm transition-all duration-200 hover:scale-95 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={supportButtonStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                THEME_COLORS[mode].BACKGROUND_HOVER;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                THEME_COLORS[mode].BACKGROUND_SECONDARY;
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME_COLORS[mode].PRIMARY}40`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "";
            }}
            tabIndex={0}
            role="button"
            aria-label="Support"
          >
            Support
          </div>
        </div>
      </nav>
    </div>
  );
};

export default PublicHeader;
