// 디자인 1 - 깔끔한 404 그라데이션
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-5 text-center">
      <span
        className="bg-mint-gradient-500 bg-clip-text text-[120px] font-black leading-none text-transparent md:text-[160px]"
        aria-hidden="true"
      >
        404
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          페이지를 찾을 수 없어요
        </h1>
        <p className="text-sm text-gray-600 md:text-base">
          주소가 변경되었거나 삭제된 페이지일 수 있어요.
        </p>
      </div>

      <Link href="/">
        <Button size="lg" variant="primary">
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
}

// 디자인 2 - 카드형 + 아이콘 조합
// import Link from "next/link";
// import { MapPinOff } from "lucide-react";
// import { Button } from "@/components/ui/Button/Button";

// export default function NotFoundPage() {
//   return (
//     <div className="flex min-h-[70vh] items-center justify-center px-5">
//       <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl bg-white px-8 py-12 shadow-sm">
//         <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
//           <MapPinOff className="h-10 w-10 text-primary-500" strokeWidth={1.5} />
//         </div>

//         <div className="flex flex-col items-center gap-2 text-center">
//           <span className="text-sm font-semibold text-primary-600">404 ERROR</span>
//           <h1 className="text-xl font-bold text-gray-900">
//             이런, 길을 잃으셨나봐요
//           </h1>
//           <p className="text-sm text-gray-500">
//             요청하신 페이지가 존재하지 않거나
//             <br />
//             더 이상 운영되지 않는 모임일 수 있어요.
//           </p>
//         </div>

//         <div className="flex w-full gap-3">
//           <Link href="/" className="flex-1">
//             <Button variant="secondary" fullWidth>
//               홈으로
//             </Button>
//           </Link>
//           <Link href="/meetings" className="flex-1">
//             <Button variant="primary" fullWidth>
//               모임 둘러보기
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// 디자인 3 - 풀스크린 그라데이션 + 텍스트 최소화
// import Link from "next/link";
// import { Button } from "@/components/ui/Button/Button";

// export default function NotFoundPage() {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-mint-gradient-100 px-5 text-center">
//       <div className="flex flex-col gap-3">
//         <span className="text-sm font-bold tracking-widest text-primary-600">
//           404 NOT FOUND
//         </span>
//         <h1 className="text-2xl font-bold text-gray-900 md:text-4xl">
//           앗, 모임을 찾을 수 없어요
//         </h1>
//         <p className="text-base text-gray-600 md:text-lg">
//           링크가 잘못되었거나, 모임이 삭제되었을 수 있어요.
//         </p>
//       </div>

//       <Link href="/">
//         <Button size="lg" variant="primary" className="px-10">
//           달램 홈으로 가기
//         </Button>
//       </Link>

//       <div
//         className="mt-4 h-1 w-24 rounded-full bg-mint-gradient-500"
//         aria-hidden="true"
//       />
//     </div>
//   );
// }
