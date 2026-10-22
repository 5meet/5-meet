import MyPageProfile from "@/features/mypage/components/MyPageProfile";
import MyPageShell from "@/features/mypage/components/MyPageShell";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MyPageShell profile={<MyPageProfile />}>{children}</MyPageShell>
  );
}
