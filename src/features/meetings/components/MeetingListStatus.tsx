import { Spinner } from "@/components/ui/Spinner/Spinner";
import { EmptyState } from "./EmptyState";

type MeetingListStatusProps = {
  loading: boolean;
  errorMessage: string | null;
};

export function MeetingListStatus({
  loading,
  errorMessage,
}: MeetingListStatusProps) {
  if (loading) {
    return (
      <div
        className="flex min-h-[220px] items-center justify-center rounded-3xl bg-white ring-1 ring-gray-100"
        role="status"
        aria-live="polite"
        aria-label="모임 목록을 불러오는 중"
      >
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="모임을 불러오지 못했습니다"
        description={errorMessage}
      />
    );
  }

  return null;
}
