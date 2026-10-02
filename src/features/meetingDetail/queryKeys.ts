import { GetMeetingsParams, PaginationParmas } from "./types/meetingDetail";

export const meetingKeys = {
  all: ["meetings"] as const,

  detail: (meetingId: number) =>
    [...meetingKeys.all, "detail", meetingId] as const,

  participants: (meetingId: number, params?: PaginationParmas) =>
    [...meetingKeys.detail(meetingId), "participants", params] as const,

  recommended: (meetingId: number) =>
    [...meetingKeys.detail(meetingId), "recommended"] as const,

  list: (params: GetMeetingsParams) =>
    [...meetingKeys.all, "list", params] as const,
};

export const reviewKeys = {
  all: ["reviews"] as const,

  list: (meetingId: number, params?: PaginationParmas) =>
    [...reviewKeys.all, "meeting", meetingId, params] as const,
};
