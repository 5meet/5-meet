"use client";

import type { ReactNode } from "react";
import { Flame } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { SearchBar } from "./SearchBar";
import { CategoryChips } from "./CategoryChips";
import { SortFilterBar } from "./SortFilterBar";
import { SectionHeader } from "./SectionHeader";
import { FilterModal } from "./FilterModal";

/**
 * 모임 찾기 화면 셸 — Hero, Search, Chip, Sort/Filter, Section Header.
 * 목록 API·pagination은 넣지 않는다.
 */
type MeetingsFindShellProps = {
  keyword: string;
  onKeywordChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (id: string) => void;
  sortId: string;
  onSortChange: (id: string) => void;
  filterOpen: boolean;
  onFilterOpen: () => void;
  onFilterClose: () => void;
  region: string;
  onRegionChange: (value: string) => void;
  dateStart: string;
  dateEnd: string;
  onDateStartChange: (value: string) => void;
  onDateEndChange: (value: string) => void;
  popularSlot: ReactNode;
  recommendedSlot: ReactNode;
  listSlot?: ReactNode;
};

export function MeetingsFindShell({
  keyword,
  onKeywordChange,
  categoryId,
  onCategoryChange,
  sortId,
  onSortChange,
  filterOpen,
  onFilterOpen,
  onFilterClose,
  region,
  onRegionChange,
  dateStart,
  dateEnd,
  onDateStartChange,
  onDateEndChange,
  popularSlot,
  recommendedSlot,
  listSlot,
}: MeetingsFindShellProps) {
  return (
    <div className="min-h-full bg-[#F3FAF7]">
      <div className="mx-auto max-w-[1120px] space-y-8 px-4 pb-28 pt-6 md:px-6">
        <HeroBanner
          searchSlot={
            <SearchBar value={keyword} onChange={onKeywordChange} />
          }
        />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CategoryChips selectedId={categoryId} onSelect={onCategoryChange} />
          <SortFilterBar
            sortId={sortId}
            onSortChange={onSortChange}
            onOpenFilter={onFilterOpen}
          />
        </div>

        <section>
          <SectionHeader
            title="지금 인기 있는 모임"
            moreHref="/meetings?sortBy=participantCount&sortOrder=desc"
            icon={<Flame className="h-5 w-5 text-orange-500" />}
          />
          {popularSlot}
        </section>

        <section>
          <SectionHeader
            title="추천 모임"
            description="당신의 관심사를 반영한 맞춤 모임이에요"
          />
          {recommendedSlot}
        </section>

        {listSlot}

        <FilterModal
          open={filterOpen}
          onClose={onFilterClose}
          region={region}
          onRegionChange={onRegionChange}
          dateStart={dateStart}
          dateEnd={dateEnd}
          onDateStartChange={onDateStartChange}
          onDateEndChange={onDateEndChange}
        />
      </div>
    </div>
  );
}
