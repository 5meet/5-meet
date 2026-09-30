import type { Review } from "@/data/reviews";

interface ReviewSummaryProps {
  reviews: Review[];
}

export function ReviewSummary({
  reviews,
}: ReviewSummaryProps) {
  const average =
  reviews.length > 0
    ? reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      ) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (rating) => ({
      rating,
      count: reviews.filter(
        (review) => review.rating === rating
      ).length,
    })
  );

  const maxCount = Math.max(
    ...ratingCounts.map(
      (item) => item.count
    ),
    1
  );

  return (
    <section
      className="
        mb-5
        flex min-h-[185px]
        items-center
        rounded-[23px]
        border border-[#b8efdc]
        bg-gradient-to-r
        from-[#def9ed]
        to-[#d8f8f0]
        px-20 py-6
      "
    >

      <div
        className="
          flex w-1/2
          flex-col
          items-center
          border-r
          border-[#5bbfa633]
          pr-[60px]
        "
      >
        <strong className="text-[34px] font-bold leading-none">
          {average.toFixed(1)}
        </strong>

        <div className="my-3 flex gap-1">
          {[1, 2, 3, 4, 5].map(
            (heart) => (
              <span
                key={heart}
                className={`
                  text-[27px] leading-none

                  ${
                    heart <= Math.round(average)
                      ? "text-[#08b88a]"
                      : "text-[#d0d9da]"
                  }
                `}
              >
                ♥
              </span>
            )
          )}
        </div>

        <p className="m-0 text-xs text-[#9fa9a7]">
          (총 {reviews.length}명 참여)
        </p>
      </div>

      <div className="flex-1 pl-9">

        {ratingCounts.map(
          ({ rating, count }) => (
            <div
              key={rating}
              className="
                my-2
                grid
                grid-cols-[30px_1fr_22px]
                items-center
                gap-2
                text-[11px]
                text-[#8b9692]
              "
            >
              <span>{rating}점</span>

              <div
                className="
                  h-[7px]
                  overflow-hidden
                  rounded-full
                  bg-[#d4e6e2]
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#55d6ca]
                  "
                  style={{
                    width: `${
                      (count / maxCount) * 100
                    }%`,
                  }}
                />
              </div>

              <span className="text-[#737d79]">
                {count}
              </span>
            </div>
          )
        )}

      </div>
    </section>
  );
}