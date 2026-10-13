// 디자인 2 - 카드형 + 아이콘 조합
import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-8 px-5 bg-mint-gradient-100 text-center">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl bg-white px-8 py-12 shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
          <MapPinOff className="h-10 w-10 text-primary-500" strokeWidth={1.5} />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-sm font-semibold text-primary-600">
            404 ERROR
          </span>
          <h1 className="text-xl font-bold text-gray-900">
            이런, 길을 잃으셨나봐요
          </h1>
          <p className="text-sm text-gray-500">
            요청하신 페이지가 존재하지 않거나
            <br />더 이상 운영되지 않는 모임일 수 있어요.
          </p>
        </div>

        <div className="flex w-full gap-3">
          <Link href="/" className="flex-1">
            <Button variant="secondary" fullWidth>
              홈으로
            </Button>
          </Link>
          <Link href="/meetings" className="flex-1">
            <Button variant="primary" fullWidth>
              모임 둘러보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
