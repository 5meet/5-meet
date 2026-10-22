"use client";

import { Suspense } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import MeetingDetailContent from "@/features/meetingDetail/views";
import {
  MeetingDetailSkeleton,
  ErrorView,
} from "@/features/meetingDetail/ui/Suspense";
import type { MeetingDetailPageClientProps } from "@/features/meetingDetail/views";

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  if ("response" in error && error.response instanceof Response) {
    return error.response.status;
  }

  return undefined;
};

const MeetingDetailPageClient = (props: MeetingDetailPageClientProps) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <Suspense fallback={<MeetingDetailSkeleton />}>
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => {
            const isNotFound = getErrorStatus(error) === 404;

            return (
              <ErrorView
                onRetry={resetErrorBoundary}
                title={
                  isNotFound
                    ? "모임을 찾을 수 없습니다."
                    : "정보를 불러오지 못했습니다."
                }
                description={
                  isNotFound
                    ? "삭제되었거나 존재하지 않는 모임입니다."
                    : "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
                }
              />
            );
          }}
        >
          <MeetingDetailContent {...props} />
        </ErrorBoundary>
      </Suspense>
    )}
  </QueryErrorResetBoundary>
);

export default MeetingDetailPageClient;
