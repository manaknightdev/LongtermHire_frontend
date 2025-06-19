import { CaretLeft } from "@/assets/svgs";
import { NavLink, To, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface BackButtonProps {
  text?: string;
  link?: To;
}

const BackButton = ({ text, link }: BackButtonProps) => {
  const navigate = useNavigate();
  const { state } = useTheme();
  const mode = state?.theme;

  const baseClasses =
    "flex items-center gap-3 transition-colors duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const themeStyles = {
    color: THEME_COLORS[mode].TEXT,
  };
  const focusStyles = {
    boxShadow: `0 0 0 2px ${THEME_COLORS[mode].PRIMARY}40`,
  };

  return (
    <div>
      {link ? (
        <NavLink
          className={baseClasses}
          style={themeStyles}
          to={link}
          onFocus={(e) => {
            Object.assign(e.currentTarget.style, focusStyles);
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "";
          }}
        >
          <CaretLeft pathProps={{ stroke: THEME_COLORS[mode].TEXT }} />
          {text && text}
        </NavLink>
      ) : (
        <button
          type="button"
          className={baseClasses}
          style={themeStyles}
          onClick={() => navigate(-1)}
          onFocus={(e) => {
            Object.assign(e.currentTarget.style, focusStyles);
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "";
          }}
        >
          <CaretLeft pathProps={{ stroke: THEME_COLORS[mode].TEXT }} />
          {text && text}
        </button>
      )}
    </div>
  );
};

export default BackButton;
