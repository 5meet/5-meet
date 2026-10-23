import type { ReviewApiItem } from "@/features/reviews/types";

interface UpdateReviewPayload {
  score: number;
  comment: string;
}

export async function updateReview(
  teamId: string,
  reviewId: number,
  payload: UpdateReviewPayload,
): Promise<ReviewApiItem> {
  const response = await fetch(
    `/api/teams/${encodeURIComponent(teamId)}/reviews/${reviewId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ?? `리뷰 수정에 실패했습니다. (${response.status})`,
    );
  }

  return result as ReviewApiItem;
}