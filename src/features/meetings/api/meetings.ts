import { api } from "@/lib/api/api";
import type { GetMeetingsParams, MeetingsPage } from "./types";

const TEAM_ID = "5meet";

export async function getMeetings(
  params: GetMeetingsParams = {},
): Promise<MeetingsPage> {
  const searchParams = new URLSearchParams();

  if (params.type && params.type !== "all") {
    searchParams.set("type", params.type);
  }
  if (params.region) searchParams.set("region", params.region);
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.dateStart) searchParams.set("dateStart", params.dateStart);
  if (params.dateEnd) searchParams.set("dateEnd", params.dateEnd);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  searchParams.set("size", String(params.size ?? 10));
  if (params.cursor) searchParams.set("cursor", params.cursor);

  return api
    .get(`${TEAM_ID}/meetings`, { searchParams })
    .json<MeetingsPage>();
}
