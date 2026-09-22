interface HeartRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "text-[20px]",
  md: "text-[25px]",
  lg: "text-[40px]",
};

export function HeartRating({
  rating,
  size = "md",
}: HeartRatingProps) {
  return (
    <div
      className={`
        flex
        gap-0.5
        ${sizeStyles[size]}
      `}
      aria-label={`5점 만점에 ${rating}점`}
    >
      {[1, 2, 3, 4, 5].map((heart) => (
        <span
          key={heart}
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