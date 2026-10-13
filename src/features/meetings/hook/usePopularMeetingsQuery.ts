import { useQuery } from "@tanstack/react-query";
import { getPopularMeetings } from "../api/meetings.service";
import { meetingKeys } from "@/features/meetingDetail/queryKeys";

export function usePopularMeetingsQuery(size = 8) {
  return useQuery({
    queryKey: meetingKeys.popular(size),
    queryFn: () => getPopularMeetings(size),
    staleTime: 60 * 1000,
  });
}
