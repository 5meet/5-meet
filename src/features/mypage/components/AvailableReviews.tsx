
"use client";

import { useEffect, useRef } from "react";

import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { useAvailableReviewsQuery } from "@/features/mypage/hooks/useAvailableReviewsQuery";
import ReviewMeetingCard from "@/features/mypage/components/ReviewMeetingCard";

function formatDate(dateTime: string) {
  if (!dateTime) return "";

  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatTime(dateTime: string) {
  if (!dateTime) return "";

  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AvailableReviews() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAvailableReviewsQuery();

  const meetings = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage || isError || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isError, isFetchingNextPage]);

  if (isLoading && meetings.length === 0) {
    return (
      <div className="flex min-h-[315px] items-center justify-center">
        <p className="text-sm text-[#a1a4aa]">
          작성 가능한 리뷰를 불러오는 중...
        </p>
      </div>
    );
  }

  if (isError && meetings.length === 0) {
    return (
      <div className="flex min-h-[315px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : "작성 가능한 리뷰를 불러오지 못했습니다."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (meetings.length === 0) {
    return <EmptyState message="작성 가능한 리뷰가 없습니다." />;
  }

  return (
    <div className="flex flex-col gap-5">
      {meetings.map((meeting) => (
        <ReviewMeetingCard
          key={meeting.id}
          imageUrl={meeting.image || "/images/meeting-placeholder.png"}
          title={meeting.name}
          location={meeting.region ?? ""}
          date={formatDate(meeting.dateTime)}
          time={formatTime(meeting.dateTime)}
          participantCount={meeting.participantCount}
          capacity={meeting.capacity}
        />
      ))}

      {isError && meetings.length > 0 && (
        <div className="flex flex-col items-center gap-3 py-3">
          <p className="text-sm text-red-500">
            추가 목록을 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            다시 시도
          </button>
        </div>
      )}

      {isFetchingNextPage && (
        <p className="text-center text-sm text-[#a1a4aa]">
          더 불러오는 중...
        </p>
      )}

      <div
        ref={loadMoreRef}
        className="flex min-h-10 items-center justify-center"
      />
    </div>
  );
}
