"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import type { AvailableReviewMeeting } from "@/features/mypage/api/getAvailableReviews";

import ReviewMeetingCard from "./ReviewMeetingCard";

const PAGE_SIZE = 10;

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
  const [meetings, setMeetings] = useState<AvailableReviewMeeting[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const observerTarget = useRef<HTMLDivElement | null>(null);

  const fetchMeetings = useCallback(async () => {
    const response = await fetch("/api/mypage/available-reviews", {
      method: "GET",
      cache: "no-store",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.message ?? "작성 가능한 리뷰를 불러오지 못했습니다.",
      );
    }

    setMeetings(Array.isArray(result?.data) ? result.data : []);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMeetings() {
      try {
        const response = await fetch("/api/mypage/available-reviews", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            result?.message ?? "작성 가능한 리뷰를 불러오지 못했습니다.",
          );
        }

        if (!cancelled) {
          setMeetings(Array.isArray(result?.data) ? result.data : []);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "작성 가능한 리뷰를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadMeetings();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleReviewSuccess = useCallback((meetingId: number) => {
    setMeetings((prev) =>
      prev.filter((meeting) => meeting.id !== meetingId),
    );
  }, []);

  const visibleMeetings = meetings.slice(0, visibleCount);
  const hasMore = visibleCount < meetings.length;

  useEffect(() => {
    const target = observerTarget.current;

    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, meetings.length),
          );
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, meetings.length, visibleCount]);

  if (isLoading) {
    return (
      <p className="py-8 text-center text-gray-500">
        불러오는 중...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p role="alert" className="py-8 text-center text-red-500">
        {errorMessage}
      </p>
    );
  }

  if (meetings.length === 0) {
    return <EmptyState message="작성 가능한 리뷰가 없습니다." />;
  }

  return (
    <div className="flex flex-col gap-5">
      {visibleMeetings.map((meeting) => (
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
          onReviewSuccess={handleReviewSuccess}
        />
      ))}

      {hasMore && (
        <>
          <div
            ref={observerTarget}
            className="h-2"
            aria-hidden="true"
          />

          <p className="py-2 text-center text-sm text-gray-500">
            스크롤하면 더 많은 모임을 볼 수 있어요.
          </p>
        </>
      )}
    </div>
  );
}