import ReviewCard, { Review } from "./ReviewCard";
import EmptyReview from "./EmptyReview";

interface ReviewCardListProps {
  reviews: Review[];
}

const ReviewCardList = ({ reviews }: ReviewCardListProps) => {
  if (reviews.length === 0) {
    return (
      <section className="flex w-full items-center justify-center px-6 py-12">
        <EmptyReview />
      </section>
    );
  }

  const displayedReviews = reviews.slice(0, 4);

  return (
    <section className="flex w-full px-6 py-12">
      {displayedReviews.map((review, index) => (
        <ReviewCard
          key={`${review.user.id}-${review.datetime}`}
          {...review}
          isLast={index === displayedReviews.length - 1}
        />
      ))}
    </section>
  );
};

export default ReviewCardList;
