import { memo, ReactNode, Ref, useId, useState } from "react";
import classes from "./InteractiveButton.module.css";
import { LoaderTypes, MkdLoader } from "@/components/MkdLoader";

interface InteractiveButtonProps {
  loading?: boolean;
  animate?: boolean;
  disabled?: boolean;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  loaderclasses?: string;
  onClick?: (e?:any) => void;
  color?: string;
  loaderType?: LoaderTypes;
  buttonRef?: Ref<HTMLButtonElement>;
  size?: number
}

const InteractiveButton = ({
  loading = false,
  animate = false,
  disabled,
  children,
  type = "button",
  className,
  loaderclasses,
  onClick,
  color = "#ffffff",
  loaderType = LoaderTypes.BEAT,
  buttonRef = null,
  size= 10
}: InteractiveButtonProps) => {
  const id = useId();

  const [animated, setAnimated] = useState(false);

  const onClickHandle = () => {
    if (onClick) {
      onClick();
    }
    if (animate) {
      setAnimated(true);
    }
  };
  return (
    <button
      id={id}
      type={type}
      ref={buttonRef}
      disabled={disabled}
      className={`${animated && "!animate-wiggle"} ${
        classes.button
      } relative flex h-[2.125rem] w-fit min-w-fit items-center justify-center gap-2 overflow-hidden rounded-md border border-primaryBlue bg-indigo-600 px-[.6125rem]  py-[.5625rem] font-['Inter'] text-sm font-medium leading-none text-white shadow-md shadow-indigo-600  ${className}`}
      onAnimationEnd={() => setAnimated(false)}
      onClick={onClickHandle}
    >
      <>
        {children}

        <MkdLoader
          size={size}
          color={color}
          loading={loading}
          type={loaderType}
          className={loaderclasses}
        />
      </>
    </button>
  );
};

export default memo(InteractiveButton);
