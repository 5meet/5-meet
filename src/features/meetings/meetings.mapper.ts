import type {
  MeetingFormValues,
  MeetingCreateRequest,
  PopularMeeting,
} from "@/features/meetings/types/meetings";
import type {
  MeetingFront,
  MeetingAPIResponse,
} from "@/features/meetingDetail/types/meetingDetail";
import { combineKSTDateTimeToISO } from "@/lib/convertDate/formatMeetingDate";
import {
  convertDateType1,
  convertDateType4,
} from "@/lib/convertDate/formatMeetingDate";

// 응답 매핑 공통 함수
export const mapToMeeting = (res: MeetingAPIResponse): MeetingFront => {
  const { date, time } = convertDateType1(res.dateTime);
  const createdAt = convertDateType4(new Date(res.createdAt));

  return {
    id: res.id,
    title: res.name,
    location: res.region,
    category: res.type,
    date,
    time,
    dateTime: res.dateTime,
    registrationEnd: res.registrationEnd,
    capacity: res.capacity,
    participantCount: res.participantCount,
    image: res.image,
    description: res.description,
    address: res.address,
    latitude: res.latitude,
    longitude: res.longitude,
    createdAt: createdAt,
    hostId: res.hostId,
    host: res.host,
    initialIsFavorited: res.isFavorited,
    initialIsParticipating: res.isJoined,
    isCompleted: res.isCompleted,
    canceledAt: res.canceledAt,
    confirmedAt: res.confirmedAt,
  };
};

// 요청 매핑
export const mapToCreateMeeting = (
  form: MeetingFormValues,
): MeetingCreateRequest => {
  const dateTime = combineKSTDateTimeToISO(form.date, form.time);
  const registrationEnd = combineKSTDateTimeToISO(
    form.registrationEndDate,
    form.registrationEndTime,
  );

  return {
    name: form.name.trim(),
    type: form.type,
    region: form.region,
    address: `${form.address} ${form.detailAddress}`.trim(),
    latitude: form.latitude,
    longitude: form.longitude,
    dateTime,
    registrationEnd,
    capacity: Number(form.capacity),
    image: form.image,
    description: form.description.trim(),
  };
};

// 지금 인기 있는 모임 (참가자 많은 수 정렬)
export const mapToPopularMeeting = (
  res: MeetingAPIResponse,
): PopularMeeting => {
  const { date, time } = convertDateType1(res.dateTime);
  return {
    id: res.id,
    title: res.name,
    image: res.image,
    location: res.region,
    category: res.type,
    date,
    time,
    registrationEnd: res.registrationEnd,
    initialIsFavorited: res.isFavorited,
    participantCount: res.participantCount,
    capacity: res.capacity,
  };
};
