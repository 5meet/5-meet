import { api } from "@/lib/api/api";

import type {
  GetMeetingsParams,
  MeetingFormValues,
  MeetingCreateRequest,
  MeetingListResponse,
} from "@/features/meetings/types/meetings";
import type {
  MeetingAPIResponse,
  MeetingFront,
} from "@/features/meetingDetail/types/meetingDetail";

import { mapToMeeting } from "@/features/meetingDetail/api/meetingDetail.service";

import {
  convertDateType1,
  convertDateType4,
} from "@/lib/convertDate/formatMeetingDate";
import {
  splitISOToKSTDateTime,
  combineKSTDateTimeToISO,
} from "@/lib/convertDate/formatMeetingDate";

// MeetingFront는 기존 MeetingDetail과 필드가 완전히 같고, MeetingsApiResponse도 MeetingDetailResponse와 같음-> 정리 팔요
// mapper를 meetings.mapper.ts로 분리하기

// 생성/수정 요청 매핑 공통 함수
export const mapMeetingToFormValues = (
  meeting: MeetingFront,
): MeetingFormValues => {
  const { date, time } = splitISOToKSTDateTime(meeting.dateTime);
  const { date: registrationEndDate, time: registrationEndTime } =
    splitISOToKSTDateTime(meeting.registrationEnd);

  return {
    type: meeting.category,
    name: meeting.title,
    region: meeting.location,
    address: meeting.address, // 서버는 전체 주소를 하나로 저장
    detailAddress: "", // 서버에 분리 저장되지 않으므로 빈 값
    latitude: meeting.latitude,
    longitude: meeting.longitude,
    image: meeting.image,
    description: meeting.description,
    date,
    time,
    registrationEndDate,
    registrationEndTime,
    capacity: meeting.capacity,
  };
};

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
