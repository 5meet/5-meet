import { MeetingFront, MeetingAPIResponse } from "./meetingDetail";

// 찜 추가 응답
export interface FavoriteResponse {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  createdAt: string;
  meeting: MeetingAPIResponse;
}

export interface FavoriteToggleResult {
  message: string;
  meeting?: MeetingAPIResponse;
}

export interface FavoriteMutationContext {
  previousMeeting: MeetingFront | undefined;
}
