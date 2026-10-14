import Link from "next/link";
import Image from "next/image";
import styles from "./DetailCard.module.css";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";

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
  actionHref?: string;
  isFavorited?: boolean;
  favoritePending?: boolean;
  onFavorite?: () => void;
}

/** Presentation only: network requests and permissions belong to the caller. */
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
  actionHref,
  isFavorited = false,
  favoritePending = false,
  onFavorite,
}: DetailCardProps) {
  const statusText =
    status === "canceled"
      ? "취소된 모임"
      : status === "completed"
        ? "이용 완료"
        : "이용 예정";
  return (
    <div className={styles.frame}>
      <article className={styles.card} aria-label={`${category} 모임`}>
        {onFavorite && (
          <fieldset
            className={styles.favorite}
            disabled={favoritePending}
            aria-busy={favoritePending}
          >
            <LikeButton size="lg" isLiked={isFavorited} onToggle={onFavorite} />
          </fieldset>
        )}
        <div className={styles.image}>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 639px) 100vw, 188px"
              className={styles.photo}
              unoptimized
            />
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.heading}>
            <div className={styles.badges}>
              <span
                className={`${styles.badge} ${status === "upcoming" ? styles.upcoming : styles.inactive}`}
              >
                {statusText}
              </span>
              {status === "upcoming" && (
                <span
                  className={`${styles.badge} ${isConfirmed ? styles.confirmed : styles.waiting}`}
                >
                  {isConfirmed && (
                    <Image src="/ic_check.svg" width={24} height={24} alt="" />
                  )}
                  {isConfirmed ? "개설확정" : "개설대기"}
                </span>
              )}
            </div>
            <h2 className={styles.title}>
              <Link href={`/meetings/${encodeURIComponent(String(id))}`}>
                {title}
              </Link>
            </h2>
          </div>
          <div className={styles.bottom}>
            <div className={styles.details}>
              <p className={styles.participants}>
                <Image src="/person.svg" width={16} height={16} alt="" />
                <span>
                  <span className="sr-only">참여 인원 </span>
                  {participantCount}/{capacity}
                </span>
              </p>
              <dl className={styles.metadata}>
                <div>
                  <dt>위치</dt>
                  <dd>{location}</dd>
                </div>
                <div>
                  <dt>날짜</dt>
                  <dd>{date}</dd>
                </div>
                <div>
                  <dt>시간</dt>
                  <dd>{time || "미정"}</dd>
                </div>
              </dl>
            </div>
            {actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                disabled={actionDisabled || actionPending}
                aria-busy={actionPending}
                className={styles.action}
              >
                {actionPending ? "처리 중..." : actionLabel}
              </button>
            )}
            {actionLabel && actionHref && !onAction && (
              <Link
                href={actionHref}
                className={`${styles.action} ${styles.reviewAction}`}
              >
                {actionLabel}
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
