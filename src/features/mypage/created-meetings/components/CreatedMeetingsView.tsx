import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import DetailCard from "@/components/ui/DetailCard/DetailCard";
import type { CreatedMeeting } from "../types";
import styles from "./CreatedMeetingsView.module.css";

type Props =
  | { status: "loading" }
  | { status: "error"; message?: string; onRetry: () => void }
  | { status: "success"; meetings: CreatedMeeting[]; onFavorite?: (meeting: CreatedMeeting) => void; favoritePending?: boolean };

const dateFormatter = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric" });
const timeFormatter = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hour12: false });

export default function CreatedMeetingsView(props: Props) {
  return (
    <section aria-labelledby="created-meetings-title" className={styles.root}>
      <h1 id="created-meetings-title" className="sr-only">내가 만든 모임</h1>
      {props.status === "loading" && (
        <div role="status" className={styles.list}>
          {Array.from({ length: 3 }, (_, index) => <div key={index} aria-hidden="true" className={`${styles.skeleton} animate-pulse bg-gray-100`} />)}
          <span className="sr-only">내가 만든 모임을 불러오는 중입니다.</span>
        </div>
      )}
      {props.status === "error" && (
        <div role="alert" className="rounded-3xl bg-white px-6 py-12 text-center">
          <p className="font-semibold text-gray-800">{props.message ?? "내가 만든 모임을 불러오지 못했어요."}</p>
          <p className="mt-2 text-sm text-gray-500">잠시 후 다시 시도해 주세요.</p>
          <Button variant="secondary" className="mt-5 w-auto" onClick={props.onRetry}>다시 시도</Button>
        </div>
      )}
      {props.status === "success" && props.meetings.length === 0 && (
        <div className={styles.empty}>
          <Image src="/review_empty.svg" width={121} height={72} alt="" />
          <p>아직 만든 모임이 없어요</p>
        </div>
      )}
      {props.status === "success" && props.meetings.length > 0 && (
        <ul className={styles.list}>
          {props.meetings.map((meeting) => {
            const date = meeting.dateTime ? new Date(meeting.dateTime) : null;
            const validDate = date && !Number.isNaN(date.getTime());
            return (
              <li key={meeting.id} className="min-w-0">
                <DetailCard id={meeting.id} title={meeting.name} category={meeting.type}
                  imageUrl={meeting.image} location={meeting.region}
                  date={validDate ? dateFormatter.format(date) : "일정 미정"}
                  time={validDate ? timeFormatter.format(date) : ""}
                  participantCount={meeting.participantCount} capacity={meeting.capacity}
                  status={meeting.canceledAt ? "canceled" : meeting.isCompleted ? "completed" : "upcoming"}
                  isConfirmed={Boolean(meeting.confirmedAt)} isFavorited={meeting.isFavorited}
                  favoritePending={props.favoritePending}
                  onFavorite={props.onFavorite ? () => props.onFavorite?.(meeting) : undefined} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
