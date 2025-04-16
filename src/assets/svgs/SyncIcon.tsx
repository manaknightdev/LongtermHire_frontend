import React from "react";

interface SyncIconProps {
  className?: string;
  fill?: string;
  stroke?: string;
  onClick?: () => void;
}

const SyncIcon = ({
  className = "",
  fill = "none",
  stroke = "#A8A8A8",
  onClick,
}: SyncIconProps) => {
  return (
    <svg
      onClick={onClick}
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill={fill}
    >
      <path
        d="M14.1665 4.27133C15.9343 5.55927 17.0832 7.64555 17.0832 10.0002C17.0832 13.9122 13.9119 17.0835 9.99984 17.0835H9.58317M5.83317 15.729C4.06539 14.4411 2.9165 12.3548 2.9165 10.0002C2.9165 6.08815 6.08782 2.91683 9.99984 2.91683H10.4165M10.8332 18.6668L9.1665 17.0002L10.8332 15.3335M9.1665 4.66683L10.8332 3.00016L9.1665 1.3335"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SyncIcon;
