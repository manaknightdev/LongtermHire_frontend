import { useCallback, useEffect, useRef, memo, useState } from "react";

interface MkdInfiniteScrollProps {
  data: any[];
  children: React.ReactNode;
  height: string;
  next: (initialized: boolean, nextCursor?: any) => void;
  pageSize: number;
  nextCursor: number;
  className: string;
  setPageSize: (size: number) => void;
  setNextCursor: (cursor?: any) => void;
  setData: (data?: any) => void;
}

const MkdInfiniteScroll = ({
  data,
  children,
  height,
  next,
  pageSize,
  nextCursor,
  className,
  setPageSize,
  setNextCursor,
  setData,
}: MkdInfiniteScrollProps) => {
  const [initialized, setInitialized] = useState(false);

  const scrollRef = useInfiniteScroll(() => {
    // logic for loading more data here
    if (nextCursor === 0) {
      return;
    } else {
      next(true, nextCursor);
    }
  });

  const onUpdatePageSize = useCallback(
    (size: number) => {
      setPageSize(size);
      setData(() => []);
      setNextCursor(() => null);
      setInitialized(true);
      next(initialized, null);
    },
    [initialized, pageSize, data, nextCursor]
  );

  useEffect(() => {
    if (!initialized) {
      next(initialized, null);
      setInitialized(true);
    }
  }, [initialized]);

  return (
    <div>
      <div
        ref={scrollRef}
        style={{ overflow: "auto", maxHeight: height }}
        className={`border-2 border-primaryBlue ${className}`}
      >
        {children}
      </div>
      <div className="mt-2">
        <select
          className="mt-2"
          value={pageSize}
          onChange={(e) => {
            onUpdatePageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default memo(MkdInfiniteScroll);

function useInfiniteScroll(callback: () => void) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollElement = scrollRef.current;
      if (
        scrollElement &&
        scrollElement.scrollTop + scrollElement.clientHeight >=
          scrollElement.scrollHeight
      ) {
        callback();
      }
    };

    const scrollElement = scrollRef.current;
    const abortController = new AbortController();
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll, {
        signal: abortController.signal,
      });
    }

    return () => {
      abortController.abort();
    };
  }, [callback]);

  return scrollRef;
}
