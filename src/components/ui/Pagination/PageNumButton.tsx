"use client";

interface Props {
  page: number;
  currentPage: number;
  onClick: (page: number) => void;
}

const PageNumButton = ({ page, currentPage, onClick }: Props) => {
  const isActive = currentPage === page;

  return (
    <button
      type="button"
      onClick={() => onClick(page)}
      aria-current={isActive ? "page" : undefined}
      aria-label={`페이지 ${page}로 이동`}
      className={`min-h-[40px] min-w-[40px] rounded px-3 py-2 text-[14px] transition-all md:min-h-[45px] md:min-w-[45px] lg:min-h-[50px] lg:min-w-[50px] lg:text-base ${
        isActive
          ? "bg-primary-200 font-semibold text-primary-600 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-500 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
      } `}
    >
      {page}
    </button>
  );
};

export default PageNumButton;
