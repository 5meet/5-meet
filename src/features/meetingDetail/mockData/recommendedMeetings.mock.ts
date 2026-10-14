import { RecommendedMeeting } from "@/features/meetingDetail/types/meetingDetail";
import { convertDateType1 } from "@/lib/convertDate/formatMeetingDate";

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

const buildMockRecommendedMeeting = (index: number): RecommendedMeeting => {
  const capacity = 8 + (index % 5) * 2; // 8, 10, 12, 14, 16 반복
  const participantCount = index % capacity; // capacity를 넘지 않도록

  const dateTimeIso = `2027-03-${String((index % 28) + 1).padStart(2, "0")}T18:00:00.000Z`;
  const { date, time } = convertDateType1(dateTimeIso);

  return {
    id: 100 + index,
    title: MEETING_TITLES[index % MEETING_TITLES.length],
    image: MEETING_IMAGES[index % MEETING_IMAGES.length],
    location: MEETING_REGIONS[index % MEETING_REGIONS.length],
    category: "달램핏",
    date,
    time,
    registrationEnd: `2027-03-${String((index % 28) + 1).padStart(2, "0")}T12:00:00.000Z`,
    initialIsFavorited: index % 3 === 0,
    participantCount,
    capacity,
  };
};

/** 추천 모임 8개 (CompactCard 가로 스크롤 테스트용, 4개 초과로 구성) */
export const mockRecommendedMeetings: RecommendedMeeting[] = Array.from(
  { length: 8 },
  (_, i) => buildMockRecommendedMeeting(i),
);

/** 빈 상태(추천 섹션 자체가 숨겨져야 하는 경우) 테스트용 */
export const mockRecommendedMeetingsEmpty: RecommendedMeeting[] = [];
