import { Fragment } from "react";
import { LazyLoad } from "@/components/LazyLoad";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

export type OptionType = {
  name: string;
  route: string;
};

interface RouteChangeProps {
  onClose: () => void;
  options: Array<OptionType>;
}

export const RouteChange = ({
  onClose,
  options = [
    {
      name: "",
      route: "",
    },
  ],
}: RouteChangeProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  return (
    <LazyLoad>
      <Fragment>
        <div className="grid grid-cols-2 flex-wrap gap-2 text-center">
          {options?.map((option, optionKey) => {
            return (
              <Link
                key={optionKey}
                onClick={onClose}
                to={option?.route}
                className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  color: THEME_COLORS[mode].TEXT,
                  backgroundColor: THEME_COLORS[mode].BACKGROUND_SECONDARY,
                  borderColor: THEME_COLORS[mode].BORDER,
                  border: `1px solid ${THEME_COLORS[mode].BORDER}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    THEME_COLORS[mode].BACKGROUND_HOVER;
                  e.currentTarget.style.color = THEME_COLORS[mode].TEXT_HOVER;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    THEME_COLORS[mode].BACKGROUND_SECONDARY;
                  e.currentTarget.style.color = THEME_COLORS[mode].TEXT;
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME_COLORS[mode].PRIMARY}40`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {option?.name}
              </Link>
            );
          })}
        </div>
      </Fragment>
    </LazyLoad>
  );
};

export default RouteChange;
