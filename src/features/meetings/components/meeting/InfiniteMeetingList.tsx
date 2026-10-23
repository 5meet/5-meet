"use client";

import { MeetingCard } from "./MeetingCard";
import { EmptyState } from "../EmptyState";
import { MeetingCardListSkeleton } from "./MeetingCardListSkeleton";

import { useMeetingsInfiniteQuery } from "../../hooks/useMeetingsInfiniteQuery";
import { useInfiniteScrollTrigger } from "@/lib/hooks/useInfiniteScrollTrigger";

import type { MeetingFilters } from "@/lib/types/meeting";

interface InfiniteMeetingListProps {
  keyword?: string;
  filters?: MeetingFilters;
  className?: string;
}

export function InfiniteMeetingList({
  keyword,
  filters,
  className = "px-8 md:px-6",
}: InfiniteMeetingListProps) {
  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    refetch,
  } = useMeetingsInfiniteQuery(keyword, filters);

  // 다음 페이지 요청을 위한 스크롤 감지
  const continuationRef = useInfiniteScrollTrigger({
    enabled: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    fetchNextPage,
  });

  // 여러 페이지의 모임 데이터를 하나의 배열로 합침
  const meetings = data?.pages.flatMap((page) => page.data) ?? [];

  // 첫 페이지 로딩
  if (isPending) {
    return <MeetingCardListSkeleton />;
  }

  // 첫 페이지 조회 실패
  if (isError && !data) {
    return (
      <div className={className}>
        <p>모임을 불러오지 못했습니다.</p>
        <button type="button" onClick={() => void refetch()}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`mb-5 ${className}`}>
        <p className="text-sm text-gray-500">
          현재{" "}
          <span className="font-semibold text-gray-900">
            {meetings.length}개
          </span>
          의 모임을 불러왔습니다.
        </p>
      </div>
      {/* 모임 목록 */}
      {meetings.length === 0 ? (
        <div className={className}>
          <EmptyState
            title="모임이 없습니다"
            description="새로운 모임을 만들어보세요!"
          />
        </div>
      ) : (
        <div
          className={`mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
        >
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}

      {/* 다음 페이지 로딩 */}
      {isFetchingNextPage && (
        <div className="mt-8">
          <MeetingCardListSkeleton />
        </div>
      )}

      {/* 다음 페이지 조회 실패 */}
      {isFetchNextPageError && (
        <div className="my-8 text-center">
          <p className="mb-3 text-sm text-red-500">
            {error?.message ?? "추가 모임을 불러오지 못했습니다."}
          </p>

          <button
            type="button"
            onClick={() =>
              void fetchNextPage({
                cancelRefetch: false,
              })
            }
            className="rounded-md bg-gray-900 px-4 py-2 text-white"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* IntersectionObserver 감지 대상 */}
      <div ref={continuationRef} className="h-4" />
    </>
  );
}
