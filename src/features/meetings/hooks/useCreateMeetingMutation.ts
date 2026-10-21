import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { HTTPError } from "ky";
import { createMeeting } from "../api/meetings.service";
import { meetingKeys } from "@/lib/queryKeys";
import { showToast } from "@/components/ui/Sonner";
import type { AppError } from "@/lib/api/type";
import type { MeetingCreateRequest } from "../types/meetings";

export function useCreateMeetingMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: MeetingCreateRequest) => createMeeting(payload),

    onSuccess: (meeting) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      showToast({ kind: "success", message: "모임이 생성되었습니다." });
      router.push(`/meetings/${meeting.id}`);
    },

    onError: (error) => {
      const code = (error as AppError).code;

      if (code === "DATETIME_MUST_BE_FUTURE") {
        showToast({
          kind: "error",
          message: "모임 일시는 현재보다 미래여야 합니다.",
        });
        return;
      }
      if (code === "REGISTRATION_END_BEFORE_DATETIME") {
        showToast({
          kind: "error",
          message: "모집 마감일은 모임 일시 이전이어야 합니다.",
        });
        return;
      }
      if (code === "INVALID_MEETING_TYPE") {
        showToast({ kind: "error", message: "존재하지 않는 모임 종류입니다." });
        return;
      }
      if (error instanceof HTTPError && error.response.status === 401) {
        showToast({ kind: "error", message: "로그인이 필요합니다." });
        return;
      }

      showToast({ kind: "error", message: (error as Error).message });
    },
  });
}
