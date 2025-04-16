import { useState } from "react";

export default function LandingTabSelector() {
  const [selected, setSelected] = useState();
  const selectedClassNames = `rounded-[6px] bg-gradient-to-r from-[#262626] to-[#525252]  text-gray-100 text-gray-100 px-1 py-1 md:px-3 md:py-2`;
  return (
    <div className="mx-auto flex w-fit max-w-full items-center gap-1 rounded-[8px] border border-gray-200 p-1 pr-3 md:gap-5">
      <button className={`${selectedClassNames} text-[.40rem]  md:text-xs `}>
        Wireframes &nbsp;✍️
      </button>
      <div>
        <svg
          width="21"
          height="20"
          className="h-[14px] w-[15px] md:h-[20px] md:w-[21px]"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.4435 4.86011L17.0626 9.47917C17.388 9.80461 17.388 10.3322 17.0626 10.6577L12.4435 15.2768M16.6102 10.0684H3.69348"
            stroke="#8D8D8D"
            stroke-width="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <button className={`text-[.40rem] md:text-xs`}>
        Working Prototype &nbsp; ⚙️
      </button>
      <div>
        <svg
          width="21"
          height="20"
          className="h-[14px] w-[15px] md:h-[20px] md:w-[21px]"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.4435 4.86011L17.0626 9.47917C17.388 9.80461 17.388 10.3322 17.0626 10.6577L12.4435 15.2768M16.6102 10.0684H3.69348"
            stroke="#8D8D8D"
            stroke-width="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <button className="text-[.40rem] md:text-xs">Code export 🧑🏼‍💻</button>
      <div>
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          className="h-[14px] w-[15px] md:h-[20px] md:w-[21px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.4435 4.86011L17.0626 9.47917C17.388 9.80461 17.388 10.3322 17.0626 10.6577L12.4435 15.2768M16.6102 10.0684H3.69348"
            stroke="#8D8D8D"
            stroke-width="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <button className="text-[.40rem] md:text-xs">API (by AI✨)</button>
    </div>
  );
}
