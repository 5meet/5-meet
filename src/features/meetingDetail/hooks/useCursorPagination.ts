import { useCallback, useState } from "react";

export const useCursorPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // cursors[n] = n페이지를 요청할 때 쓸 커서 (1페이지는 커서 없음)
  const [cursors, setCursors] = useState<Record<number, string>>({});
  // 현재까지 알려진 전체 페이지 수
  const [totalPages, setTotalPages] = useState(1);

  /** 페이지 응답을 받았을 때 호출: 다음 페이지 커서와 totalPages 갱신 */
  const registerPage = useCallback(
    (page: number, nextCursor: string | null | undefined, hasMore: boolean) => {
      if (hasMore && nextCursor) {
        setCursors((prev) =>
          prev[page + 1] === nextCursor
            ? prev
            : { ...prev, [page + 1]: nextCursor },
        );
        setTotalPages((prev) => Math.max(prev, page + 1));
      } else {
        // 마지막 페이지
        setTotalPages(page);
      }
    },
    [],
  );

  /** 필터/정렬 등 조회 조건이 바뀌면 호출 */
  const reset = useCallback(() => {
    setCurrentPage(1);
    setCursors({});
    setTotalPages(1);
  }, []);

  return {
    currentPage,
    totalPages,
    cursor: cursors[currentPage], // 1페이지는 undefined
    setCurrentPage,
    registerPage,
    reset,
  };
};
