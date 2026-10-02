// 모임 상세 조회
import { useQuery } from "@tanstack/react-query";
import { meetingKeys } from "../queryKeys";
import { getMeetingDetail } from "../api/meetingDetail.service";

export function useMeetingDetailQuery(meetingId: number) {
  return useQuery({
    queryKey: meetingKeys.detail(meetingId),
    queryFn: () => getMeetingDetail(meetingId),
  });
}
