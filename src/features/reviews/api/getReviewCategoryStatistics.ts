import type {
  ReviewCategoryStatisticsResponse,
} from "../types";

export async function getReviewCategoryStatistics(
  teamId: string,
): Promise<ReviewCategoryStatisticsResponse> {
  const searchParams =
    new URLSearchParams();

  searchParams.set(
    "teamId",
    teamId,
  );

  const response = await fetch(
    `/api/reviews/categories/statistics?${searchParams.toString()}`,
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.message ??
        "카테고리별 리뷰 통계를 불러오지 못했습니다.",
    );
  }

  return response.json();
}