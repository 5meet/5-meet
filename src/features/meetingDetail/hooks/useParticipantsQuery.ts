// 참가자 목록 조회
import { useQuery } from "@tanstack/react-query";
import { meetingKeys } from "../queryKeys";
import { getParticipants } from "../api/meetingDetail.service";

export default function useParticipantsQuery(meetingId: number, size = 20) {
  return useQuery({
    queryKey: meetingKeys.participants(meetingId, { size }),
    queryFn: () => getParticipants({ meetingId, size }),
    enabled: !!meetingId,
  });
}
