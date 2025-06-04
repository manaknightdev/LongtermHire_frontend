import { useTheme } from "@/hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa";
import { Theme } from "@/utils/Enums";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { state, dispatch, TOGGLE_THEME } = useTheme();
  const isDark = state.theme === Theme.DARK;

  const toggleTheme = () => {
    dispatch({ type: TOGGLE_THEME });
  };

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center rounded-md p-2 transition-colors ${
        isDark
          ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
      } ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
    </button>
  );
};

export default ThemeToggle;
