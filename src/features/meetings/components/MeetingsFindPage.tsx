"use client";

import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { getApiError } from "@/lib/api/handleApiError";
import { getMeetings } from "../api/meetings";
import type { Meeting } from "../api/types";
import { CATEGORY_CHIPS } from "../constants/filters";
import { EmptyState } from "./EmptyState";
import { MeetingList } from "./MeetingList";
import { MeetingsFindShell } from "./MeetingsFindShell";

function categoryType(categoryId: string): string | undefined {
  if (categoryId === "all") return undefined;
  return CATEGORY_CHIPS.find((chip) => chip.id === categoryId)?.label;
}

function sortQuery(sortId: string): {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} {
  if (sortId === "date") {
    return { sortBy: "dateTime", sortOrder: "asc" };
  }
  return {};
}

export function MeetingsFindPage() {
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sortId, setSortId] = useState("date");
  const [filterOpen, setFilterOpen] = useState(false);
  const [region, setRegion] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const sort = sortQuery(sortId);
    let cancelled = false;

    setLoading(true);
    setErrorMessage(null);

    getMeetings({
      type: categoryType(categoryId),
      region: region || undefined,
      keyword: keyword.trim() || undefined,
      dateStart: dateStart || undefined,
      dateEnd: dateEnd || undefined,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      size: 10,
    })
      .then((page) => {
        if (!cancelled) setMeetings(page.data);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setMeetings([]);
          setErrorMessage(getApiError(error).message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [keyword, categoryId, sortId, region, dateStart, dateEnd]);

  const popular = useMemo(
    () =>
      [...meetings]
        .sort((a, b) => b.participantCount - a.participantCount)
        .slice(0, 4),
    [meetings],
  );

  const empty = (
    <EmptyState
      title="아직 표시할 모임이 없습니다"
      description="검색·필터를 바꾸거나 새 모임을 만들어 보세요."
    />
  );

  const statusSlot = loading ? (
    <div className="flex min-h-[220px] items-center justify-center rounded-3xl bg-white ring-1 ring-gray-100">
      <Spinner size="lg" className="text-primary-500" />
    </div>
  ) : errorMessage ? (
    <EmptyState title="모임을 불러오지 못했습니다" description={errorMessage} />
  ) : null;

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
      popularSlot={
        statusSlot ??
        (popular.length > 0 ? <MeetingList meetings={popular} /> : empty)
      }
      recommendedSlot={
        statusSlot ??
        (meetings.length > 0 ? <MeetingList meetings={meetings} /> : empty)
      }
    />
  );
}
