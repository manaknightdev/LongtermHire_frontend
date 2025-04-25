import { NarrowUpArrowIcon } from "@/assets/svgs";
import { useCallback, useState } from "react";
import { LimitSelect } from "./index";
import { MkdPopover } from "@/components/MkdPopover";
import { LazyLoad } from "@/components/LazyLoad";

interface PaginationBarProps {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  updatePageSize: (pageSize: number) => void;
  previousPage?: () => void;
  nextPage?: () => void;
  startSize: number;
  multiplier: number;
  updateCurrentPage: (page: number) => void;
  canChangeLimit: boolean;
}
const PaginationBar = ({
  currentPage,
  pageCount,
  pageSize,
  canPreviousPage,
  canNextPage,
  updatePageSize,
  // previousPage,
  // nextPage,
  startSize = 500,
  multiplier = 100,
  updateCurrentPage,
  canChangeLimit = true
}: PaginationBarProps) => {
  const [showAboveFive, setShowAboveFive] = useState(false);

  const nextPage = useCallback(() => {
    if (canNextPage && currentPage + 1 <= pageCount) {
      updateCurrentPage(currentPage + 1);
    }
  }, [canNextPage, currentPage, pageCount, updateCurrentPage]);

  const previousPage = useCallback(() => {
    if (canPreviousPage && currentPage - 1 > 0) {
      updateCurrentPage(currentPage - 1);
    }
  }, [canPreviousPage, currentPage, updateCurrentPage]);

  return (
    <div className=" flex h-fit w-full flex-col items-center justify-between gap-[1.5rem]  pl-2 md:flex-row">
      {/* <div className="flex w-full justify-between md:flex">
        <div className="">
          <span>
            Page{" "}
            <strong>
              {+currentPage} of {pageCount}
            </strong>{" "}
          </span>
        </div>

      </div> */}
      <div className="flex w-fit items-center justify-between gap-[1.5rem] ">
        <div className="block md:block">
          <span>
            Page{" "}
            <strong>
              {+currentPage} of {pageCount}
            </strong>{" "}
          </span>
        </div>
        <div className="">
          <LimitSelect
            pageSize={pageSize}
            multiplier={multiplier}
            startSize={startSize}
            updatePageSize={updatePageSize}
            canChangeLimit={canChangeLimit}
          />
        </div>
      </div>

      <div className="flex h-[2.5rem] grow items-center justify-end gap-[.375rem]  ">
        <button
          type="button"
          onClick={previousPage}
          disabled={!canPreviousPage}
          className={`flex h-[2rem] w-[2rem] items-center justify-center rounded`}
        >
          {/* <DoubleChevronRightIcon className="rotate-180" /> */}
          <NarrowUpArrowIcon
            className="h-[.875rem] -rotate-90"
            fill="black"
            stroke="black"
          />
        </button>
        {/* <button
          type="button"
          disabled
          className={`flex h-[2rem] w-[2rem] items-center justify-center rounded`}
        >
          <ChevronRightIcon className="rotate-180" />
        </button> */}

        {showAboveFive ? (
          <button
            type="button"
            className={`h-[2rem] w-[2rem] rounded border shadow-md`}
            onClick={() => setShowAboveFive(false)}
          >
            ...
          </button>
        ) : null}

        <div className="w-fit flex gap-3 min-w-fit max-w-fit overflow-x-auto">
          {pageCount !== undefined &&
            Array.from({ length: Number(pageCount) }).map((_, index) => {
              const page = index + 1;

              if (
                (!showAboveFive && pageCount <= 5) ||
                (!showAboveFive && pageCount <= 7)
              ) {
                return (
                  <button
                    type="button"
                    disabled={page === currentPage}
                    className={`h-[2rem] w-[2rem] rounded border shadow-md ${
                      currentPage === page ? "bg-weak-100" : ""
                    }`}
                    key={page}
                    onClick={() => updateCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              }
              if (!showAboveFive && pageCount > 5 && page <= 5) {
                return (
                  <button
                    type="button"
                    disabled={page === currentPage}
                    className={`h-[2rem] w-[2rem] rounded border shadow-md ${
                      currentPage === page ? "bg-weak-100" : ""
                    }`}
                    key={page}
                    onClick={() => updateCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              }
              if (
                pageCount > 5 &&
                pageCount >= 8 &&
                page > 5 &&
                page < 7 &&
                !showAboveFive
              ) {
                return (
                  <LazyLoad>
                    <MkdPopover
                      display={
                        <button
                          type="button"
                          disabled={page === currentPage}
                          className={` h-[2rem] w-fit min-w-[2rem] max-w-fit rounded border px-2 shadow-md ${
                            currentPage === page ? "bg-weak-100" : ""
                          }`}
                          key={page}
                          // onClick={() => setShowAboveFive(true)}
                        >
                          ...
                        </button>
                      }
                      backgroundColor="#FFF0E5"
                      tooltipClasses={`items-center flex  flex-col gap-2 h-[31.25rem] min-h-[31.25rem] max-h-[31.25rem] w-fit min-w-fit max-w-fit overflow-auto`}
                    >
                      {pageCount !== undefined &&
                        Array.from({ length: Number(pageCount) }).map(
                          (_, index) => {
                            const page = index + 1;
                            if (page > 5) {
                              return (
                                <button
                                  type="button"
                                  disabled={page === currentPage}
                                  className={`!m-auto flex h-[2rem] w-auto min-w-[2rem] max-w-fit items-center justify-center rounded border p-2 leading-[1.5rem] shadow-md ${
                                    currentPage === page ? "bg-weak-100" : ""
                                  }`}
                                  key={page}
                                  onClick={() => updateCurrentPage(page)}
                                >
                                  {page}
                                </button>
                              );
                            }
                          }
                        )}
                    </MkdPopover>
                  </LazyLoad>
                );
              }
              if (
                !showAboveFive &&
                pageCount > 5 &&
                pageCount >= 8 &&
                page === 7
              ) {
                return (
                  <button
                    type="button"
                    disabled={pageCount === currentPage}
                    className={`h-[2rem] w-[2rem] rounded border shadow-md ${
                      currentPage === pageCount ? "bg-weak-100" : ""
                    }`}
                    key={page}
                    onClick={() => updateCurrentPage(pageCount)}
                  >
                    {pageCount}
                  </button>
                );
              }

              // if (
              //   showAboveFive &&
              //   pageCount > 5 &&
              //   pageCount >= 8 &&
              //   page > 5
              // ) {
              //   return (
              //     <button
              //       type="button"
              //       disabled={page === currentPage}
              //       className={`h-[2rem] w-[2rem] rounded border shadow-md ${
              //         currentPage === page ? "bg-weak-100" : ""
              //       }`}
              //       key={page}
              //       onClick={() => updateCurrentPage(page)}
              //     >
              //       {page}
              //     </button>
              //   );
              // }
              // return (
              //   <button
              //     className={`h-[2rem] w-[2rem] rounded border shadow-md ${
              //       currentPage === page ? "bg-weak-100" : ""
              //     }`}
              //     key={page}
              //   >
              //     {page}
              //   </button>
              // );
            })}
        </div>

        {/* <button
          type="button"
          disabled
          className={`flex h-[2rem] w-[2rem] items-center justify-center rounded`}
        >
          <ChevronRightIcon />
        </button> */}
        <button
          type="button"
          onClick={nextPage}
          disabled={!canNextPage}
          className={`flex h-[2rem] w-[2rem] items-center justify-center rounded`}
        >
          {/* <DoubleChevronRightIcon /> */}
          <NarrowUpArrowIcon
            className="h-[.875rem] rotate-90"
            fill="black"
            stroke="black"
          />
        </button>
      </div>
      {/*  */}

      {/* <div className="hidden md:hidden">
        <LimitSelect
          pageSize={pageSize}
          updatePageSize={updatePageSize}
          multiplier={multiplier}
          startSize={startSize}
          canChangeLimit={canChangeLimit}
        />
      </div> */}
    </div>
  );
};

export default PaginationBar;
// <div>
//   <button
//     type="button"
//     onClick={previousPage}
//     disabled={!canPreviousPage}
//     className={`h-10 w-10 font-bold`}
//   >
//     &#x02190;
//   </button>{" "}
//   <button
//     type="button"
//     onClick={nextPage}
//     disabled={!canNextPage}
//     className={`h-10 w-10 font-bold `}
//   >
//     &#x02192;
//   </button>{" "}
// </div>
