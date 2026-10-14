import Link from "next/link";
import DetailCard from "@/components/ui/DetailCard/DetailCard";

export interface MyMeetingSummary {
  id: number;
  name: string;
  region: string;
  dateLabel: string;
  timeLabel: string;
  category: string;
  participantCount: number;
  capacity: number;
  isCompleted: boolean;
  isConfirmed?: boolean;
  isCanceled?: boolean;
}

type MyMeetingsViewProps =
  | { status: "loading" }
  | { status: "error"; onRetry?: () => void }
  | { status: "success"; meetings: MyMeetingSummary[] };

export default function MyMeetingsView(props: MyMeetingsViewProps) {
  return (
    <section aria-labelledby="my-meetings-title" className="w-full">
      <h1
        id="my-meetings-title"
        className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl"
      >
        나의 모임
      </h1>

      {props.status === "loading" && (
        <div role="status" aria-live="polite" className="grid gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="h-40 animate-pulse rounded-3xl bg-gray-100"
            />
          ))}
          <span className="sr-only">모임 목록을 불러오는 중입니다.</span>
        </div>
      )}

      {props.status === "error" && (
        <div role="alert" className="rounded-3xl bg-white px-6 py-12 text-center">
          <p className="text-base font-semibold text-gray-800">
            모임 목록을 불러오지 못했어요.
          </p>
          <p className="mt-2 text-sm text-gray-500">잠시 후 다시 시도해 주세요.</p>
          {props.onRetry && (
            <button
              type="button"
              onClick={props.onRetry}
              className="mt-5 rounded-xl border border-primary-500 px-5 py-2 text-sm font-semibold text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              다시 시도
            </button>
          )}
        </div>
      )}

      {props.status === "success" && props.meetings.length === 0 && (
        <div className="rounded-3xl bg-white px-6 py-12 text-center">
          <p className="text-base font-semibold text-gray-800">
            아직 참여한 모임이 없어요.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            관심 있는 모임을 찾아 참여해 보세요.
          </p>
          <Link
            href="/meetings"
            className="mt-5 inline-flex rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            모임 찾아보기
          </Link>
        </div>
      )}

      {props.status === "success" && props.meetings.length > 0 && (
        <ul className="grid gap-4">
          {props.meetings.map((meeting) => (
            <li key={meeting.id} className="min-w-0">
              <DetailCard
                id={meeting.id}
                title={meeting.name}
                category={meeting.category}
                location={meeting.region}
                date={meeting.dateLabel}
                time={meeting.timeLabel}
                participantCount={meeting.participantCount}
                capacity={meeting.capacity}
                status={meeting.isCanceled ? "canceled" : meeting.isCompleted ? "completed" : "upcoming"}
                isConfirmed={meeting.isConfirmed}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
