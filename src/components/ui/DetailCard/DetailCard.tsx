import Link from "next/link";
import Image from "next/image";

export interface DetailCardProps {
  id: number;
  title: string;
  category: string;
  imageUrl?: string | null;
  location: string;
  date: string;
  time: string;
  participantCount: number;
  capacity: number;
  status: "upcoming" | "completed" | "canceled";
  isConfirmed?: boolean;
  actionLabel?: string;
  actionDisabled?: boolean;
  actionPending?: boolean;
  onAction?: () => void;
}

/** Figma: 마이페이지 → 나의 모임/내가 만든 모임 → Detail Card.
 *  Presentation only: network requests and permissions belong to the caller.
 */
export default function DetailCard({
  id,
  title,
  category,
  imageUrl,
  location,
  date,
  time,
  participantCount,
  capacity,
  status,
  isConfirmed = false,
  actionLabel,
  actionDisabled = false,
  actionPending = false,
  onAction,
}: DetailCardProps) {
  const statusText =
    status === "canceled" ? "취소된 모임" : status === "completed" ? "이용 완료" : "이용 예정";

  return (
    <article className="flex min-h-[390px] min-w-0 flex-col gap-4 rounded-[24px] border border-gray-200 bg-white p-4 sm:min-h-[236px] sm:flex-row sm:gap-6 sm:p-6">
      <div className="relative h-[160px] w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-[188px] sm:w-[188px]">
        {imageUrl && (
          <Image src={imageUrl} alt="" fill sizes="(max-width: 639px) 100vw, 188px" className="object-cover" unoptimized />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {statusText}
          </span>
          {isConfirmed && status !== "canceled" && (
            <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
              개설확정
            </span>
          )}
        </div>
        <p className="mt-4 text-sm text-gray-500">{category}</p>
        <h2 className="mt-1 break-keep text-xl font-bold leading-7 text-gray-900">
          <Link
            href={`/meetings/${encodeURIComponent(String(id))}`}
            className="hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            {title}
          </Link>
        </h2>
        <p className="mt-2 text-sm font-medium text-gray-600">
          참여 인원 {participantCount}/{capacity}
        </p>
        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm text-gray-700 sm:grid-cols-[auto_1fr_auto_1fr]">
          <dt className="font-medium text-gray-500">위치</dt>
          <dd className="min-w-0 break-words">{location}</dd>
          <dt className="font-medium text-gray-500">날짜</dt>
          <dd>{date}</dd>
          <dt className="font-medium text-gray-500">시간</dt>
          <dd>{time || "미정"}</dd>
        </dl>
      </div>
      {actionLabel && onAction && (
        <div className="flex shrink-0 items-end sm:justify-end">
          <button
            type="button"
            onClick={onAction}
            disabled={actionDisabled || actionPending}
            className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-base font-semibold text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {actionPending ? "처리 중..." : actionLabel}
          </button>
        </div>
      )}
    </article>
  );
}
