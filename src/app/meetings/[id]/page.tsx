"use client";

import { useParams, notFound } from "next/navigation";
import MeetingDetailPageClient from "@/features/meetingDetail/views";

const MeetingDetailPage = () => {
  const params = useParams<{ id: string }>();

  if (!params) {
    return notFound();
  }

  if (!params.id) {
    return notFound();
  }

  return (
    <MeetingDetailPageClient
      currentUserId={1}
      meetingId={Number(params.id)}
      isLoggedIn={true}
    />
  );
};

export default MeetingDetailPage;
