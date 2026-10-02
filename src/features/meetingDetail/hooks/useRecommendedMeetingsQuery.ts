// 추천 모임 목록 조회
import { useQuery } from "@tanstack/react-query";
import { meetingKeys } from "../queryKeys";
import { getRecommendedMeetings } from "../api/meetingDetail.service";
import { MeetingDetail } from "../types/meetingDetail";

export function useRecommendedMeetingsQuery(
  meeting: MeetingDetail | undefined,
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
