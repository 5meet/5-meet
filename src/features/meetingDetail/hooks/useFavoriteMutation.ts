// useFavoriteMeetingMutation은 "모임 상세"(meetingKeys.detail)만 갱신하도록 좁게 설계되어 있습니다.
// 추후 찜하기 기능의 구현이 완료된다면 교체할 예정입니다.

import { HTTPError } from "ky";
import { AppError } from "@/lib/api/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meetingKeys } from "../queryKeys";

import { showToast } from "@/components/ui/Sonner";

import type {
  FavoriteToggleResult,
  FavoriteMutationContext,
} from "@/features/meetingDetail/types/favorite";
import type { MeetingDetail } from "@/features/meetingDetail/types/meetingDetail";
import {
  unfavoriteMeeting,
  favoriteMeeting,
} from "@/features/meetingDetail/api/favorite.service";
import { mapToMeetingDetail } from "@/features/meetingDetail/api/meetingDetail.service";

function useFavoriteMeetingMutation(meetingId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    FavoriteToggleResult,
    Error,
    boolean,
    FavoriteMutationContext
  >({
    mutationFn: (isFavorited: boolean) =>
      isFavorited ? unfavoriteMeeting(meetingId) : favoriteMeeting(meetingId),

    onMutate: async (isFavorited) => {
      await queryClient.cancelQueries({
        queryKey: meetingKeys.detail(meetingId),
      });

      const previousMeeting = queryClient.getQueryData<MeetingDetail>(
        meetingKeys.detail(meetingId),
      );

      queryClient.setQueryData<MeetingDetail>(
        meetingKeys.detail(meetingId),
        (old) => (old ? { ...old, initialIsFavorited: !isFavorited } : old),
      );

      return { previousMeeting }; // onError에서 롤백에 사용
    },

    onSuccess: (result, isFavorited) => {
      if (result.meeting) {
        queryClient.setQueryData<MeetingDetail>(
          meetingKeys.detail(meetingId),
          mapToMeetingDetail(result.meeting),
        );
      }

      showToast({ kind: "success", message: result.message });
    },

    onError: (error, isFavorited, context) => {
      // 실패 시 onMutate 이전 상태로 롤백
      if (context?.previousMeeting) {
        queryClient.setQueryData<MeetingDetail>(
          meetingKeys.detail(meetingId),
          context.previousMeeting,
        );
      }

      const code = (error as AppError).code;

      // 409: 이미 찜한 모임을 다시 찜하려 할 때 — 상태 동기화
      if (
        code === "ALREADY_FAVORITED" ||
        (error instanceof HTTPError && error.response.status === 409)
      ) {
        queryClient.invalidateQueries({
          queryKey: meetingKeys.detail(meetingId),
        });
        showToast({ kind: "error", message: "이미 찜한 모임입니다." });
        return;
      }

      if (error instanceof HTTPError && error.response.status === 401) {
        showToast({ kind: "error", message: "로그인이 필요합니다." });
        return;
      }
      if (error instanceof HTTPError && error.response.status === 404) {
        showToast({
          kind: "error",
          message: isFavorited
            ? "찜하지 않은 모임입니다."
            : "존재하지 않는 모임입니다.",
        });
        queryClient.invalidateQueries({
          queryKey: meetingKeys.detail(meetingId),
        });
        return;
      }

      showToast({ kind: "error", message: (error as Error).message });
    },

    // 성공/실패와 무관하게 마지막엔 항상 서버 진실로 동기화
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: meetingKeys.detail(meetingId),
      });
    },
  });
}

export default useFavoriteMeetingMutation;
