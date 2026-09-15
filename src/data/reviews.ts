export interface Review {
  id: number;
  rating: number;
  authorName: string;
  createdAt: string;
  content: string;
  groupName: string;
  category: string;
}

export const mockReviews: Review[] = [
  {
    id: 1,
    rating: 5,
    authorName: "렙원즈",
    createdAt: "2024.01.25",
    content:
      "스트레칭 덕분에 오후 피로가 줄었어요. 잠깐의 움직임이 이렇게 큰 차이를 만들 줄 몰랐네요.",
    groupName: "힐링 오피스 스트레칭",
    category: "취미/여가",
  },
  {
    id: 2,
    rating: 5,
    authorName: "렙원즈",
    createdAt: "2024.01.25",
    content:
      "누군가와 약속되어 있다는 게 가장 큰 동기부여가 돼요. 작은 응원 한마디가 계속 이어가게 만듭니다.",
    groupName: "힐링 오피스 스트레칭",
    category: "취미/여가",
  },
  {
    id: 3,
    rating: 4,
    authorName: "김달램",
    createdAt: "2024.01.24",
    content:
      "혼자 했다면 쉽게 포기했을 텐데 함께하니까 꾸준히 할 수 있었어요.",
    groupName: "점심시간 스트레칭",
    category: "운동/건강",
  },
];