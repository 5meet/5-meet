import { MeetingCardSkeleton } from "./MeetingCardSkeleton";

export function MeetingCardListSkeleton() {
  return (
    <div className="mx-auto grid grid-cols-1 gap-8 px-8 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <MeetingCardSkeleton key={index} />
      ))}
    </div>
  );
}