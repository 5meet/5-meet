import type { BaseMeeting } from "@/lib/types/meeting";

/** Fields consumed from Swagger UserMeeting (users/me/meetings?type=created). */
export interface CreatedMeeting extends BaseMeeting {
  dateTime: string | null;
  isFavorited?: boolean;
  role: "host" | "participant";
}

export interface CreatedMeetingsResponse {
  data: CreatedMeeting[];
  hasMore: boolean;
  nextCursor: string | null;
}
