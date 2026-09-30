import MyPageTabs from "@/features/mypage/components/MyPageTabs";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <MyPageTabs />

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}