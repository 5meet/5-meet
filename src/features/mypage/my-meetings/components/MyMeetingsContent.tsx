"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { meetingKeys } from "@/features/meetingDetail/queryKeys";
import Button from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { useModal } from "@/contexts/ModalContext";

import MyMeetingsView, { type MyMeetingSummary } from "./MyMeetingsView";
import {
  joinedMeetingsQueryKeys,
  useJoinedMeetingsQuery,
} from "../hooks/useJoinedMeetingsQuery";
import type { JoinedMeeting, JoinedMeetingsResponse } from "../types";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "long",
  day: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function toSummary(meeting: JoinedMeeting, userId?: number): MyMeetingSummary {
  const date = meeting.dateTime ? new Date(meeting.dateTime) : null;
  const isValid = date && !Number.isNaN(date.getTime());
  return {
    id: meeting.id,
    name: meeting.name,
    region: meeting.region,
    category: meeting.type,
    imageUrl: meeting.image,
    dateLabel: isValid ? dateFormatter.format(date) : "일정 미정",
    timeLabel: isValid ? timeFormatter.format(date) : "",
    participantCount: meeting.participantCount,
    capacity: meeting.capacity,
    isCompleted: meeting.isCompleted,
    isConfirmed: Boolean(meeting.confirmedAt),
    isCanceled: Boolean(meeting.canceledAt),
    isFavorited: Boolean(meeting.isFavorited),
    canReview:
      meeting.isCompleted && !meeting.isReviewed && !meeting.canceledAt,
    canCancel:
      userId !== undefined &&
      meeting.hostId !== userId &&
      !meeting.canceledAt &&
      !meeting.isCompleted &&
      Boolean(date && date.getTime() > Date.now()),
  };
}

function CancelMeetingDialog({ meeting, onClose, onConfirm }: {
  meeting: MyMeetingSummary;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = rootRef.current;
    const buttons = root?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
    // Start on the safe action rather than the destructive action.
    buttons?.[1]?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !buttons?.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    root?.addEventListener("keydown", trapFocus);
    return () => {
      root?.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, []);
  return (
    <div ref={rootRef}>
      <Modal isOpen onClose={onClose}>
        <Modal.Header onClose={onClose}>
          <Modal.Title>예약 취소</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="break-words text-gray-800">‘{meeting.name}’ 예약을 취소하시겠습니까?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>돌아가기</Button>
          <Button onClick={onConfirm}>예약 취소하기</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default function MyMeetingsContent() {
  const query = useJoinedMeetingsQuery();
  const queryClient = useQueryClient();
  const [cancelPendingId, setCancelPendingId] = useState<number | null>(null);
  const { openAlert } = useModal();
  const [cancelSelection, setCancelSelection] = useState<MyMeetingSummary | null>(null);
  const currentUser = useCurrentUser();
  const refetchCurrentUser = currentUser.refetch;
  useEffect(() => {
    void refetchCurrentUser();
  }, [refetchCurrentUser]);
  const cancelLock = useRef(false);
  const favoriteLock = useRef(false);
  const [favoritePendingId, setFavoritePendingId] = useState<number | null>(
    null,
  );

  async function toggleFavorite(meeting: MyMeetingSummary) {
    if (favoriteLock.current || cancelLock.current) return;
    favoriteLock.current = true;
    setFavoritePendingId(meeting.id);
    try {
      const response = await fetch(
        `/api/mypage/joined-meetings/${meeting.id}/favorite`,
        {
          method: meeting.isFavorited ? "DELETE" : "POST",
        },
      );
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? "찜 상태를 변경하지 못했습니다.");
      }
      await queryClient.cancelQueries({
        queryKey: joinedMeetingsQueryKeys.list(),
      });
      queryClient.setQueryData<InfiniteData<JoinedMeetingsResponse>>(
        joinedMeetingsQueryKeys.list(),
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((item) =>
                item.id === meeting.id
                  ? { ...item, isFavorited: !meeting.isFavorited }
                  : item,
              ),
            })),
          },
      );
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } catch (error) {
      openAlert({ message: error instanceof Error ? error.message : "찜 상태를 변경하지 못했습니다." });
      // Conflicts may mean another screen changed the server state.
      void query.refetch();
    } finally {
      favoriteLock.current = false;
      setFavoritePendingId(null);
    }
  }

  async function cancelMeeting(meeting: MyMeetingSummary) {
    if (!meeting.canCancel || cancelLock.current || favoriteLock.current)
      return;
    setCancelSelection(null);

    cancelLock.current = true;
    setCancelPendingId(meeting.id);
    try {
      const response = await fetch(
        `/api/mypage/joined-meetings/${meeting.id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(error.message ?? "예약을 취소하지 못했습니다.");
      }
      queryClient.setQueryData<InfiniteData<JoinedMeetingsResponse>>(
        joinedMeetingsQueryKeys.list(),
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((item) => item.id !== meeting.id),
            })),
          },
      );
      // Revisit detail/participants with fresh membership and participant counts.
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      const refreshed = await query.refetch();
      if (refreshed.isError) {
        openAlert({ message: "예약은 취소되었지만 목록 갱신에 실패했습니다. 목록 다시 불러오기를 눌러주세요." });
      }
    } catch (error) {
      openAlert({ message: error instanceof Error ? error.message : "예약 취소에 실패했습니다." });
    } finally {
      cancelLock.current = false;
      setCancelPendingId(null);
    }
  }

  if (query.isPending) return <MyMeetingsView status="loading" />;
  if (query.isError && !query.data) {
    return (
      <MyMeetingsView status="error" onRetry={() => void query.refetch()} />
    );
  }

  const meetings = query.data.pages
    .flatMap((page) => page.data)
    .map((meeting) =>
      toSummary(
        meeting,
        !currentUser.isFetching && !currentUser.isError
          ? currentUser.data?.id
          : undefined,
      ),
    );
  return (
    <>
      {cancelSelection && (
        <CancelMeetingDialog meeting={cancelSelection}
          onClose={() => setCancelSelection(null)}
          onConfirm={() => void cancelMeeting(cancelSelection)} />
      )}
      <MyMeetingsView
        status="success"
        meetings={meetings}
        onCancel={(meeting) => {
          if (meeting.canCancel && !cancelLock.current && !favoriteLock.current) {
            setCancelSelection(meeting);
          }
        }}
        cancelPendingId={cancelPendingId}
        onFavorite={(meeting) => void toggleFavorite(meeting)}
        favoritePendingId={favoritePendingId}
      />
      {query.isRefetchError && !query.isFetchNextPageError && (
        <Button
          type="button"
          variant="secondary"
          className="mt-4 h-auto w-auto rounded-xl border border-gray-300 px-4 py-2 text-sm font-normal"
          onClick={() => void query.refetch()}
        >
          목록 다시 불러오기
        </Button>
      )}
      {query.isFetchNextPageError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          추가 목록을 불러오지 못했습니다. 더 보기를 눌러 다시 시도해 주세요.
        </p>
      )}
      {query.hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            variant="secondary"
            onClick={() => void query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="h-auto w-auto rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 disabled:opacity-50"
          >
            {query.isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </Button>
        </div>
      )}
    </>
  );
}
