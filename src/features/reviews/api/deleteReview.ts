export interface DeleteReviewResponse {
  message: string;
}

export async function deleteReview(
  teamId: string,
  reviewId: number,
): Promise<DeleteReviewResponse> {
  const response = await fetch(
    `/api/teams/${encodeURIComponent(teamId)}/reviews/${reviewId}`,
    {
      method: "DELETE",
      credentials: "same-origin",
    },
  );

  const responseText = await response.text();

  let result: unknown = null;

  try {
    result = responseText ? JSON.parse(responseText) : null;
  } catch {
    result = responseText;
  }

  if (!response.ok) {
    console.error("[리뷰 삭제 실패]", {
      status: response.status,
      response: result,
    });

    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : `리뷰 삭제에 실패했습니다. (${response.status})`;

    throw new Error(message);
  }

  return (
    typeof result === "object" && result !== null
      ? result
      : { message: "리뷰가 삭제되었습니다." }
  ) as DeleteReviewResponse;
}