import React from "react";

import { motion } from "framer-motion";

export interface LoadingIndicatorProps {
  dotsClasses?: string;
  size?: number;
  style?: React.CSSProperties;
}

const containerVariant = {
  start: {
    transition: { staggerChildren: 0.2 }
  },
  end: {
    transition: { staggerChildren: 0.2 }
  }
};

const dotsVariants = {
  start: {
    y: "0%"
  },
  end: {
    y: "100%"
  }
};

const loadingTransition = {
  duration: 0.4,
  yoyo: Infinity,
  ease: "easeIn"
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ dotsClasses, size, style }) => {
  const dotsStyles = `block w-[${size ?? 9}px] h-[${size ?? 9}px] bg-slate-900 rounded-md shrink-0 ${dotsClasses ?? ""}`;
  return (
    <motion.div
      variants={containerVariant}
      className={`flex justify-between items-center w-[40px] pb-[10px]`}
      initial="start"
      animate="end"
      style={{ ...style }}
    >
      <motion.span
        className={dotsStyles}
        variants={dotsVariants}
        transition={loadingTransition}
      />
      <motion.span
        className={dotsStyles}
        variants={dotsVariants}
        transition={loadingTransition}
      />
      <motion.span
        className={dotsStyles}
        variants={dotsVariants}
        transition={loadingTransition}
      />
    </motion.div>
  );
};

export default LoadingIndicator;
