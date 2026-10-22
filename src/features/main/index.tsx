import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";

const CATEGORIES = [
  {
    image: "/categories/category-hobby.svg",
    label: "취미/여가",
    bgcolor: "bg-[#7ED9A6]",
    textcoler: "text-[#7ED9A6]",
    offset: "mt-0",
  },
  {
    image: "/categories/category-study.svg",
    label: "스터디",
    bgcolor: "bg-[#FF9D9D]",
    textcoler: "text-[#FF9D9D]",
    offset: "mt-12",
  },
  {
    image: "/categories/category-business.svg",
    label: "비즈니스",
    bgcolor: "bg-[#6DA8FF]",
    textcoler: "text-[#6DA8FF]",
    offset: "mt-0",
  },
  {
    image: "/categories/category-health.svg",
    label: "운동/건강",
    bgcolor: "bg-[#FFE04D]",
    textcoler: "text-[#FFE04D]",
    offset: "mt-12",
  },
  {
    image: "/categories/category-family.svg",
    label: "가족/육아",
    bgcolor: "bg-[#35D6C0]",
    textcoler: "text-[#35D6C0]",
    offset: "mt-0",
  },
  {
    image: "/categories/category-etc.svg",
    label: "기타",
    bgcolor: "bg-[#FFA85C]",
    textcoler: "text-[#FFA85C]",
    offset: "mt-10",
  },
];

const REVIEWS = [
  {
    image: "/profile/profile_female1.svg",
    name: "김**",
    text: "처음엔 혼자라 망설였는데, 같이 하니 꾸준히 이어가게 돼요.",
  },
  {
    image: "/profile/profile_male.svg",
    name: "이**",
    text: "취향이 비슷한 분들과 이야기하는 시간이 가장 좋았어요.",
  },
  {
    image: "/profile/profile_female2.svg",
    name: "박**",
    text: "모임 운영이 체계적이라 믿고 참여할 수 있었어요.",
  },
  {
    image: "/profile/profile_female2.svg",
    name: "최**",
    text: "퇴근 후 가볍게 참여할 수 있어서 부담이 없었어요.",
  },
  {
    image: "/profile/profile_female1.svg",
    name: "정**",
    text: "새로운 사람들과 만나 일상에 활력이 생겼어요.",
  },
];

function CtaButton() {
  return (
    <Link href="/meetings">
      <Button size="md" variant="primary">
        모임 둘러보기
      </Button>
    </Link>
  );
}

export default function LandingPageClient() {
  return (
    <main className="flex flex-col justify-center text-gray-900">
      {/* 1. 히어로 */}
      <section className="w-full bg-mint-gradient-100">
        <header className="content-end mx-auto flex max-w-300 flex-col items-center gap-5 px-5 py-16 md:flex-row md:justify-between md:py-24">
          <div className="flex flex-col items-center gap-16 text-center md:items-start md:text-left">
            <div className="flex flex-col gap-8">
              <h1 className="text-2xl font-bold leading-snug md:text-4xl">
                혼자보다 함께,
                <br />
                같이달램에서 시작해보세요
              </h1>
              <p className="text-sm text-gray-600 md:text-base">
                혼자 하기엔 어렵던 일도 함께라면 쉬워져요.
                <br />
                다양한 모임에 지금 바로 참여해 보세요.
              </p>
            </div>
            <CtaButton />
          </div>
          <div className="relative h-64 w-full max-w-md md:h-96">
            <Image
              src="/landing/hero.png"
              alt="함께 책을 읽는 사람들"
              fill
              className="object-contain"
              priority
            />
          </div>
        </header>
      </section>

      {/* 2. 모임 찾기 */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto flex max-w-300 flex-col items-center gap-10 px-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-semibold text-primary-600">
              모임 찾기
            </span>
            <h2 className="text-xl font-bold md:text-3xl">
              다양한 분야의 모임을 만나보세요
            </h2>
            <p className="text-sm text-gray-600">
              관심사에 맞는 모임을 찾아 바로 참여할 수 있어요.
            </p>
          </div>

          <ul className="flex w-full flex-wrap items-start justify-center gap-4 md:flex-nowrap md:gap-5">
            {CATEGORIES.map(({ image, label, bgcolor, textcoler, offset }) => (
              <li
                key={label}
                className={`flex h-44 w-36 flex-col items-center justify-between rounded-3xl p-4 md:h-64 md:w-44 ${bgcolor} ${offset} md:${offset}`}
              >
                <div className="relative h-20 w-20 md:h-28 md:w-28">
                  <Image src={image} alt="" fill className="object-contain" />
                </div>
                <span
                  className={`rounded-full bg-white/70 px-3 py-1 text-xs font-semibold ${textcoler} md:text-sm`}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. 달램 토크 */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto flex max-w-300 flex-col items-center gap-10 px-5 md:flex-row md:justify-between">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <span className="text-xs font-semibold text-primary-600">
              달램 토크
            </span>
            <h2 className="text-xl font-bold leading-snug md:text-3xl">
              다양한 사람들과
              <br />
              자유롭게 이야기를 나눠보세요
            </h2>
            <p className="text-sm text-gray-600">
              관심사를 공유하고 후기를 나누며
              <br />
              모임 이후에도 이어지는 관계를 만들어 보세요.
            </p>
          </div>

          <div className="relative w-full max-w-lg">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-gray-200">
              <Image
                src="/landing/community.png"
                alt="달램 토크 화면"
                fill
                className="object-cover"
              />
            </div>
            <span className="absolute bottom-4 left-0 rounded-full bg-primary-500 px-4 py-2 text-xs font-medium text-white shadow-md md:-left-6">
              재밌는 모임 추천해주세요!
            </span>
            <span className="absolute bottom-50 right-0 rounded-full bg-primary-200 px-4 py-2 text-xs font-medium text-primary-600 shadow-md md:-right-6">
              모임 주최할 때 꿀팁
            </span>
          </div>
        </div>
      </section>

      {/* 4. 리뷰 */}
      <section className="bg-[#9BE8C0] py-16 md:py-24">
        <div className="mx-auto flex max-w-300 flex-col items-center gap-10 px-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-semibold text-primary-700">
              모든 리뷰
            </span>
            <h2 className="text-xl font-bold md:text-3xl">
              참여자들의 생생한 후기를 만나보세요
            </h2>
            <p className="text-sm text-gray-700">
              같이달램에서 모임을 경험한 분들의 이야기예요.
            </p>
          </div>

          <ul className="flex flex-wrap justify-center gap-4">
            {REVIEWS.map(({ image, name, text }, i) => (
              <li
                key={name}
                className={`w-full rounded-2xl bg-white p-5 shadow-sm md:w-72 ${i >= 3 ? "md:mt-2" : ""}`}
              >
                <p className="text-sm text-primary-500" aria-label="별점 5점">
                  ♥♥♥♥♥
                </p>
                <div className="flex items-center gap-2">
                  <Image src={image} alt="" width={20} height={20} />
                  <p className="mt-1 text-xs text-gray-500">{name}</p>
                </div>
                <p className="mt-3 text-sm text-gray-700">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. 마지막 CTA */}
      <section className="bg-mint-gradient-100 py-16 md:py-24">
        <footer className="mx-auto flex max-w-300 flex-col items-center gap-6 px-5 text-center">
          <h2 className="text-xl font-bold leading-snug md:text-3xl">
            혼자 시작하기 어려웠던 일들,
            <br />
            <span className="text-primary-600">같이달램</span>에서 함께 해요
          </h2>
          <CtaButton />
        </footer>
      </section>
    </main>
  );
}
