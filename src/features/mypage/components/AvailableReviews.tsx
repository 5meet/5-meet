"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import Button from "@/components/ui/Button/Button";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { useAvailableReviewsQuery } from "@/features/mypage/hooks/useAvailableReviewsQuery";

function formatDate(dateTime: string) {
  if (!dateTime) {
    return "";
  }

  return new Date(dateTime).toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  );
}

function formatDateTime(dateTime: string) {
  if (!dateTime) {
    return "";
  }

  return new Date(dateTime).toLocaleString(
    "ko-KR",
    {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  );
}

export default function AvailableReviews() {
  const loadMoreRef =
    useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAvailableReviewsQuery();

  const meetings =
    data?.pages.flatMap(
      (page) => page.data,
    ) ?? [];

  useEffect(() => {
    const target =
      loadMoreRef.current;

    if (!target || !hasNextPage) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (
            entry.isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
            fetchNextPage();
          }
        },
        {
          rootMargin: "200px",
        },
      );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-[315px] items-center justify-center">
        <p className="text-sm text-[#a1a4aa]">
          작성 가능한 리뷰를 불러오는 중...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[315px] items-center justify-center">
        <p className="text-sm text-red-500">
          {error instanceof Error
            ? error.message
            : "작성 가능한 리뷰를 불러오지 못했습니다."}
        </p>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <EmptyState message="작성 가능한 리뷰가 없습니다." />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {meetings.map((meeting) => (
        <article
          key={meeting.id}
          className="grid grid-cols-1 gap-5 rounded-[23px] bg-white pb-[30px] md:grid-cols-[180px_1fr] md:gap-[30px]"
        >
          <div className="relative h-[180px] w-full overflow-hidden rounded-[16px] bg-[#eeeae8] md:w-[180px]">
            {meeting.image && (
              <Image
                src={meeting.image}
                alt={meeting.name}
                fill
                sizes="180px"
                className="object-cover"
              />
            )}
          </div>

          <div className="flex min-w-0 flex-col md:h-[180px]">
            <div>
              <h3 className="text-[18px] font-semibold text-[#343840]">
                {meeting.name}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px] text-[#a1a4aa]">
                <span>{meeting.type}</span>

                {meeting.region && (
                  <>
                    <span>·</span>
                    <span>
                      {meeting.region}
                    </span>
                  </>
                )}

                <span>·</span>

                <time
                  dateTime={meeting.dateTime}
                >
                  {formatDate(
                    meeting.dateTime,
                  )}
                </time>
              </div>

              <p className="mt-2 text-[13px] text-[#a1a4aa]">
                {formatDateTime(
                  meeting.dateTime,
                )}
              </p>
            </div>

            <div className="mt-auto">
              <p className="break-keep text-[16px] leading-[1.5] tracking-[-0.2px] text-[#4c5360]">
                {meeting.description}
              </p>

              <Button
                type="button"
                variant="primary"
                size="md"
                fullWidth
                className="mt-4"
              >
                리뷰 작성하기
              </Button>

              <div className="mt-4 w-full border-b border-[#e2e2e2]" />
            </div>
          </div>
        </article>
      ))}

      <div
        ref={loadMoreRef}
        className="flex min-h-10 items-center justify-center"
      >
        {isFetchingNextPage && (
          <p className="text-sm text-[#a1a4aa]">
            더 불러오는 중...
          </p>
        )}
      </div>
    </div>
  );
}