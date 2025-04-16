import { useCallback, memo } from "react";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { MkdButton } from "@/components/MkdButton";

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  showIcons?: boolean;
}
const MultiSelect = ({
  label,
  options,
  selected,
  setSelected,
  showIcons = true,
}: MultiSelectProps) => {
  const toggleOption = useCallback(
    (option: string) => {
      let temp = selected && selected?.length ? [...selected] : [];
      const index = temp.findIndex((i) => i === option);
      if (index > -1) {
        temp.splice(index, 1);
        if (setSelected) {
          setSelected([...temp]);
        }
      } else {
        temp.push(option);
        if (setSelected) {
          setSelected([...temp]);
        }
      }
    },
    [selected]
  );

  const toggleAllOptions = useCallback(() => {
    let temp = selected && selected?.length ? [...selected] : [];
    if (temp?.length === options?.length) {
      if (setSelected) {
        setSelected([]);
      }
    } else {
      if (setSelected) {
        setSelected([...options]);
      }
    }
  }, [selected]);

  const isAllSelected = () => {
    return selected?.length === options?.length;
  };

  return (
    <div className={`group relative w-full`}>
      <div
        className={`${
          label ? "flex" : "hidden"
        }  items-center justify-between rounded-md p-[10px] pl-0.5 text-[14px]`}
      >
        <div>{label}</div>
      </div>

      <div
        className={`left-0 z-10 flex w-full list-none flex-wrap gap-4 overflow-auto rounded-b-md bg-white p-4 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
      >
        <MkdButton
          showPlus={false}
          className={`!rounded-full hover:border-[#e25679] hover:bg-[#e25679] hover:shadow-[#e25679] ${
            isAllSelected()
              ? "!border-[#e25679] !bg-[#e25679] !shadow-[#e25679] "
              : "bg-primaryBlue"
          } `}
          onClick={() => toggleAllOptions()}
        >
          <span className={`pl-1.5 text-white`}>{"All"}</span>
          {showIcons && (
            <>
              {isAllSelected() ? (
                <CheckIcon className={`h-4 w-6 text-lg font-bold text-white`} />
              ) : (
                <PlusIcon className={`h-4 w-6 text-lg font-bold text-white`} />
              )}
            </>
          )}
        </MkdButton>
        {options.map((option, key) => {
          const isSelected = selected?.includes(option);
          return (
            <MkdButton
              showPlus={false}
              key={key}
              className={`!rounded-full hover:border-[#e25679] hover:bg-[#e25679] hover:shadow-[#e25679] ${
                isSelected
                  ? "!border-[#e25679] !bg-[#e25679] !shadow-[#e25679]"
                  : ""
              } `}
              onClick={() => toggleOption(option)}
            >
              <span className={`pl-1.5 text-white`}>{option}</span>
              {showIcons && (
                <>
                  {isSelected ? (
                    <CheckIcon
                      className={`h-4 w-6 text-lg font-bold text-white`}
                    />
                  ) : (
                    <PlusIcon
                      className={`h-4 w-6 text-lg font-bold text-white`}
                    />
                  )}
                </>
              )}
            </MkdButton>
          );
        })}
      </div>
    </div>
  );
};

export default memo(MultiSelect);
