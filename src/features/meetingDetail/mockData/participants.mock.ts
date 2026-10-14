// features/meetingDetail/mockData/participants.mock.ts
import { ParticipantProfile } from "@/features/meetingDetail/types/meetingDetail";

const PARTICIPANT_NAMES = [
  "홍길동", // index 0 = 모임 주최자 (hostId: 1, meeting.mock.ts와 id 일치)
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

const buildMockParticipant = (index: number): ParticipantProfile => ({
  id: index + 1, // 1번 참가자 = 주최자(hostId: 1)와 id 일치시켜 "주최자가 항상 포함된다"는 전제를 반영
  name: PARTICIPANT_NAMES[index % PARTICIPANT_NAMES.length],
  image: PROFILE_IMAGES[index % PROFILE_IMAGES.length],
});

/**
 * 참가자 15명 (mockMeeting의 participantCount: 15와 맞춘 기본 세트).
 * ParticipantProfiles가 MAX_VISIBLE_PROFILES(4)를 넘는 "+N" 뱃지까지 보이도록
 * capacity 안에서 조금 더 여유 있는 buildMockParticipants도 함께 제공합니다.
 */
export const mockParticipants: ParticipantProfile[] = Array.from(
  { length: 15 },
  (_, i) => buildMockParticipant(i),
);

/** 1명만 참여 중(주최자만) — hover 카드나 +N 뱃지가 안 보이는 최소 케이스 테스트용 */
export const mockParticipantsSingle: ParticipantProfile[] = [
  buildMockParticipant(0),
];

/** 정원(mockMeeting.capacity: 30)에 가득 찬 케이스 — "개설 확정" 뱃지, +N 뱃지 동시 테스트용 */
export const mockParticipantsFull: ParticipantProfile[] = Array.from(
  { length: 30 },
  (_, i) => buildMockParticipant(i),
);
