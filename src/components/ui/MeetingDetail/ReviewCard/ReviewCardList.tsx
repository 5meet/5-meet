import ReviewCard, { Review } from "./ReviewCard";
import EmptyReview from "./EmptyReview";

interface ReviewCardListProps {
  reviews: Review[];
}

const ReviewCardList = ({ reviews }: ReviewCardListProps) => {
  if (reviews.length === 0) {
    return (
      <section className="flex w-[343px] items-center justify-center px-5 pt-4 pb-2 rounded-4xl shadow-md lg:px-12 lg:py-6 md:w-174 lg:w-7xl">
        <EmptyReview />
      </section>
    );
  }

  return (
    <section className="flex flex-col w-[343px] px-5 pt-4 pb-2 rounded-4xl shadow-md lg:px-12 lg:py-6 md:w-174 lg:w-7xl">
      {reviews.map((review, index) => (
        <ReviewCard
          key={`${review.user.id}-${review.datetime}`}
          {...review}
          isLast={index === reviews.length - 1}
        />
      ))}
    </section>
  );
};

export default ReviewCardList;
