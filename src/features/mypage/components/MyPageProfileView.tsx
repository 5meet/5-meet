import Link from "next/link";
import Button from "@/components/ui/Button/Button";
import type { User } from "@/features/auth/type";
import ProfileCard from "./ProfileCard";
import styles from "./MyPageShell.module.css";

export type MyPageProfileViewProps =
  | { status: "loading" }
  | { status: "error"; onRetry: () => void }
  | { status: "signed-out" }
  | { status: "success"; user: User };

export default function MyPageProfileView(props: MyPageProfileViewProps) {
  if (props.status === "loading") {
    return <div className={styles.profileState} role="status" aria-live="polite">내 정보를 불러오는 중이에요.</div>;
  }
  if (props.status === "error") {
    return (
      <div className={styles.profileState} role="alert">
        <p>내 정보를 불러오지 못했어요.</p>
        <Button variant="secondary" className="w-auto" onClick={props.onRetry}>내 정보 다시 시도</Button>
      </div>
    );
  }
  if (props.status === "signed-out") {
    return (
      <div className={styles.profileState}>
        <p>내 정보를 보려면 로그인해주세요.</p>
        <Link href="/login" className="text-primary-600 underline">로그인하기</Link>
      </div>
    );
  }
  const { user } = props;
  return (
    <ProfileCard
      key={JSON.stringify([user.id, user.name, user.email, user.image])}
      name={user.name}
      email={user.email}
      imageSrc={user.image || "/profile/profile_female1.svg"}
    />
  );
}
