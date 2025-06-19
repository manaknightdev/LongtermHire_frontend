import React from "react";

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  fill?: string;
}

interface PathProps extends React.SVGProps<SVGPathElement> {
  className?: string;
  stroke?: string;
}

interface CaretLeftProps {
  svgProps?: SVGProps;
  pathProps?: PathProps;
}

export const CaretLeft = ({ svgProps, pathProps }: CaretLeftProps) => {
  return (
    <svg
      {...svgProps}
      className={`${svgProps?.className}`}
      width={svgProps?.width}
      height={svgProps?.height}
      viewBox={svgProps?.viewBox}
      fill={svgProps?.fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 13L1 7L7 1"
        {...pathProps}
        stroke={pathProps?.stroke}
        className={`${pathProps?.className}`}
        strokeWidth={pathProps?.strokeWidth}
        strokeLinecap={pathProps?.strokeLinecap}
        strokeLinejoin={pathProps?.strokeLinejoin}
      />
    </svg>
  );
};

CaretLeft.defaultProps = {
  svgProps: {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    fill: "none",
  },
  pathProps: {
    stroke: "#000000",
    className: "",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
};
