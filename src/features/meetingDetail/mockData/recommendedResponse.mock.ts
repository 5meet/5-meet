// MSW용 mock 데이터
import { MeetingDetailResponse } from "@/features/meetingDetail/types/meetingDetail";

const MEETING_TITLES = [
  "퇴근 후 달리기 모임",
  "주말 등산 클럽",
  "홈트 같이해요",
  "요가로 하루 마무리",
  "필라테스 초보 환영",
  "자전거 라이딩 크루",
  "클라이밍 입문반",
  "배드민턴 정기모임",
];
const MEETING_REGIONS = ["건대입구", "성수", "홍대입구", "강남", "잠실"];
const MEETING_IMAGES = ["/sample.jpg", "/sample2.jpg", "/sample3.jpg"];

const buildRecommendedResponse = (index: number): MeetingDetailResponse => {
  const capacity = 8 + (index % 5) * 2;
  const participantCount = index % capacity;
  const day = String((index % 28) + 1).padStart(2, "0");

  return {
    id: 100 + index,
    teamId: "dallaem",
    name: MEETING_TITLES[index % MEETING_TITLES.length],
    type: "달램핏",
    region: MEETING_REGIONS[index % MEETING_REGIONS.length],
    address: "서울시 어딘가 123-45",
    latitude: 37.5407,
    longitude: 127.0693,
    dateTime: `2027-03-${day}T18:00:00.000Z`,
    registrationEnd: `2027-03-${day}T12:00:00.000Z`,
    capacity,
    participantCount,
    image: MEETING_IMAGES[index % MEETING_IMAGES.length],
    description: "",
    canceledAt: null,
    confirmedAt: null,
    hostId: 200 + index,
    createdBy: 200 + index,
    createdAt: "2026-12-01T00:00:00.000Z",
    updatedAt: "2026-12-01T00:00:00.000Z",
    host: { id: 200 + index, name: "주최자", image: null },
    isFavorited: index % 3 === 0,
    isJoined: false,
    isCompleted: false,
  };
};

export const mockRecommendedResponseAll: MeetingDetailResponse[] = Array.from(
  { length: 8 },
  (_, i) => buildRecommendedResponse(i),
);
