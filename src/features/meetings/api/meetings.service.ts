import { api } from "@/lib/api/api";

import type {
  GetMeetingsParams,
  MeetingCreateRequest,
  MeetingListResponse,
  PopularMeeting,
} from "@/features/meetings/types/meetings";
import type {
  MeetingAPIResponse,
  MeetingFront,
} from "@/features/meetingDetail/types/meetingDetail";

import {
  mapToCreateMeeting,
  mapToMeeting,
  mapToPopularMeeting,
} from "@/features/meetings/meetings.mapper";

//------------------------------------------------------------------

// 모임 목록 조회
export const getMeetings = async (
  params: GetMeetingsParams = {},
): Promise<MeetingListResponse> => {
  // undefined / null / 빈 문자열은 쿼리스트링에서 제외
  const searchParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  ) as Record<string, string | number>;

  const res = await api
    .get("meetings", { searchParams })
    .json<MeetingListResponse>();

  return res;
};

//------------------------------------------------------------------

// 모임 생성
export const createMeeting = async (
  payload: MeetingCreateRequest,
): Promise<MeetingFront> => {
  const res = await api
    .post("meetings", { json: payload })
    .json<MeetingAPIResponse>();

  return mapToMeeting(res);
};

//------------------------------------------------------------------

// 지금 인기 있는 모임 목록 조회 (참가자 많은 순)
export const getPopularMeetings = async (
  size = 8,
): Promise<PopularMeeting[]> => {
  const now = new Date().toISOString();

  const res = await getMeetings({
    dateStart: now,
    sortBy: "participantCount",
    sortOrder: "desc",
    size: size * 3, // 필터링으로 줄어들 것을 감안
  });

  return res.data
    .filter(
      (m) =>
        m.canceledAt === null &&
        m.participantCount < m.capacity &&
        new Date(m.registrationEnd).getTime() > Date.now(),
    )
    .slice(0, size)
    .map(mapToPopularMeeting);
};
