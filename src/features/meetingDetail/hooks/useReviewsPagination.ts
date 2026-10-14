// 리뷰 목록 + 페이지네이션
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { reviewKeys } from "../queryKeys";
import { getReviews } from "../api/meetingDetail.service";
import { Review } from "../types/meetingDetail";

const REVIEW_SIZE = 4;
const FETCH_PAGE_SIZE = 50;

/**
 * hasMore가 true인 동안 커서를 따라가며 전체 리뷰를 모읍니다.
 * 리뷰 개수가 많지 않다는 전제 하에, "한 번 로드 후 클라이언트에서 페이지네이션"하는 전략입니다.
 * API에서 totalCount를 넘겨주지 않아 부득이 하게 채택한 방법입니다.
 */
async function fetchAllReviews(meetingId: number): Promise<Review[]> {
  const all: Review[] = [];
  let cursor: string | null | undefined = undefined;

  while (true) {
    const page = await getReviews({ meetingId, cursor, size: FETCH_PAGE_SIZE });
    all.push(...page.data);

    if (!page.hasMore || !page.nextCursor) break;
    cursor = page.nextCursor;
  }

  return all;
}

export default function useReviewsPagination(meetingId: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const query = useQuery({
    queryKey: reviewKeys.list(meetingId),
    queryFn: () => fetchAllReviews(meetingId),
    enabled: !!meetingId,
    staleTime: 60 * 1000, // 리뷰는 자주 안 바뀌니 1분 정도는 캐시 유지
  });

  const allReviews = useMemo(() => query.data ?? [], [query.data]);
  const totalPages = Math.max(1, Math.ceil(allReviews.length / REVIEW_SIZE));

  const reviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEW_SIZE;
    return allReviews.slice(start, start + REVIEW_SIZE);
  }, [allReviews, currentPage]);

  return {
    reviews,
    isLoading: query.isLoading,
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };
}
