import type { MeetingFormValues } from "@/features/meetings/types/meetings";
import type {
  MeetingFront,
  MeetingAPIResponse,
} from "@/features/meetingDetail/types/meetingDetail";
import { splitISOToKSTDateTime } from "@/lib/convertDate/formatMeetingDate";
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
