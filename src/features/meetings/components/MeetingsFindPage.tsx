"use client";

import { useState } from "react";
import { EmptyState } from "./EmptyState";
import { MeetingsFindShell } from "./MeetingsFindShell";

/** 모임 찾기 UI만. 목록 API·pagination은 다음 커밋. */
export function MeetingsFindPage() {
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sortId, setSortId] = useState("date");
  const [filterOpen, setFilterOpen] = useState(false);
  const [region, setRegion] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const empty = (
    <EmptyState
      title="아직 표시할 모임이 없습니다"
      description="검색·필터를 바꾸거나 새 모임을 만들어 보세요."
    />
  );

  return (
    <MeetingsFindShell
      keyword={keyword}
      onKeywordChange={setKeyword}
      categoryId={categoryId}
      onCategoryChange={setCategoryId}
      sortId={sortId}
      onSortChange={setSortId}
      filterOpen={filterOpen}
      onFilterOpen={() => setFilterOpen(true)}
      onFilterClose={() => setFilterOpen(false)}
      region={region}
      onRegionChange={setRegion}
      dateStart={dateStart}
      dateEnd={dateEnd}
      onDateStartChange={setDateStart}
      onDateEndChange={setDateEnd}
      popularSlot={empty}
      recommendedSlot={empty}
    />
  );
}
