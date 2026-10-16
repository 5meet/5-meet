import type { BaseMeeting } from "@/lib/types/meeting";

/** Swagger: GET /{teamId}/meetings/joined */
export interface JoinedMeeting extends BaseMeeting {
  address: string | null;
  dateTime: string | null;
  registrationEnd: string | null;
  description: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  isFavorited?: boolean;
  isJoined?: boolean;
  joinedAt: string | null;
  isReviewed: boolean;
}

export interface JoinedMeetingsResponse {
  data: JoinedMeeting[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface JoinedMeetingsParams {
  cursor?: string;
  size?: number;
  completed?: boolean;
  reviewed?: boolean;
  sortBy?: "dateTime" | "registrationEnd" | "joinedAt";
  sortOrder?: "asc" | "desc";
}
