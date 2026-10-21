"use client";

import { useEffect } from "react";
import { useParams, notFound } from "next/navigation";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import MeetingDetailPageClient from "@/features/meetingDetail/views";
import { showToast } from "@/components/ui/Sonner";

const MeetingDetailPage = () => {
  const params = useParams<{ id: string }>();
  const { data: currentUser, isPending, isError } = useCurrentUser();

  useEffect(() => {
    if (isError) {
      showToast({
        kind: "error",
        message: "사용자 정보를 불러오지 못했습니다.",
        id: "current-user-error",
      });
    }
  }, [isError]);

  const meetingId = Number(params.id);

  if (!params?.id) {
    notFound();
  }

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    notFound();
  }

  // 사용자 정보 조회가 끝날 때까지 대기
  if (isPending || isError) {
    return null;
  }

  return (
    <MeetingDetailPageClient
      currentUserId={currentUser?.id ?? null}
      meetingId={meetingId}
      isLoggedIn={currentUser !== null}
    />
  );
};

export default MeetingDetailPage;
