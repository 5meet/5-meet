// MSW용 mock 데이터
import { MeetingDetailResponse } from "@/features/meetingDetail/types/meetingDetail";

export const mockMeetingResponse: MeetingDetailResponse = {
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
  hostId: 1,
  createdBy: 1,
  createdAt: "2026-12-01T00:00:00.000Z",
  updatedAt: "2026-12-01T00:00:00.000Z",
  host: { id: 1, name: "홍길동", image: null },
  isFavorited: false,
  isJoined: false,
  isCompleted: false,
};
