import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addFavorite } from "../api/addFavorite";

export const useAddFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: number) =>
      addFavorite(meetingId),

    onSuccess: async () => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["favorites"],
    }),
    queryClient.invalidateQueries({
      queryKey: ["mypage", "reviews", "available"],
    }),
  ]);
},
  });
};