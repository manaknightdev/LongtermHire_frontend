import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

export interface LoadingIndicatorProps {
  dotsClasses?: string;
  size?: number;
  style?: React.CSSProperties;
}

const containerVariant = {
  start: {
    transition: { staggerChildren: 0.2 },
  },
  end: {
    transition: { staggerChildren: 0.2 },
  },
};

const dotsVariants = {
  start: {
    y: "0%",
  },
  end: {
    y: "100%",
  },
};

const loadingTransition = {
  duration: 0.4,
  yoyo: Infinity,
  ease: "easeIn",
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  dotsClasses,
  size,
  style,
}) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const dotSize = size ?? 9;
  const dotStyles = {
    width: `${dotSize}px`,
    height: `${dotSize}px`,
    backgroundColor: THEME_COLORS[mode].PRIMARY,
    borderRadius: "6px",
    flexShrink: 0,
    display: "block",
  };

  return (
    <motion.div
      variants={containerVariant}
      className={`flex justify-between items-center w-[40px] pb-[10px]`}
      initial="start"
      animate="end"
      style={{ ...style }}
    >
      <motion.span
        className={dotsClasses}
        style={dotStyles}
        variants={dotsVariants}
        transition={loadingTransition}
      />
      <motion.span
        className={dotsClasses}
        style={dotStyles}
        variants={dotsVariants}
        transition={loadingTransition}
      />
      <motion.span
        className={dotsClasses}
        style={dotStyles}
        variants={dotsVariants}
        transition={loadingTransition}
      />
    </motion.div>
  );
};

export default LoadingIndicator;
