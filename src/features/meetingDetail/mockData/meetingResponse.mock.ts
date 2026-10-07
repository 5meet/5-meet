// MSW용 mock 데이터
import { MeetingDetailResponse } from "@/features/meetingDetail/types/meetingDetail";

// meetingId: 1 — 로그인한 사용자가 "주최자"인 경우
export const mockMeetingResponseAsHost: MeetingDetailResponse = {
  id: 1,
  teamId: "dallaem",
  name: "작은 독서 습관 만들기",
  type: "달램핏",
  region: "건대입구",
  address: "서울시 광진구 자양동 123-45",
  latitude: 37.5407,
  longitude: 127.0693,
  dateTime: "2027-02-10T14:00:00.000Z",
  registrationEnd: "2027-02-09T23:59:59.000Z",
  capacity: 30,
  participantCount: 15,
  image: "/sample.jpg",
  description:
    "작은 독서 습관을 만들기위해서 같이 열심히 해보실 사람을 구합니다~ 궁금한 점 있으시면 https://open.kakao.com/o/abcdefg12345 참여해서 질문주세요~",
  canceledAt: null,
  confirmedAt: null,
  hostId: 1, // currentUserId(1)와 동일 → isOwner: true
  createdBy: 1,
  createdAt: "2026-12-01T00:00:00.000Z",
  updatedAt: "2026-12-01T00:00:00.000Z",
  host: { id: 1, name: "홍길동", image: null },
  isFavorited: false,
  isJoined: false,
  isCompleted: false,
};

// meetingId: 2 — 로그인한 사용자가 "참여자"(예비 참여자 포함)인 경우
export const mockMeetingResponseAsParticipant: MeetingDetailResponse = {
  id: 2,
  teamId: "dallaem",
  name: "퇴근 후 러닝 크루",
  type: "달램핏",
  region: "성수",
  address: "서울시 성동구 성수동 45-6",
  latitude: 37.5446,
  longitude: 127.0559,
  dateTime: "2027-03-05T19:00:00.000Z",
  registrationEnd: "2027-03-04T23:59:59.000Z",
  capacity: 20,
  participantCount: 8,
  image: "/sample2.jpg",
  description:
    "퇴근 후 가볍게 뛰는 러닝 모임입니다. 누구나 환영해요! 페이스 걱정 없이 천천히 함께 달려요~",
  canceledAt: null,
  confirmedAt: null,
  hostId: 999, // currentUserId(1)와 다름 → isOwner: false
  createdBy: 999,
  createdAt: "2026-12-10T00:00:00.000Z",
  updatedAt: "2026-12-10T00:00:00.000Z",
  host: { id: 999, name: "이영희", image: null },
  isFavorited: false,
  isJoined: false, // true로 바꾸면 "참여 취소하기" 버튼 상태도 테스트 가능
  isCompleted: false,
};

// id로 쉽게 찾을 수 있도록 배열/맵도 함께 내보냄
export const mockMeetingResponseList = [
  mockMeetingResponseAsHost,
  mockMeetingResponseAsParticipant,
];
