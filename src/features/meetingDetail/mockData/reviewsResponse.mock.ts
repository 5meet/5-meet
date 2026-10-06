// MSW용 mock 데이터
import { ReviewResponse } from "@/features/meetingDetail/types/meetingDetail";

const REVIEW_NAMES = [
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
  "장예은",
];

const REVIEW_COMMENTS = [
  "처음엔 혼자 꾸준히 읽기 어려웠는데, 함께 해서 끝까지 완독할 수 있었어요!",
  "모임장님이 친절하게 리드해주셔서 부담 없이 참여했습니다.",
  "독서 습관을 들이는 데 정말 큰 도움이 됐어요. 다음 모임도 신청할게요.",
  "장소도 좋고 분위기도 편안해서 좋았습니다.",
  "시간 관리가 아쉬웠지만 전체적으로 만족스러운 모임이었어요.",
  "비슷한 관심사를 가진 사람들과 이야기 나눌 수 있어서 즐거웠습니다.",
  "생각보다 인원이 많아서 조금 산만했지만 내용은 알찼어요.",
  "운영이 체계적이어서 믿고 참여할 수 있었습니다.",
  "다음에도 꼭 참여하고 싶은 모임이에요!",
  "같은 책을 읽는 사람들과 토론하는 시간이 가장 좋았어요.",
  "처음 참여했는데 생각보다 훨씬 알차고 좋았습니다.",
  "장소 접근성이 좋아서 참여 부담이 적었어요.",
  "리더분이 질문을 잘 던져주셔서 생각을 정리하는 데 도움이 됐습니다.",
  "아쉬운 점도 있었지만 전반적으로 긍정적인 경험이었어요.",
  "다양한 연령대가 함께해서 더 풍성한 이야기를 나눌 수 있었습니다.",
];

const PROFILE_IMAGES = [
  "/profile/profile_female1.svg",
  "/profile/profile_female2.svg",
  "/profile/profile_male.svg",
  null,
];

const buildReviewResponse = (index: number): ReviewResponse => {
  const day = (index % 28) + 1;
  const month = index < 28 ? "01" : "02";

  return {
    id: index + 1,
    teamId: "dallaem",
    meetingId: 1,
    userId: 100 + index,
    score: (index % 5) + 1,
    comment: REVIEW_COMMENTS[index % REVIEW_COMMENTS.length],
    createdAt: `2026-${month}-${String(day).padStart(2, "0")}T12:00:00.000Z`,
    updatedAt: `2026-${month}-${String(day).padStart(2, "0")}T12:00:00.000Z`,
    user: {
      id: 100 + index,
      email: `user${index}@example.com`,
      name: REVIEW_NAMES[index % REVIEW_NAMES.length],
      image: PROFILE_IMAGES[index % PROFILE_IMAGES.length],
    },
    meeting: {
      id: 1,
      name: "작은 독서 습관 만들기",
      type: "달램핏",
      region: "건대입구",
      image: "/sample.jpg",
      dateTime: "2027-02-10T14:00:00.000Z",
    },
  };
};

export const mockReviewsResponseAll: ReviewResponse[] = Array.from(
  { length: 40 },
  (_, i) => buildReviewResponse(i),
);
