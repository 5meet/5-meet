import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showToast } from "@/components/ui/Sonner";
import { meetingKeys } from "@/lib/queryKeys";
import { useAddFavoriteMutation } from "@/features/favorites/hook/useAddFavoriteMutation";
import { useDeleteFavoriteMutation } from "@/features/favorites/hook/useDeleteFavoriteMutation";
import type { MeetingFront } from "@/features/meetingDetail/types/meetingDetail";

interface FavoriteMutationContext {
  previousMeeting: MeetingFront | undefined;
}

function useFavoriteMeetingMutation(meetingId: number) {
  const queryClient = useQueryClient();
  const addMutation = useAddFavoriteMutation();
  const deleteMutation = useDeleteFavoriteMutation();

  // 변수: 현재 찜 상태(true면 해제, false면 추가)
  return useMutation<unknown, Error, boolean, FavoriteMutationContext>({
    mutationFn: (isFavorited) =>
      isFavorited
        ? deleteMutation.mutateAsync(meetingId)
        : addMutation.mutateAsync(meetingId),

    onMutate: async (isFavorited) => {
      await queryClient.cancelQueries({
        queryKey: meetingKeys.detail(meetingId),
      });

      const previousMeeting = queryClient.getQueryData<MeetingFront>(
        meetingKeys.detail(meetingId),
      );

      queryClient.setQueryData<MeetingFront>(
        meetingKeys.detail(meetingId),
        (old) => (old ? { ...old, initialIsFavorited: !isFavorited } : old),
      );

      return { previousMeeting };
    },

    onSuccess: (_data, isFavorited) => {
      showToast({
        kind: "success",
        message: isFavorited
          ? "찜 목록에서 삭제되었습니다."
          : "찜 목록에 추가되었습니다.",
      });
    },

    onError: (error, _isFavorited, context) => {
      if (context?.previousMeeting) {
        queryClient.setQueryData<MeetingFront>(
          meetingKeys.detail(meetingId),
          context.previousMeeting,
        );
      }
      showToast({ kind: "error", message: error.message });
    },

    // 성공/실패와 무관하게 서버 상태로 동기화 (상세 + 목록/추천 카드)
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: meetingKeys.detail(meetingId),
      });
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
  });
}

export default useFavoriteMeetingMutation;
