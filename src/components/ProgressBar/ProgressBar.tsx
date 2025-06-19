import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface ProgressBarProps {
  percentage: number;
  color?: string;
  backgroundColor?: string;
}

const ProgressBar = ({
  percentage,
  color,
  backgroundColor,
}: ProgressBarProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const progressBarStyles = {
    backgroundColor: backgroundColor || THEME_COLORS[mode].BACKGROUND_SECONDARY,
    borderColor: THEME_COLORS[mode].BORDER,
  };

  const progressFillStyles = {
    width: `${percentage}%`,
    color: color || THEME_COLORS[mode].TEXT_ON_PRIMARY,
    backgroundColor: THEME_COLORS[mode].PRIMARY,
  };

  return (
    <div className="w-full">
      <div
        className="shadow w-full border rounded-md overflow-hidden transition-colors duration-200"
        style={progressBarStyles}
      >
        <div
          className="text-xs leading-none py-1 text-center transition-all duration-300 ease-out"
          style={progressFillStyles}
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
