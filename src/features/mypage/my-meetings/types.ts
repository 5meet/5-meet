/** Swagger: GET /{teamId}/meetings/joined */
export interface JoinedMeeting {
  id: number;
  teamId: string;
  name: string;
  type: string;
  region: string;
  address: string | null;
  dateTime: string | null;
  registrationEnd: string | null;
  capacity: number;
  participantCount: number;
  image: string | null;
  description: string | null;
  canceledAt: string | null;
  confirmedAt: string | null;
  hostId: number;
  createdBy: number;
  createdAt: string | null;
  updatedAt: string | null;
  host: { id: number; name: string; image: string | null };
  isFavorited?: boolean;
  isJoined?: boolean;
  isCompleted: boolean;
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
