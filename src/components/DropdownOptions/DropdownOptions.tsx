import { KebabIcon } from "@/assets/svgs";
import { LazyLoad } from "@/components/LazyLoad";

interface DropdownOptionsProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  childrenWrapperClass?: string;
  iconWrapperClass?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DropdownOptions = ({
  icon,
  children,
  childrenWrapperClass = "",
  iconWrapperClass = "",
  className = "",
  style,
}: DropdownOptionsProps) => {
  return (
    <div
      style={style}
      className={`relative flex items-center justify-center ${className}`}
    >
      <LazyLoad>
        <button className={`peer relative ${iconWrapperClass}`}>
          {icon ? icon : <KebabIcon />}
        </button>
      </LazyLoad>
      <div
        className={`absolute right-0 top-[85%] z-[9999999999] m-auto hidden  whitespace-nowrap rounded-lg border border-[#a8a8a8] bg-white p-2 text-sm text-[#525252] shadow-md hover:block focus:block peer-focus:block peer-focus-visible:block ${childrenWrapperClass} `}
      >
        {children}
      </div>
    </div>
  );
};

export default DropdownOptions;
