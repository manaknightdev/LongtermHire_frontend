import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface LoaderProps {
  style?: React.CSSProperties;
}

const Loader: React.FC<LoaderProps> = ({ style }) => {
  const { state } = useTheme();
  const mode = state?.theme;

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "80vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: THEME_COLORS[mode].BACKGROUND,
        ...style,
      }}
    >
      <LoadingIndicator />
    </div>
  );
};

export default Loader;
