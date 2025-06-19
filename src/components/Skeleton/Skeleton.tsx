import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  counts?: number[];
  circle?: boolean;
}

const SkeletonLoader = ({
  className = "",
  count = 5,
  counts = [2, 1, 3, 1, 1],
  circle = false,
}: SkeletonLoaderProps) => {
  return (
    <div
      className={`flex overflow-hidden flex-col gap-5 p-4 w-full max-h-screen h-fit min-h-fit ${className}`}
      style={
        {
          "--skeleton-color": "var(--background-active)",
          "--skeleton-highlight-color": "var(--background-hover)",
        } as React.CSSProperties
      }
    >
      {/* <Skeleton circle width={60} height={60} /> */}
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={`${_}${index}`}
          count={counts[index] ?? 1}
          height={
            counts[index] && counts[index] > 1
              ? 25
              : index + 1 === count
                ? 25
                : 80
          }
          circle={circle}
          style={{ marginBottom: "0.6rem" }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
