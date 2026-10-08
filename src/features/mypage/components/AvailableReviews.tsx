import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import ReviewMeetingCard from "@/features/mypage/components/ReviewMeetingCard";

const reviewMeetings = [
  {
    id: 1,
    imageUrl: "/images/meeting-1.jpg",
    title: "힐링 오피스 스트레칭",
    location: "강남구",
    date: "11월 17일",
    time: "17:30",
    participantCount: 20,
    capacity: 20,
    isFavorite: true,
  },
  {
    id: 2,
    imageUrl: "/images/meeting-2.jpg",
    title: "작은 독서 습관 만들기",
    location: "중구",
    date: "11월 17일",
    time: "17:30",
    participantCount: 20,
    capacity: 20,
    isFavorite: false,
  },
];

export default function AvailableReviews() {
  if (reviewMeetings.length === 0) {
    return (
      <EmptyState message="작성 가능한 리뷰가 없어요." />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {reviewMeetings.map((meeting) => (
        <ReviewMeetingCard
          key={meeting.id}
          {...meeting}
        />
      ))}
    </div>
  );
}