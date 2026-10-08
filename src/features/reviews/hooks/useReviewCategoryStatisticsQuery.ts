import {
  useQuery,
} from "@tanstack/react-query";

import {
  getReviewCategoryStatistics,
} from "../api/getReviewCategoryStatistics";

export function useReviewCategoryStatisticsQuery(
  teamId?: string,
) {
  return useQuery({
    queryKey: [
      "review-category-statistics",
      teamId,
    ],

    queryFn: () =>
      getReviewCategoryStatistics(
        teamId as string,
      ),

    enabled: Boolean(teamId),
  });
}