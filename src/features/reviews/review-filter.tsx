"use client";

import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

const categories = [
  "전체",
  "취미/여가",
  "자기계발",
  "비즈니스",
  "라이프스타일",
  "가족/육아",
];

export function ReviewFilter() {
  return (
    <div
      className="
        mb-7
        flex flex-col gap-4

        md:flex-row
        md:items-center
        md:justify-between
        md:gap-6
      "
    >

      <div
        className="
          flex
          min-w-0
          items-center
          gap-2
          overflow-x-auto
          scrollbar-none
        "
      >
        {categories.map((category, index) => (
          <button
            key={category}
            className={`
              shrink-0
              rounded-full
              px-4 py-2
              text-xs
              whitespace-nowrap
              transition-colors

              ${
                index === 0
                  ? "bg-[#4b4d50] font-semibold text-white"
                  : "bg-[#eceff1] text-[#555a61] hover:bg-[#e1e4e6]"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      <div
        className="
          flex
          shrink-0
          items-center
          gap-5
          text-xs
          text-[#777b82]

          md:gap-4
        "
      >
        <button className="flex shrink-0 items-center gap-1">
          날짜 전체
          <ChevronDown size={13} />
        </button>

        <button className="flex shrink-0 items-center gap-1">
          지역 전체
          <ChevronDown size={13} />
        </button>

        <button className="flex shrink-0 items-center gap-1">
          <SlidersHorizontal size={13} />
          마감 임박
        </button>
      </div>
    </div>
  );
}