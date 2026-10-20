
import { api } from "@/lib/api/api";
import type { MeetingsResponse } from "../types/meeting";

interface GetMeetingsParams {
  keyword?: string;
  cursor?: string;
  size?: number;
}

export async function getMeetings({
  keyword,
  cursor,
  size = 20,
}: GetMeetingsParams): Promise<MeetingsResponse> {
  const searchParams = new URLSearchParams();

  searchParams.set("size", String(size));

  if (keyword) {
    searchParams.set("keyword", keyword);
  }

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  return api
    .get("/meetings", { searchParams })
    .json<MeetingsResponse>();
}
