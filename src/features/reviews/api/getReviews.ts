import type {
  GetReviewsParams,
  GetReviewsResponse,
} from "../types";

export async function getReviews(
  params?: GetReviewsParams,
): Promise<GetReviewsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.meetingId !== undefined) {
    searchParams.set(
      "meetingId",
      String(params.meetingId),
    );
  }

  if (params?.userId !== undefined) {
    searchParams.set(
      "userId",
      String(params.userId),
    );
  }

  if (params?.type) {
    searchParams.set("type", params.type);
  }

  if (params?.region) {
    searchParams.set("region", params.region);
  }

  if (params?.dateStart) {
    searchParams.set(
      "dateStart",
      params.dateStart,
    );
  }

  if (params?.dateEnd) {
    searchParams.set(
      "dateEnd",
      params.dateEnd,
    );
  }

  if (params?.registrationEndStart) {
    searchParams.set(
      "registrationEndStart",
      params.registrationEndStart,
    );
  }

  if (params?.registrationEndEnd) {
    searchParams.set(
      "registrationEndEnd",
      params.registrationEndEnd,
    );
  }

  if (params?.sortBy) {
    searchParams.set(
      "sortBy",
      params.sortBy,
    );
  }

  if (params?.sortOrder) {
    searchParams.set(
      "sortOrder",
      params.sortOrder,
    );
  }

  if (params?.cursor) {
    searchParams.set(
      "cursor",
      params.cursor,
    );
  }

  if (params?.size !== undefined) {
    searchParams.set(
      "size",
      String(params.size),
    );
  }

  const query = searchParams.toString();

  const response = await fetch(
    query
      ? `/api/reviews?${query}`
      : "/api/reviews",
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.message ??
        "리뷰를 불러오지 못했습니다.",
    );
  }

  return response.json();
}