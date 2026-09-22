interface HeartRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "text-[20px]",
  md: "text-[25px]",
  lg: "text-[27px]",
};

export function HeartRating({
  rating,
  size = "md",
}: HeartRatingProps) {
  return (
    <div
      role="img"
      aria-label={`5점 만점에 ${rating}점`}
      className={`
        flex
        gap-0.5
        ${sizeStyles[size]}
      `}
    >
      {[1, 2, 3, 4, 5].map((heart) => (
        <span
          key={heart}
          aria-hidden="true"
          className={`
            leading-none
            ${
              heart <= rating
                ? "text-[#08b88a]"
                : "text-[#d0d8d9]"
            }
          `}
        >
          ♥
        </span>
      ))}
    </div>
  );
}