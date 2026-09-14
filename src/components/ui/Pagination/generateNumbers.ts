export const getPageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number,
): number[] => {
  const half = Math.floor(maxVisiblePages / 2);

  let start = currentPage - half;
  let end = currentPage + half;

  // 왼쪽 경계 보정
  if (start < 1) {
    start = 1;
    end = Math.min(totalPages, start + maxVisiblePages - 1);
  }

  // 오른쪽 경계 보정
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};
