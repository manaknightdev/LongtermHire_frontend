interface ProgressBarProps {
  percentage: number;
  color: string;
  backgroundColor: string;
}

const ProgressBar = ({
  percentage,
  color,
  backgroundColor,
}: ProgressBarProps) => {
  return (
    <div className="w-full">
      <div className="shadow w-full bg-grey-light">
        <div
          className="bg-blue text-xs leading-none py-1 text-center text-white"
          style={{
            width: percentage,
            color: color,
            backgroundColor: backgroundColor,
          }}
        >
          {percentage}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
