import { MeetingDetail, MeetingDetailResponse } from "./meetingDetail";

// 찜 추가 응답
export interface FavoriteResponse {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  createdAt: string;
  meeting: MeetingDetailResponse;
}

export interface FavoriteToggleResult {
  message: string;
  meeting?: MeetingDetailResponse;
}

export interface FavoriteMutationContext {
  previousMeeting: MeetingDetail | undefined;
}
