import Button from "@/components/ui/Button/Button";

interface MeetingListContinuationProps {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export default function MeetingListContinuation({
  isLoading,
  isError,
  onRetry,
}: MeetingListContinuationProps) {
  return (
    <div className="mt-6 flex min-h-10 flex-col items-center gap-3">
      {isLoading && <p role="status" className="text-sm text-gray-600">모임을 더 불러오는 중이에요.</p>}
      {isError && (
        <>
          <p role="alert" className="text-sm text-red-600">추가 목록을 불러오지 못했습니다.</p>
          <Button type="button" variant="secondary" className="w-auto" onClick={onRetry}>
            추가 목록 다시 시도
          </Button>
        </>
      )}
    </div>
  );
}
