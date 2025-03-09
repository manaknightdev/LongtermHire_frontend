import React from "react";

const AlertCircle = ({ className = "", stroke = "#334564" }) => {
  return (
    <svg
      className={`${className}`}
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="alert-circle">
        <path
          id="Icon"
          d="M7.9987 5.8335V8.50016M7.9987 11.1668H8.00536M14.6654 8.50016C14.6654 12.1821 11.6806 15.1668 7.9987 15.1668C4.3168 15.1668 1.33203 12.1821 1.33203 8.50016C1.33203 4.81826 4.3168 1.8335 7.9987 1.8335C11.6806 1.8335 14.6654 4.81826 14.6654 8.50016Z"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default AlertCircle;
