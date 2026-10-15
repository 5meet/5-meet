// 추천 모임 목록 조회
import { useQuery } from "@tanstack/react-query";
import { meetingKeys } from "@/lib/queryKeys";
import { getRecommendedMeetings } from "../api/meetingDetail.service";
import type { MeetingFront } from "../types/meetingDetail";

export default function useRecommendedMeetingsQuery(
  meeting: MeetingFront | undefined,
) {
  return useQuery({
    queryKey: meetingKeys.recommended(meeting?.id ?? 0),
    queryFn: () =>
      getRecommendedMeetings({
        currentMeetingId: meeting!.id,
        category: meeting!.category,
        region: meeting!.location,
      }),
    enabled: !!meeting, // 상세 조회가 끝난 뒤에만 실행
  });
}
