"use client";

import { useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { useAvailableReviewsQuery } from "@/features/mypage/hooks/useAvailableReviewsQuery";

import ReviewMeetingCard from "./ReviewMeetingCard";

const PAGE_SIZE = 10;

function formatDate(dateTime: string) {
  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatTime(dateTime: string) {
  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AvailableReviews() {
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useAvailableReviewsQuery({ size: PAGE_SIZE });

  const meetings = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  useEffect(() => {
    const root = scrollContainerRef.current;
    const target = observerTarget.current;

    if (
      !root ||
      !target ||
      !hasNextPage ||
      isFetchingNextPage ||
      isError
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      {
        root,
        rootMargin: "100px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isError, fetchNextPage]);

  const handleReviewSuccess = async (meetingId: number) => {
    queryClient.setQueryData(
      ["mypage", "reviews", "available", PAGE_SIZE],
      (previousData: typeof data | undefined) => {
        if (!previousData) return previousData;

        return {
          ...previousData,
          pages: previousData.pages.map((page) => ({
            ...page,
            data: page.data.filter((meeting) => meeting.id !== meetingId),
          })),
        };
      },
    );

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["mypage", "reviews", "available"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["mypage", "reviews", "written"],
      }),
    ]);
  };

  if (isPending) {
    return (
      <p className="py-8 text-center text-gray-500">
        작성 가능한 리뷰를 불러오는 중입니다...
      </p>
    );
  }

  if (isError && meetings.length === 0) {
    return (
      <div>
        <p role="alert" className="py-8 text-center text-red-500">
          {error instanceof Error
            ? error.message
            : "작성 가능한 리뷰를 불러오지 못했습니다."}
        </p>
        <div className="text-center">
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-md border px-4 py-2 text-sm"
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
    <div
      ref={scrollContainerRef}
      className="h-[70vh] min-h-[400px] overflow-y-auto overscroll-contain pr-3"
    >
      <div className="flex flex-col gap-5">
        {meetings.map((meeting) => (
          <ReviewMeetingCard
            key={meeting.id}
            teamId={meeting.teamId}
            meetingId={meeting.id}
            imageUrl={meeting.image}
            title={meeting.name}
            location={meeting.address}
            date={formatDate(meeting.dateTime)}
            time={formatTime(meeting.dateTime)}
            participantCount={meeting.participantCount}
            capacity={meeting.capacity}
            isFavorite={meeting.isFavorited}
            onReviewSuccess={handleReviewSuccess}
          />
        ))}

        {hasNextPage && (
          <div
            ref={observerTarget}
            className="py-3 text-center text-sm text-gray-500"
            aria-live="polite"
          >
            {isFetchingNextPage
              ? "다음 목록을 불러오는 중입니다..."
              : isError
                ? "다음 목록을 불러오지 못했습니다."
                : "스크롤하면 다음 목록을 불러옵니다."}
          </div>
        )}

        {isError && meetings.length > 0 && (
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="self-center rounded-md border px-4 py-2 text-sm disabled:opacity-50"
          >
            다음 목록 다시 시도
          </button>
        )}
      </div>
    </div>
  );
}