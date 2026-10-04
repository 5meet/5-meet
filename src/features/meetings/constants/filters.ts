export const CATEGORY_CHIPS = [
  { id: "all", label: "전체" },
  { id: "hobby", label: "취미/여가" },
  { id: "study", label: "스터디" },
  { id: "business", label: "비즈니스" },
  { id: "health", label: "운동/건강" },
  { id: "family", label: "가족/육아" },
  { id: "etc", label: "기타" },
] as const;

export const CONFIRMED_SORT_OPTIONS = [
  { id: "closing", label: "마감임박", sortBy: "registrationEnd" },
  { id: "participants", label: "참여인원", sortBy: "participantCount" },
] as const;

export const MOCKUP_SORT_OPTIONS = [
  { id: "date", label: "날짜순", sortBy: "dateTime" },
  {
    id: "nearby",
    label: "가까운순",
    sortBy: "distance",
    todo: "TODO: GPS 또는 가까운순 API 파라미터 확인",
  },
] as const;

export const HERO_SLIDES = [
  {
    id: "1",
    title: "좋은 사람들과\n특별한 순간을 만들어보세요",
    subtitle: "취미부터 자기계발까지,\n지금 우리, 함께해요!",
  },
  {
    id: "2",
    title: "새로운 관심사를\n함께 시작해보세요",
    subtitle: "나와 같은 관심사를 가진 사람들을 만나보세요.",
  },
  {
    id: "3",
    title: "함께하면\n더 즐거운 순간",
    subtitle: "다양한 모임을 찾아보고 참여해보세요.",
  },
] as const;
