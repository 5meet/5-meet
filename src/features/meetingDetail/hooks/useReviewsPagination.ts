// 리뷰 목록 + 페이지네이션
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCursorPagination } from "./useCursorPagination";
import { reviewKeys } from "../queryKeys";
import { getReviews } from "../api/meetingDetail.service";

const REVIEW_SIZE = 5;

export function useReviewsPagination(meetingId: number) {
  const { currentPage, totalPages, cursor, setCurrentPage, registerPage } =
    useCursorPagination();

  const query = useQuery({
    queryKey: reviewKeys.list(meetingId, { cursor, size: REVIEW_SIZE }),
    queryFn: () => getReviews({ meetingId, cursor, size: REVIEW_SIZE }),
    enabled: !!meetingId,
  });

  useEffect(() => {
    if (query.data) {
      registerPage(currentPage, query.data.nextCursor, query.data.hasMore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return {
    reviews: query.data?.data ?? [],
    isLoading: query.isLoading,
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };
}
