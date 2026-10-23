import { MeetingCardSkeleton } from "./MeetingCardSkeleton";

export function MeetingCardListSkeleton({ className = "px-8 md:px-6" }: { className?: string } = {}) {
  return (
    <div className={`mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {Array.from({ length: 4 }).map((_, index) => (
        <MeetingCardSkeleton key={index} />
      ))}
    </div>
  );
}
