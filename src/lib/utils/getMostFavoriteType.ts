interface Favorite {
  meeting: {
    type: string;
  };
}

export function getMostFavoriteType(
  favorites: Favorite[],
): string | null {
  if (favorites.length === 0) return null;

  const counts = new Map<string, number>();

  let mostType: string | null = null;
  let maxCount = 0;

  for (const favorite of favorites) {
    const type = favorite.meeting.type;
    const count = (counts.get(type) ?? 0) + 1;

    counts.set(type, count);

    if (count > maxCount) {
      maxCount = count;
      mostType = type;
    }
  }

  return mostType;
}