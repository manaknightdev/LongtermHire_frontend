import { useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface PaginationBarProps {
  updatePageSize: (pageSize: number) => void;
  pageSize: number;
  startSize: number;
  multiplier: number;
  canChangeLimit: boolean;
}

const LimitSelect = ({
  updatePageSize,
  pageSize,
  startSize,
  multiplier,
  canChangeLimit = true,
}: PaginationBarProps) => {
  const { state } = useTheme();
  const mode = state?.theme;
  const startSizeMemo = useMemo(() => startSize, [startSize]);
  const multiplierMemo = useMemo(() => multiplier, [multiplier]);

  const selectStyles = {
    backgroundColor: THEME_COLORS[mode].INPUT,
    color: THEME_COLORS[mode].TEXT,
    borderColor: THEME_COLORS[mode].BORDER,
  };

  const disabledStyles = {
    backgroundColor: THEME_COLORS[mode].INPUT_DISABLED,
    color: THEME_COLORS[mode].TEXT_DISABLED,
    borderColor: THEME_COLORS[mode].BORDER,
  };

  return (
    <>
      {startSizeMemo ? (
        <select
          disabled={!canChangeLimit}
          style={!canChangeLimit ? disabledStyles : selectStyles}
          className={`${
            !canChangeLimit
              ? "appearance-none bg-none px-2 cursor-not-allowed"
              : "hover:border-border-hover"
          } h-[2.5rem] max-h-[2.5rem] w-fit min-w-fit self-end rounded-[.625rem] py-[.375rem] border transition-colors duration-200 focus:outline-none focus:border-primary`}
          value={pageSize}
          onChange={(e) => {
            updatePageSize(Number(e.target.value));
          }}
        >
          {Array.from({ length: 6 }).map((_, startSizeMemoIndex) => {
            return (
              <option
                key={
                  Number(startSizeMemo) + multiplierMemo * startSizeMemoIndex
                }
                value={
                  Number(startSizeMemo) + multiplierMemo * startSizeMemoIndex
                }
              >
                {!canChangeLimit ? "Showing" : "Show"}{" "}
                {Number(startSizeMemo) + multiplierMemo * startSizeMemoIndex}
              </option>
            );
          })}
        </select>
      ) : null}
    </>
  );
};

export default LimitSelect;
