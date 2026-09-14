"use client";

import { getPageNumbers } from "./generateNumbers";
import PageArrowButton from "./PageArrowButton";
import PageNumButton from "./PageNumButton";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  /**
   * 페이지 변경 시 화면을 top으로 스크롤할지 여부
   * @default true
   */
  scrollToTop?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  scrollToTop = true,
}: Props) => {
  const pages = getPageNumbers(currentPage, totalPages, maxVisiblePages);

  const move = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        move(currentPage - 1);
        break;

      case "ArrowRight":
        e.preventDefault();
        move(currentPage + 1);
        break;

      case "Home":
        e.preventDefault();
        move(1);
        break;

      case "End":
        e.preventDefault();
        move(totalPages);
        break;

      default:
        break;
    }
  };

  return (
    <nav aria-label="페이지 네비게이션">
      <div
        className="flex items-center justify-center gap-2"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <PageArrowButton
          type="prev"
          disabled={currentPage === 1}
          onClick={() => move(currentPage - 1)}
        />

        {pages.map((page) => (
          <PageNumButton
            key={page}
            page={page}
            currentPage={currentPage}
            onClick={move}
          />
        ))}

        <PageArrowButton
          type="next"
          disabled={currentPage === totalPages}
          onClick={() => move(currentPage + 1)}
        />
      </div>
    </nav>
  );
};

export default Pagination;
