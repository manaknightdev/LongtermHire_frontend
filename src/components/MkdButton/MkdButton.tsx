import { ReactNode, useState } from "react";
import classes from "./MkdButton.module.css";

interface MkdButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  showPlus?: boolean;
  disabled?: boolean;
  className?: string;
  showChildren?: boolean;
  title?: any;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  icon?: ReactNode;
  animation?: boolean;
}

const MkdButton = ({
  onClick,
  children = "Add New",
  showPlus = false,
  className,
  title,
  disabled = false,
  showChildren = true,
  type = "button",
  loading = false,
  icon = null,
  animation = true,
}: MkdButtonProps) => {
  const [animate, setAnimate] = useState(false);

  const onClickHandle = () => {
    if (onClick) {
      onClick();
    }
    if (animation) {
      setAnimate(true);
    }
  };

  // const classes = ` after:bg-[#90EE90] after:block after:absolute after:pt-[300%] after:pl-[350%] after:!ml-[-1.25rem] after:mt-[-120%] after:opacity-0 after:transition-all active:after:p-0 active:after:m-0 active:after:opacity-100 `;

  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onAnimationEnd={() => setAnimate(false)}
      onClick={onClickHandle}
      className={`${animate && "animate-wiggle"} ${
        classes.button
      } relative flex h-[2.125rem] w-fit min-w-fit  items-center justify-center overflow-hidden rounded-md border border-primary bg-primary px-[.6125rem]  py-[.5625rem] font-['Inter'] text-sm font-medium leading-none text-white  ${className}`}
    >
      {loading ? null : icon}
      {showPlus ? "+" : null} {showChildren ? children : null}
    </button>
  );
};

export default MkdButton;
