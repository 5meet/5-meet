import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addFavorite } from "../api/addFavorite";

export const useAddFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: number) =>
      addFavorite(meetingId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
};