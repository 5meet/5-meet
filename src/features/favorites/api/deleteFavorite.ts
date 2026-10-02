export async function deleteFavorite(
  meetingId: number,
): Promise<void> {
  const response = await fetch(
    `/api/favorites/${meetingId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new Error(
      errorData?.message ??
        "찜 해제에 실패했습니다.",
    );
  }
}