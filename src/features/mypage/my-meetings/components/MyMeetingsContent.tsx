"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import Button from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { useModal } from "@/contexts/ModalContext";
import { convertDateType1 } from "@/lib/convertDate/formatMeetingDate";

import MyMeetingsView, { type MyMeetingSummary } from "./MyMeetingsView";
import {
  useJoinedMeetingsQuery,
} from "../hooks/useJoinedMeetingsQuery";
import type { JoinedMeeting } from "../types";
import { useInfiniteScrollTrigger } from "../../hooks/useInfiniteScrollTrigger";
import MeetingListContinuation from "./MeetingListContinuation";
import { useMyMeetingActionLock } from "../hooks/useMyMeetingActionLock";
import { useCancelJoinedMeeting } from "../hooks/useCancelJoinedMeeting";
import { useToggleJoinedMeetingFavorite } from "../hooks/useToggleJoinedMeetingFavorite";

function toSummary(meeting: JoinedMeeting, userId?: number): MyMeetingSummary {
  const date = meeting.dateTime ? new Date(meeting.dateTime) : null;
  const isValid = date && !Number.isNaN(date.getTime());
  const formattedDate = isValid && meeting.dateTime
    ? convertDateType1(meeting.dateTime)
    : { date: "일정 미정", time: "" };
  return {
    id: meeting.id,
    name: meeting.name,
    region: meeting.region,
    category: meeting.type,
    imageUrl: meeting.image,
    dateLabel: formattedDate.date,
    timeLabel: formattedDate.time,
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
  const { openAlert } = useModal();
  const [cancelSelection, setCancelSelection] = useState<MyMeetingSummary | null>(null);
  const currentUser = useCurrentUser();
  const refetchCurrentUser = currentUser.refetch;
  useEffect(() => {
    void refetchCurrentUser();
  }, [refetchCurrentUser]);
  const actionLockRef = useMyMeetingActionLock();
  const reportError = (message: string) => openAlert({ message });
  const { cancelMeeting, cancelPendingId } = useCancelJoinedMeeting({
    actionLockRef,
    refetch: query.refetch,
    onError: reportError,
    onStarted: () => setCancelSelection(null),
  });
  const { toggleFavorite, favoritePendingIds } = useToggleJoinedMeetingFavorite({
    actionLockRef,
    onError: reportError,
  });

  const continuationRef = useInfiniteScrollTrigger({
    enabled: Boolean(query.hasNextPage) && !query.isFetching &&
      !query.isFetchNextPageError && !query.isRefetchError &&
      cancelPendingId === null && favoritePendingIds.size === 0 &&
      cancelSelection === null,
    fetchNextPage: query.fetchNextPage,
  });

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
          if (
            meeting.canCancel && !actionLockRef.current.cancelPending &&
            actionLockRef.current.favoriteIds.size === 0
          ) {
            setCancelSelection(meeting);
          }
        }}
        cancelPendingId={cancelPendingId}
        onFavorite={(meeting) => void toggleFavorite(meeting)}
        favoritePendingIds={favoritePendingIds}
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
      {query.hasNextPage && (
        <div ref={continuationRef}>
          <MeetingListContinuation
            isLoading={query.isFetchingNextPage}
            isError={query.isFetchNextPageError}
            onRetry={() => void query.fetchNextPage({ cancelRefetch: false })}
          />
        </div>
      )}
    </>
  );
}
