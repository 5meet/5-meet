"use client";

import { Suspense, useState } from "react";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { EmptyState } from "./EmptyState";
import { LoadMoreButton } from "./LoadMoreButton";
import { MeetingList } from "./MeetingList";
import { MeetingListStatus } from "./MeetingListStatus";
import { MeetingsFindShell } from "./MeetingsFindShell";
import { useFindFilters } from "../lib/useFindFilters";
import { useMeetingsList } from "../lib/useMeetingsList";

function MeetingsFindPageInner() {
  const { filters, queryFilters, patchFilters } = useFindFilters();
  const [filterOpen, setFilterOpen] = useState(false);
  const {
    meetings,
    popular,
    hasMore,
    loading,
    loadingMore,
    errorMessage,
    loadMore,
  } = useMeetingsList(queryFilters);

  const empty = (
    <EmptyState
      title="아직 표시할 모임이 없습니다"
      description="검색·필터를 바꾸거나 새 모임을 만들어 보세요."
    />
  );

  const statusSlot =
    loading || errorMessage ? (
      <MeetingListStatus loading={loading} errorMessage={errorMessage} />
    ) : null;

  return (
    <MeetingsFindShell
      keyword={filters.keyword}
      onKeywordChange={(keyword) => patchFilters({ keyword })}
      categoryId={filters.categoryId}
      onCategoryChange={(categoryId) => patchFilters({ categoryId })}
      sortId={filters.sortId}
      onSortChange={(sortId) => patchFilters({ sortId })}
      filterOpen={filterOpen}
      onFilterOpen={() => setFilterOpen(true)}
      onFilterClose={() => setFilterOpen(false)}
      region={filters.region}
      onRegionChange={(region) => patchFilters({ region })}
      dateStart={filters.dateStart}
      dateEnd={filters.dateEnd}
      onDateStartChange={(dateStart) => patchFilters({ dateStart })}
      onDateEndChange={(dateEnd) => patchFilters({ dateEnd })}
      popularSlot={
        statusSlot ??
        (popular.length > 0 ? <MeetingList meetings={popular} /> : empty)
      }
      recommendedSlot={
        statusSlot ??
        (meetings.length > 0 ? <MeetingList meetings={meetings} /> : empty)
      }
      listSlot={
        !loading && !errorMessage ? (
          <LoadMoreButton
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
          />
        ) : null
      }
    />
  );
}

export function MeetingsFindPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" className="text-primary-500" />
        </div>
      }
    >
      <MeetingsFindPageInner />
    </Suspense>
  );
}
