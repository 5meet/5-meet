import {
  useQuery,
} from "@tanstack/react-query";

import {
  getReviewStatistics,
} from "../api/getReviewStatistics";

export function useReviewStatisticsQuery(
  teamId?: string,
) {
  return useQuery({
    queryKey: [
      "review-statistics",
      teamId,
    ],

    queryFn: () =>
      getReviewStatistics(
        teamId as string,
      ),

    enabled: Boolean(teamId),
  });
}