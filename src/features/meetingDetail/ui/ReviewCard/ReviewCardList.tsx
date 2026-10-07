import ReviewCard from "./ReviewCard";
import EmptyReview from "./EmptyReview";
import { ReviewCardListProps } from "@/features/meetingDetail/types/meetingDetail";

const ReviewCardList = ({ reviews }: ReviewCardListProps) => {
  if (reviews.length === 0) {
    return (
      <section className="flex w-full items-center justify-center px-5 pt-4 pb-2 rounded-4xl shadow-sm md:px-12 md:py-6">
        <EmptyReview />
      </section>
    );
  }

  return (
    <section className="flex flex-col w-full px-5 pt-4 pb-2 rounded-4xl shadow-sm md:px-12 md:py-6">
      {reviews.map((review, index) => (
        <ReviewCard
          key={review.id}
          {...review}
          isLast={index === reviews.length - 1}
        />
      ))}
    </section>
  );
};

export default ReviewCardList;
