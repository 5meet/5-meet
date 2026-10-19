import {
  useQuery,
} from "@tanstack/react-query";

import {
  getReviews,
} from "../api/getReviews";

import type {
  GetReviewsParams,
} from "../types";

export function useReviewsQuery(
  params?: GetReviewsParams,
) {
  return useQuery({
    queryKey: [
      "reviews",
      params,
    ],
    queryFn: () =>
      getReviews(params),
  });
}