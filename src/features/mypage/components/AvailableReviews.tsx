"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import type { AvailableReviewMeeting } from "@/features/mypage/api/getAvailableReviews";

import ReviewMeetingCard from "./ReviewMeetingCard";

function formatDate(dateTime: string) {
  if (!dateTime) return "";

  return new Date(dateTime).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatTime(dateTime: string) {
  if (!dateTime) return "";

  return new Date(dateTime).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AvailableReviews() {
  const [meetings, setMeetings] = useState<AvailableReviewMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchMeetings() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/mypage/available-reviews", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);

          throw new Error(
            body?.message ?? "작성 가능한 리뷰를 불러오지 못했습니다.",
          );
        }

        const result = await response.json();

        if (!cancelled) {
          setMeetings(result.data ?? []);
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

    void fetchMeetings();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <p className="py-8 text-center text-gray-500">불러오는 중...</p>;
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
        />
      ))}
    </div>
  );
}