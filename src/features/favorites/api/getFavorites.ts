import type {
  GetFavoritesParams,
  GetFavoritesResponse,
} from "../types";

export const getFavorites = async (
  params?: GetFavoritesParams,
): Promise<GetFavoritesResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.type) {
    searchParams.set("type", params.type);
  }

  if (params?.region) {
    searchParams.set("region", params.region);
  }

  if (params?.dateStart) {
    searchParams.set("dateStart", params.dateStart);
  }

  if (params?.dateEnd) {
    searchParams.set("dateEnd", params.dateEnd);
  }

  if (params?.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (params?.sortOrder) {
    searchParams.set("sortOrder", params.sortOrder);
  }

  if (params?.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  if (params?.offset !== undefined) {
    searchParams.set("offset", String(params.offset));
  }

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.size !== undefined) {
    searchParams.set("size", String(params.size));
  }

  const query = searchParams.toString();

  const response = await fetch(
    query
      ? `/api/favorites?${query}`
      : "/api/favorites",
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ??
        "찜한 모임을 불러오지 못했습니다.",
    );
  }

  return response.json();
};