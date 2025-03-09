import { LoadingIndicator } from "@/components/LoadingIndicator";

interface LoaderProps {
  style?: React.CSSProperties;
}

const Loader: React.FC<LoaderProps> = ({ style }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "80vh",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <LoadingIndicator />
    </div>
  );
};

export default Loader;
