import React from "react";

interface LoadCheckIconProps {
  className?: string;
  loaderStroke?: string;
  checkStroke?: string;
  onClick?: () => void;
  title?: string;
  icon?: "loader" | "check";
}
const LoadCheckIcon = ({
  className = "",
  loaderStroke = "#4F46E5",
  checkStroke = "#059669",
  onClick,
  title,
  icon = "check",
}: LoadCheckIconProps) => {
  return (
    <div title={title}>
      {icon === "loader" ? (
        <svg
          className={`animate animate-spin ${className}`}
          onClick={onClick}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M1.3335 6.66667C1.3335 6.66667 2.67015 4.84548 3.75605 3.75883C4.84196 2.67218 6.34256 2 8.00016 2C11.3139 2 14.0002 4.68629 14.0002 8C14.0002 11.3137 11.3139 14 8.00016 14C5.26477 14 2.9569 12.1695 2.23467 9.66667M1.3335 6.66667V2.66667M1.3335 6.66667H5.3335"
            stroke={loaderStroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {icon === "check" ? (
        <svg
          className={`${className}`}
          onClick={onClick}
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="18"
          viewBox="0 0 19 18"
          fill="none"
        >
          <path
            d="M15.5 4.5L7.25 12.75L3.5 9"
            stroke={checkStroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </div>
  );
};

export default LoadCheckIcon;
