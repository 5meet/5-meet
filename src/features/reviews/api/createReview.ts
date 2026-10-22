
export interface CreateReviewRequest {
  score: number;
  comment: string;
}

export interface CreateReviewResponse {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export async function createReview(
  teamId: string,
  meetingId: number,
  data: CreateReviewRequest,
): Promise<CreateReviewResponse> {
  const response = await fetch(
    `/api/teams/${encodeURIComponent(teamId)}/meetings/${meetingId}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(data),
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
    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : `리뷰 작성에 실패했습니다. (${response.status})`;

    throw new Error(message);
  }

  if (result === null) {
    throw new Error("리뷰 작성 응답이 비어 있습니다.");
  }

  return result as CreateReviewResponse;
}
