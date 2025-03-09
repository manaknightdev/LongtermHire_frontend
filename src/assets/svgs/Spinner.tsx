import { useId } from "react";
import MoonLoader from "react-spinners/MoonLoader";
const override = {
  // display: "block",
  // margin: "0 auto",
  borderColor: "red",
};

interface SpinnerProps {
  className?: string;
  size?: number;
  color?: string;
}

export const Spinner = ({ size = 20, color = "#ffffff" }: SpinnerProps) => {
  const id = useId();
  return (
    <MoonLoader
      color={color}
      loading={true}
      cssOverride={override}
      size={size}
      // aria-label="Loading Spinner"
      data-testid={id}
    />
  );
};
