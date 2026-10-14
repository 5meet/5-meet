import { Review } from "@/features/meetingDetail/types/meetingDetail";

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

/**
 * index를 시드로 사용해 준-결정적(pseudo-deterministic)으로 더미 리뷰를 생성합니다.
 * 매 렌더마다 랜덤 값이 바뀌면 리스트가 깜빡이므로 Math.random 대신 index 기반 연산을 사용합니다.
 */
const buildMockReview = (index: number): Review => {
  const id = index + 1;
  const score = (index % 5) + 1; // 1~5 반복
  const name = REVIEW_NAMES[index % REVIEW_NAMES.length];
  const comment = REVIEW_COMMENTS[index % REVIEW_COMMENTS.length];
  const image = PROFILE_IMAGES[index % PROFILE_IMAGES.length];

  // 2026.01.01 ~ 2026.02.01 사이로 하루씩 밀리는 생성일 (단순 표시용 문자열)
  const day = (index % 28) + 1;
  const month = index < 28 ? "01" : "02";

  return {
    id,
    user: {
      id: 100 + index,
      name,
      image,
    },
    score,
    comment,
    createdAt: `2026.${month}.${String(day).padStart(2, "0")}`,
  };
};

/** 리뷰 40개를 미리 생성해둔 전체 목록 (페이지네이션 테스트용) */
export const mockReviewsAll: Review[] = Array.from({ length: 40 }, (_, i) =>
  buildMockReview(i),
);

/** 빈 상태(EmptyReview) 테스트용 */
export const mockReviewsEmpty: Review[] = [];

/**
 * useReviewsPagination 흉내용 헬퍼.
 * cursor를 "다음에 가져올 시작 index" 문자열로 사용하는 간단한 페이지네이션 mock입니다.
 */
export const getMockReviewsPage = (
  cursor: string | null | undefined,
  size = 5,
) => {
  const start = cursor ? Number(cursor) : 0;
  const end = start + size;
  const data = mockReviewsAll.slice(start, end);
  const hasMore = end < mockReviewsAll.length;

  return {
    data,
    nextCursor: hasMore ? String(end) : null,
    hasMore,
  };
};
