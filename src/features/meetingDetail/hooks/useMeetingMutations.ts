// Mutation
import { HTTPError } from "ky";
import { AppError } from "@/lib/api/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { meetingKeys } from "../queryKeys";

import { showToast } from "@/components/ui/Sonner";

import {
  joinMeeting,
  cancelMeeting,
  updateMeetingDetail,
  deleteMeetingDetail,
  changeMeetingStatus,
} from "../api/meetingDetail.service";
import type {
  MeetingUpdateRequest,
  MeetingStatus,
} from "@/features/meetingDetail/types/meetingDetail";

// 모임 참여 (참여자)
export function useJoinMeetingMutation(meetingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => joinMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      showToast({ kind: "success", message: "모임 참여가 완료되었습니다." });
    },
    onError: (error) => {
      const code = (error as AppError).code;
      if (code === "ALREADY_JOINED") {
        queryClient.invalidateQueries({
          queryKey: meetingKeys.detail(meetingId),
        });
        showToast({ kind: "error", message: "이미 참여 중인 모임입니다." });
        return;
      }
      showToast({ kind: "error", message: (error as Error).message });
    },
  });
}

// 모임 참여 취소 (참여자)
export function useCancelMeetingMutation(meetingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      showToast({ kind: "success", message: "참여가 취소되었습니다." });
    },
    onError: (error) => {
      showToast({ kind: "error", message: (error as Error).message });
    },
  });
}

//-----------------------------------------------------------------

// 모임 수정 (주최자)
export function useUpdateMeetingMutation(meetingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MeetingUpdateRequest) =>
      updateMeetingDetail(meetingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      showToast({ kind: "success", message: "모임이 수정되었습니다." });
    },
    onError: (error) => {
      const code = (error as AppError).code;

      // 필드별로 다르게 안내해야 하는 400 에러들
      if (code === "CAPACITY_TOO_SMALL") {
        showToast({
          kind: "error",
          message: "정원을 현재 참가자 수보다 줄일 수 없습니다.",
        });
        return;
      }
      if (code === "DATETIME_MUST_BE_FUTURE") {
        showToast({ kind: "error", message: "모임 일시는 미래여야 합니다." });
        return;
      }
      if (code === "REGISTRATION_END_BEFORE_DATETIME") {
        showToast({
          kind: "error",
          message: "모집 마감일은 모임 일시 이전이어야 합니다.",
        });
        return;
      }
      if (code === "CANCELED") {
        showToast({
          kind: "error",
          message: "취소된 모임은 수정할 수 없습니다.",
        });
        return;
      }

      if (error instanceof HTTPError && error.response.status === 403) {
        showToast({
          kind: "error",
          message: "호스트만 모임을 수정할 수 있습니다.",
        });
        return;
      }
      if (error instanceof HTTPError && error.response.status === 404) {
        showToast({ kind: "error", message: "존재하지 않는 모임입니다." });
        return;
      }

      showToast({ kind: "error", message: (error as Error).message });
    },
  });
}

// 모임 삭제 (주최자)
export function useDeleteMeetingMutation(meetingId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteMeetingDetail(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      showToast({ kind: "success", message: "모임이 삭제되었습니다." });
      router.push("/meetings");
    },
    onError: (error) => {
      if (error instanceof HTTPError && error.response.status === 404) {
        showToast({
          kind: "error",
          message: "이미 삭제되었거나 존재하지 않는 모임입니다.",
        });
        router.push("/meetings");
        return;
      }
      showToast({ kind: "error", message: (error as Error).message });
    },
  });
}

// 모임 상태 변경 (주최자)
export function useChangeMeetingStatusMutation(meetingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: MeetingStatus) =>
      changeMeetingStatus(meetingId, status),
    onSuccess: (_data, status) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      showToast({
        kind: "success",
        message:
          status === "CONFIRMED"
            ? "모임이 확정되었습니다."
            : "모임이 취소되었습니다.",
      });
    },
    onError: (error) => {
      const code = (error as AppError).code;

      // 400: 이미 취소된 모임
      if (code === "CANCELED") {
        showToast({
          kind: "error",
          message: "이미 취소된 모임은 상태를 변경할 수 없습니다.",
        });
        return;
      }

      if (error instanceof HTTPError && error.response.status === 403) {
        showToast({
          kind: "error",
          message: "호스트만 모임 상태를 변경할 수 있습니다.",
        });
        return;
      }
      if (error instanceof HTTPError && error.response.status === 404) {
        showToast({ kind: "error", message: "존재하지 않는 모임입니다." });
        return;
      }

      showToast({ kind: "error", message: (error as Error).message });
    },
  });
}
