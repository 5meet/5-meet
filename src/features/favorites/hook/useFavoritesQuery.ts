import { useQuery } from "@tanstack/react-query";

import { getFavorites } from "../api/getFavorites";
import type { GetFavoritesParams } from "../types";

export const useFavoritesQuery = (
  params?: GetFavoritesParams,
) => {
  return useQuery({
    queryKey: ["favorites", params],
    queryFn: () => getFavorites(params),
  });
};