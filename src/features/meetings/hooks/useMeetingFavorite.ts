"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAddFavoriteMutation } from "@/features/favorites/hook/useAddFavoriteMutation";
import { useDeleteFavoriteMutation } from "@/features/favorites/hook/useDeleteFavoriteMutation";
import { showToast } from "@/components/ui/Sonner";

interface FavoriteState {
  isLiked: boolean;
  isPending: boolean;
}

export function useMeetingFavorite(meetingId: number, initialIsFavorited = false) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const queryKey = ["meeting-favorite-state", meetingId] as const;
  const addFavoriteMutation = useAddFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();
  // 같은 모임의 모든 카드가 상태를 공유하며, 마지막 카드가 사라지면 제거합니다.
  const { data: state } = useQuery<FavoriteState>({
    queryKey,
    queryFn: () => ({ isLiked: initialIsFavorited, isPending: false }),
    initialData: { isLiked: initialIsFavorited, isPending: false },
    enabled: false,
    gcTime: 0,
  });

  const onToggle = async () => {
    const current = queryClient.getQueryData<FavoriteState>(queryKey);
    if (!current || current.isPending) return;

    // 캐시를 즉시 잠가 다른 목록의 카드에서도 중복 요청을 막습니다.
    queryClient.setQueryData<FavoriteState>(queryKey, {
      ...current,
      isPending: true,
    });

    try {
      if (current.isLiked) {
        await deleteFavoriteMutation.mutateAsync(meetingId);
      } else {
        await addFavoriteMutation.mutateAsync(meetingId);
      }
      queryClient.setQueryData<FavoriteState>(queryKey, {
        isLiked: !current.isLiked,
        isPending: false,
      });
      // 서버에서 계산하는 추천 유형과 목록도 다시 조회합니다.
      router.refresh();
    } catch (error) {
      queryClient.setQueryData<FavoriteState>(queryKey, current);
      showToast({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "찜 상태를 변경하지 못했습니다.",
      });
    }
  };

  return { isLiked: state.isLiked, isFavoritePending: state.isPending, onToggle };
}
