import { api } from "@/lib/api/api";

import type {
  FavoriteResponse,
  FavoriteToggleResult,
} from "@/features/meetingDetail/types/favorite";
import type { ResponseMessage } from "@/features/meetingDetail/types/meetingDetail";

// 찜 추가
export const favoriteMeeting = async (
  meetingId: number,
): Promise<FavoriteToggleResult> => {
  const res = await api
    .post(`meetings/${meetingId}/favorites`)
    .json<FavoriteResponse>();

  return {
    meeting: res.meeting,
    message: "찜 목록에 추가되었습니다.",
  };
};

// 찜 해제
export const unfavoriteMeeting = async (
  meetingId: number,
): Promise<FavoriteToggleResult> => {
  const res = await api
    .delete(`meetings/${meetingId}/favorites`)
    .json<ResponseMessage>();

  return {
    message: res.message,
  };
};
