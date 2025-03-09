import { useMemo } from "react";

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
  const startSizeMemo = useMemo(() => startSize, [startSize]);
  const multiplierMemo = useMemo(() => multiplier, [multiplier]);

  return (
    <>
      {startSizeMemo ? (
        <select
          disabled={!canChangeLimit}
          className={`${
            !canChangeLimit ? "appearance-none bg-none px-2" : ""
          } h-[2.5rem] max-h-[2.5rem] w-fit min-w-fit self-end rounded-[.125rem] border-black bg-brown-main-bg py-[.375rem]`}
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
