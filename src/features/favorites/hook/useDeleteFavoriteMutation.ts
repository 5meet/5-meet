import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteFavorite } from "../api/deleteFavorite";

export const useDeleteFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: number) =>
      deleteFavorite(meetingId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
};