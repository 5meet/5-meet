export interface FavoriteGroup {
  id: number;
  title: string;
  location: string;
  category: string;
  date: string;
  time: string;
  deadline: string;
  currentMembers: number;
  maxMembers: number;
  isConfirmed: boolean;
  isClosed: boolean;
  imageUrl: string;
}

export const favorites = [
  {
    id: 1,
    imageUrl: "/meetings-hero.jpg",
    title: "힐링 오피스 스트레칭1",
    location: "강남구",
    category: "운동/건강",
    dateTime: "2026-10-07T17:30:00",
    registrationEnd: "2026-10-07T21:00:00",
    participantCount: 4,
    capacity: 20,
    isFavorite: true,
    isConfirmed: true,
  },
  {
    id: 2,
    imageUrl: "/meetings-hero.jpg",
    title: "힐링 오피스 스트레칭2",
    location: "강남구",
    category: "운동/건강",
    dateTime: "2026-10-07T17:30:00",
    registrationEnd: "2026-10-07T21:00:00",
    participantCount: 4,
    capacity: 20,
    isFavorite: true,
    isConfirmed: true,
  },
  {
    id: 3,
    imageUrl: "/meetings-hero.jpg",
    title: "힐링 오피스 스트레칭3",
    location: "강남구",
    category: "운동/건강",
    dateTime: "2026-10-07T17:30:00",
    registrationEnd: "2026-10-07T21:00:00",
    participantCount: 4,
    capacity: 20,
    isFavorite: true,
    isConfirmed: true,
  },
  {
    id: 4,
    imageUrl: "/meetings-hero.jpg",
    title: "힐링 오피스 스트레칭4",
    location: "강남구",
    category: "운동/건강",
    dateTime: "2026-10-07T17:30:00",
    registrationEnd: "2026-10-07T21:00:00",
    participantCount: 4,
    capacity: 20,
    isFavorite: true,
    isConfirmed: true,
  },
  {
    id: 5,
    imageUrl: "/meetings-hero.jpg",
    title: "힐링 오피스 스트레칭5",
    location: "강남구",
    category: "운동/건강",
    dateTime: "2026-10-07T17:30:00",
    registrationEnd: "2026-10-07T21:00:00",
    participantCount: 4,
    capacity: 20,
    isFavorite: true,
    isConfirmed: true,
  },
];

export const mockFavoriteGroups: FavoriteGroup[] = [
  // 실제 프로젝트에서 사용 중인 이미지 경로를 여기에 넣어주세요.
  // imageUrl은 기존 모임 데이터의 값을 그대로 사용하면 됩니다.
];