import ReviewCard from "./ReviewCard";
import EmptyReview from "./EmptyReview";
import { ReviewCardListProps } from "@/features/meetingDetail/types/meetingDetail";

const ReviewCardList = ({ reviews }: ReviewCardListProps) => {
  if (reviews.length === 0) {
    return (
      <section className="flex w-[343px] items-center justify-center px-5 pt-4 pb-2 rounded-4xl shadow-md md:px-12 md:py-6 md:w-174 lg:px-12 lg:py-6 lg:w-7xl">
        <EmptyReview />
      </section>
    );
  }

  return (
    <section className="flex flex-col w-[343px] px-5 pt-4 pb-2 rounded-3xl shadow-md md:rounded-4xl md:px-12 md:py-6 md:w-174 lg:px-12 lg:py-6 lg:w-7xl">
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
