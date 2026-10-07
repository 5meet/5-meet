// MSW용 mock 데이터
import { ParticipantResponse } from "@/features/meetingDetail/types/meetingDetail";

const PARTICIPANT_NAMES = [
  "홍길동",
  "김철수",
  "이영희",
  "박민수",
  "정하나",
  "최지우",
  "강태양",
  "윤서아",
  "임도윤",
  "한소율",
  "오준서",
  "배수빈",
];

const PROFILE_IMAGES = [
  "/profile/profile_female1.svg",
  "/profile/profile_female2.svg",
  "/profile/profile_male.svg",
  null,
];

const buildParticipantResponse = (index: number): ParticipantResponse => ({
  id: 1000 + index, // 참가 레코드 id (유저 id와 구분)
  teamId: "dallaem",
  meetingId: 1,
  userId: index + 1,
  joinedAt: "2026-12-05T10:00:00.000Z",
  user: {
    id: index + 1,
    name: PARTICIPANT_NAMES[index % PARTICIPANT_NAMES.length],
    image: PROFILE_IMAGES[index % PROFILE_IMAGES.length],
  },
});

export const mockParticipantsResponse: ParticipantResponse[] = Array.from(
  { length: 15 },
  (_, i) => buildParticipantResponse(i),
);
