import { KebabIcon } from "@/assets/svgs";
import { LazyLoad } from "@/components/LazyLoad";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface DropdownOptionsProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  childrenWrapperClass?: string;
  iconWrapperClass?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DropdownOptions = ({
  icon,
  children,
  childrenWrapperClass = "",
  iconWrapperClass = "",
  className = "",
  style,
}: DropdownOptionsProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const dropdownStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND,
    color: THEME_COLORS[mode].TEXT,
    borderColor: THEME_COLORS[mode].BORDER,
    boxShadow: `0 4px 6px -1px ${THEME_COLORS[mode].SHADOW}20, 0 2px 4px -1px ${THEME_COLORS[mode].SHADOW}10`,
  };
  return (
    <div
      style={style}
      className={`relative flex items-center justify-center ${className}`}
    >
      <LazyLoad>
        <button className={`peer relative ${iconWrapperClass}`}>
          {icon ? icon : <KebabIcon />}
        </button>
      </LazyLoad>
      <div
        style={dropdownStyles}
        className={`absolute right-0 top-[85%] z-[9999999999] m-auto hidden  whitespace-nowrap rounded-lg border p-2 text-sm shadow-md hover:block focus:block peer-focus:block peer-focus-visible:block transition-colors duration-200 ${childrenWrapperClass} `}
      >
        {children}
      </div>
    </div>
  );
};

export default DropdownOptions;
