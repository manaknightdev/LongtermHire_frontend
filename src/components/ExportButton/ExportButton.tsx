interface ExportButtonProps {
  onClick: (e?: any) => void;
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}
const ExportButton = ({
  onClick,
  className,
  showIcon = true,
  showText = true,
}: ExportButtonProps) => {
  return (
    <>
      <button
        onClick={onClick}
        className={`relative flex h-[2.125rem] w-fit min-w-fit items-center  justify-center gap-2 overflow-hidden rounded-md border border-primaryBlue bg-indigo-600 px-[.6125rem]  py-[.5625rem] font-['Inter'] text-sm font-medium leading-none text-white shadow-md shadow-indigo-600 ${className}`}
      >
        {showIcon && (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        )}
        {showText && <span>Export</span>}
      </button>
    </>
  );
};

export default ExportButton;
