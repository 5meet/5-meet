// export const CATEGORY_CHIPS = [
//   { id: "all", label: "전체" },
//   { id: "hobby", label: "취미/여가" },
//   { id: "study", label: "스터디" },
//   { id: "business", label: "비즈니스" },
//   { id: "health", label: "운동/건강" },
//   { id: "family", label: "가족/육아" },
//   { id: "etc", label: "기타" },
// ] as const;

export const CATEGORY_CHIPS = [
  "전체",
  "취미/여가",
  "스터디",
  "운동/건강",
  "비즈니스",
  "라이프스타일",
  "가족/육아",
] as const;

export const REGION_OPTIONS = [
  { label: "지역 전체", value: "all" },
  { label: "서울", value: "서울" },
  { label: "경기", value: "경기" },
  { label: "인천", value: "인천" },
  { label: "부산", value: "부산" },
  { label: "대구", value: "대구" },
  { label: "광주", value: "광주" },
  { label: "대전", value: "대전" },
  { label: "울산", value: "울산" },
  { label: "세종", value: "세종" },
  { label: "강원", value: "강원" },
  { label: "충북", value: "충북" },
  { label: "충남", value: "충남" },
  { label: "전북", value: "전북" },
  { label: "전남", value: "전남" },
  { label: "경북", value: "경북" },
  { label: "경남", value: "경남" },
  { label: "제주", value: "제주" },
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
