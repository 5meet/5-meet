export interface AddFavoriteResponse {
  id?: number;
  teamId?: string;
  meetingId?: number;
  userId?: number;
  createdAt?: string;
}

export async function addFavorite(
  meetingId: number,
): Promise<AddFavoriteResponse | null> {
  const response = await fetch("/api/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      meetingId,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.message ??
        "찜하기에 실패했습니다.",
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}