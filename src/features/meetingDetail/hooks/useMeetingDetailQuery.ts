// 모임 상세 조회
import { useQuery } from "@tanstack/react-query";
import { meetingKeys } from "@/lib/queryKeys";
import { getMeetingDetail } from "../api/meetingDetail.service";

export default function useMeetingDetailQuery(
  meetingId: number,
  isLoggedIn: boolean,
) {
  return useQuery({
    queryKey: [...meetingKeys.detail(meetingId), isLoggedIn],
    queryFn: () => getMeetingDetail(meetingId, isLoggedIn),
  });
}
