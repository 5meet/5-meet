"use client";

import { useModal } from "@/contexts/ModalContext";
import Button from "@/components/ui/Button/Button";
import MeetingListContinuation from "../../my-meetings/components/MeetingListContinuation";
import { useJoinedMeetingsInfiniteScroll } from "../../my-meetings/hooks/useJoinedMeetingsInfiniteScroll";
import { useCreatedMeetingsQuery } from "../hooks/useCreatedMeetingsQuery";
import { useCreatedMeetingFavorite } from "../hooks/useCreatedMeetingFavorite";
import CreatedMeetingsView from "./CreatedMeetingsView";

export default function CreatedMeetingsContent() {
  const query = useCreatedMeetingsQuery();
  const { openAlert } = useModal();
  const { toggleFavorite, pendingId } = useCreatedMeetingFavorite((message) => openAlert({ message }));
  const continuationRef = useJoinedMeetingsInfiniteScroll({
    enabled: Boolean(query.hasNextPage) && !query.isFetching && !query.isFetchNextPageError &&
      !query.isRefetchError && pendingId === null,
    fetchNextPage: query.fetchNextPage,
  });

  if (query.isPending) return <CreatedMeetingsView status="loading" />;
  if (query.isError && !query.data) {
    return <CreatedMeetingsView status="error" message={query.error.message} onRetry={() => void query.refetch()} />;
  }

  return (
    <>
      <CreatedMeetingsView status="success" meetings={query.data.pages.flatMap((page) => page.data)}
        onFavorite={(meeting) => void toggleFavorite(meeting)} favoritePending={pendingId !== null} />
      {query.isRefetchError && !query.isFetchNextPageError && (
        <div role="alert" className="mt-4 text-center">
          <p>목록 갱신에 실패했습니다. 기존 목록은 유지됩니다.</p>
          <Button variant="secondary" className="mt-3 w-auto" onClick={() => void query.refetch()}>목록 다시 불러오기</Button>
        </div>
      )}
      {query.hasNextPage && (
        <div ref={continuationRef}>
          <MeetingListContinuation isLoading={query.isFetchingNextPage} isError={query.isFetchNextPageError}
            onRetry={() => void query.fetchNextPage({ cancelRefetch: false })} />
        </div>
      )}
    </>
  );
}
