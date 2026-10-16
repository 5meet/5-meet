import type {
  ReviewStatistics,
} from "../types";

export async function getReviewStatistics(
  teamId: string,
): Promise<ReviewStatistics> {
  const searchParams =
    new URLSearchParams();

  searchParams.set(
    "teamId",
    teamId,
  );

  const response = await fetch(
    `/api/reviews/statistics?${searchParams.toString()}`,
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.message ??
        "리뷰 통계를 불러오지 못했습니다.",
    );
  }

  return response.json();
}