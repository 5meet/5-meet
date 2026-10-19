import type { ReactNode } from "react";
import MyPageTabs from "./MyPageTabs";
import styles from "./MyPageShell.module.css";

interface MyPageShellProps {
  profile: ReactNode;
  children: ReactNode;
}

/** Owns placement only; each tab retains its own data and actions. */
export default function MyPageShell({ profile, children }: MyPageShellProps) {
  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <h1 className={styles.title}>마이페이지</h1>
        <div className={styles.profile}>{profile}</div>
        <div className={styles.tabs}><MyPageTabs /></div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
