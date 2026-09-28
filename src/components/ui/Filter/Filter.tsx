"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export type FilterCategory = {
  id: string;
  label: string;
};

export type FilterProps = {
  categories?: readonly FilterCategory[];
  selectedCategoryId?: string;
  onCategoryChange?: (id: string) => void;
  dateLabel?: string;
  onDateClick?: () => void;
  regionLabel?: string;
  onRegionClick?: () => void;
  sortId?: string;
  onSortChange?: (id: string) => void;
};

const DEFAULT_CATEGORIES: FilterCategory[] = [
  { id: "all", label: "전체" },
  { id: "hobby", label: "취미/여가" },
  { id: "self", label: "자기계발" },
  { id: "business", label: "비즈니스" },
  { id: "lifestyle", label: "라이프스타일" },
  { id: "family", label: "가족/육아" },
];

export function Filter({
  categories = DEFAULT_CATEGORIES,
  selectedCategoryId,
  onCategoryChange,
  dateLabel = "날짜 전체",
  onDateClick,
  regionLabel = "지역 전체",
  onRegionClick,
  sortId,
  onSortChange,
}: FilterProps) {
  const [uncontrolledId, setUncontrolledId] = useState(
    categories[0]?.id ?? "all",
  );
  const selectedId = selectedCategoryId ?? uncontrolledId;
  const closingSelected = sortId === "closing";

  const selectCategory = (id: string) => {
    if (onCategoryChange) {
      onCategoryChange(id);
      return;
    }
    setUncontrolledId(id);
  };

  const toggleClosing = () => {
    if (!onSortChange) return;
    onSortChange(closingSelected ? "date" : "closing");
  };

  return (
    <div
      className="
        mb-7
        flex min-w-0 flex-col gap-4

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
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
        role="tablist"
        aria-label="모임 카테고리"
      >
        {categories.map((category) => {
          const selected = category.id === selectedId;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectCategory(category.id)}
              className={`
              shrink-0
              rounded-full
              px-4 py-2
              text-xs
              whitespace-nowrap
              transition-colors

              ${
                selected
                  ? "bg-[#4b4d50] font-semibold text-white"
                  : "bg-[#eceff1] text-[#555a61] hover:bg-[#e1e4e6]"
              }
            `}
            >
              {category.label}
            </button>
          );
        })}
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
        <button
          type="button"
          onClick={onDateClick}
          className="flex min-w-0 max-w-[160px] shrink-0 items-center gap-1"
        >
          <span className="truncate">{dateLabel}</span>
          <ChevronDown size={13} />
        </button>

        <button
          type="button"
          onClick={onRegionClick}
          className="flex min-w-0 max-w-[140px] shrink-0 items-center gap-1"
        >
          <span className="truncate">{regionLabel}</span>
          <ChevronDown size={13} />
        </button>

        <button
          type="button"
          onClick={toggleClosing}
          aria-pressed={closingSelected}
          className={`flex shrink-0 items-center gap-1 ${
            closingSelected ? "font-semibold text-primary-500" : ""
          }`}
        >
          <SlidersHorizontal size={13} />
          마감 임박
        </button>
      </div>
    </div>
  );
}
