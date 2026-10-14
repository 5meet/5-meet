import styles from "./MyMeetingsView.module.css";
import DetailCard from "@/components/ui/DetailCard/DetailCard";
import Image from "next/image";

export interface MyMeetingSummary {
  id: number;
  name: string;
  region: string;
  dateLabel: string;
  timeLabel: string;
  category: string;
  imageUrl?: string | null;
  participantCount: number;
  capacity: number;
  isCompleted: boolean;
  isConfirmed?: boolean;
  isCanceled?: boolean;
  canCancel?: boolean;
  isFavorited?: boolean;
  canReview?: boolean;
}

type MyMeetingsViewProps =
  | { status: "loading" }
  | { status: "error"; onRetry?: () => void }
  | {
      status: "success";
      meetings: MyMeetingSummary[];
      onCancel?: (meeting: MyMeetingSummary) => void;
      cancelPendingId?: number | null;
      onFavorite?: (meeting: MyMeetingSummary) => void;
      favoritePendingId?: number | null;
    };

export default function MyMeetingsView(props: MyMeetingsViewProps) {
  return (
    <section aria-labelledby="my-meetings-title" className={styles.root}>
      <h1 id="my-meetings-title" className="sr-only">
        나의 모임
      </h1>

      {props.status === "loading" && (
        <div role="status" aria-live="polite" className={styles.list}>
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className={`${styles.skeleton} animate-pulse bg-gray-100`}
            />
          ))}
          <span className="sr-only">모임 목록을 불러오는 중입니다.</span>
        </div>
      )}

      {props.status === "error" && (
        <div
          role="alert"
          className="rounded-3xl bg-white px-6 py-12 text-center"
        >
          <p className="text-base font-semibold text-gray-800">
            모임 목록을 불러오지 못했어요.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            잠시 후 다시 시도해 주세요.
          </p>
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
        <div className={styles.empty}>
          <Image src="/review_empty.svg" width={121} height={72} alt="" />
          <p>아직 신청한 모임이 없어요</p>
        </div>
      )}

      {props.status === "success" && props.meetings.length > 0 && (
        <ul className={styles.list}>
          {props.meetings.map((meeting) => (
            <li key={meeting.id} className="min-w-0">
              <DetailCard
                id={meeting.id}
                title={meeting.name}
                category={meeting.category}
                imageUrl={meeting.imageUrl}
                location={meeting.region}
                date={meeting.dateLabel}
                time={meeting.timeLabel}
                participantCount={meeting.participantCount}
                capacity={meeting.capacity}
                status={
                  meeting.isCanceled
                    ? "canceled"
                    : meeting.isCompleted
                      ? "completed"
                      : "upcoming"
                }
                isConfirmed={meeting.isConfirmed}
                actionLabel={
                  meeting.canCancel
                    ? "예약 취소하기"
                    : meeting.canReview
                      ? "리뷰 작성하기"
                      : undefined
                }
                actionHref={meeting.canReview ? "/mypage/reviews" : undefined}
                isFavorited={meeting.isFavorited}
                favoritePending={
                  props.favoritePendingId != null ||
                  props.cancelPendingId != null
                }
                onFavorite={
                  props.onFavorite
                    ? () => props.onFavorite?.(meeting)
                    : undefined
                }
                actionPending={props.cancelPendingId === meeting.id}
                actionDisabled={
                  props.cancelPendingId != null ||
                  props.favoritePendingId != null
                }
                onAction={
                  meeting.canCancel && props.onCancel
                    ? () => props.onCancel?.(meeting)
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
