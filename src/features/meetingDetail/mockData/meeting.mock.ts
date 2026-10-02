import { MeetingDetail } from "@/features/meetingDetail/types/meetingDetail";

export const mockMeeting: MeetingDetail = {
  id: 1,
  title: "작은 독서 습관 만들기",
  location: "건대입구",
  category: "달램핏",
  date: "2월 15일",
  time: "17:30",
  registrationEnd: "2027-02-09T23:59:59.000Z",
  capacity: 30,
  participantCount: 15,
  image: "/sample.jpg",
  description:
    "작은 독서 습관을 만들기위해서 같이 열심히 해보실 사람을 구합니다~ 궁금한 점 있으시면 https://open.kakao.com/o/abcdefg12345 참여해서 질문주세요~ 작은 독서 습관을 만들기위해서 같이 열심히 해보실 사람을 구합니다~ 궁금한 점 있으시면 https://open.kakao.com/o/abcdefg12345 참여해서 질문주세요~ 작은 독서 습관을 만들기위해서 같이 열심히 해보실 사람을 구합니다~ 궁금한 점 있으시면 https://open.kakao.com/o/abcdefg12345 참여해서 질문주세요~ 작은 독서 습관을 만들기위해서 같이 열심히 해보실 사람을 구합니다~ 궁금한 점 있으시면 https://open.kakao.com/o/abcdefg12345 참여해서 질문주세요~",
  address: "서울시 광진구 자양동 123-45",
  latitude: 37.5407,
  longitude: 127.0693,
  createdAt: "2026-02-01T10:00:00.000Z",
  hostId: 1,
  host: { id: 1, name: "홍길동", image: null },
  initialIsFavorited: false,
  initialIsParticipating: false,
  isCompleted: false,
  canceledAt: null,
  confirmedAt: null,
  dateTime: "2027-02-10T14:00:00.000Z",
};
