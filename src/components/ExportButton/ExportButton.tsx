import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface ExportButtonProps {
  onClick: (e?: any) => void;
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}
const ExportButton = ({
  onClick,
  className,
  showIcon = true,
  showText = true,
}: ExportButtonProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const buttonStyles = {
    backgroundColor: THEME_COLORS[mode].PRIMARY,
    borderColor: THEME_COLORS[mode].PRIMARY,
    color: THEME_COLORS[mode].TEXT_ON_PRIMARY,
    boxShadow: `0 4px 6px -1px ${THEME_COLORS[mode].PRIMARY}40`,
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`relative flex h-[2.125rem] w-fit min-w-fit items-center justify-center gap-2 overflow-hidden rounded-md border px-[.6125rem] py-[.5625rem] font-['Inter'] text-sm font-medium leading-none transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
        style={buttonStyles}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME_COLORS[mode].PRIMARY}40`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = `0 4px 6px -1px ${THEME_COLORS[mode].PRIMARY}40`;
        }}
      >
        {showIcon && (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        )}
        {showText && <span>Export</span>}
      </button>
    </>
  );
};

export default ExportButton;
