import { memo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface BasicTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const BasicTextarea = ({
  className = "",
  style = {},
  ...props
}: BasicTextareaProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const themeStyles = {
    color: THEME_COLORS[mode].TEXT,
    backgroundColor: THEME_COLORS[mode].INPUT_BACKGROUND,
    borderColor: THEME_COLORS[mode].BORDER,
    ...style,
  };

  const baseClasses =
    "w-full px-3 py-2 border rounded-md resize-vertical min-h-[100px] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 hover:border-border-hover disabled:bg-input-disabled disabled:text-text-disabled disabled:cursor-not-allowed";

  return (
    <textarea
      className={`${baseClasses} ${className}`}
      style={themeStyles}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = THEME_COLORS[mode].PRIMARY;
        e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME_COLORS[mode].PRIMARY}40`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = THEME_COLORS[mode].BORDER;
        e.currentTarget.style.boxShadow = "";
      }}
      {...props}
    />
  );
};

export default memo(BasicTextarea);
