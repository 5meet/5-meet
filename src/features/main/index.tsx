import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";

const CATEGORIES = [
  {
    image: "/categories/category-hobby.svg",
    label: "취미/여가",
    bgcolor: "from-[#7AEBB8] to-[#71DEAB]",
    textcoler: "text-[#7ED9A6]",
    offset: "lg:mt-0",
  },
  {
    image: "/categories/category-study.svg",
    label: "스터디",
    bgcolor: "from-[#FFABAB] to-[#FF8686]",
    textcoler: "text-[#FF9D9D]",
    offset: "lg:mt-12",
  },
  {
    image: "/categories/category-business.svg",
    label: "비즈니스",
    bgcolor: "from-[#91C4FF] to-[#64ABFF]",
    textcoler: "text-[#6DA8FF]",
    offset: "lg:mt-0",
  },
  {
    image: "/categories/category-health.svg",
    label: "운동/건강",
    bgcolor: "from-[#F9E343] to-[#FBD537]",
    textcoler: "text-[#FFE04D]",
    offset: "lg:mt-12",
  },
  {
    image: "/categories/category-family.svg",
    label: "가족/육아",
    bgcolor: "from-[#57E6D1] to-[#32D6C1]",
    textcoler: "text-[#35D6C0]",
    offset: "lg:mt-0",
  },
  {
    image: "/categories/category-etc.svg",
    label: "기타",
    bgcolor: "from-[#FDB36B] to-[#FC9744]",
    textcoler: "text-[#FFA85C]",
    offset: "lg:mt-10",
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
      <Button size="md" variant="primary" className="cursor-pointer z-1">
        모임 둘러보기
      </Button>
    </Link>
  );
}

export default function LandingPageClient() {
  return (
    <main className="flex flex-col justify-center text-gray-900 cursor-default">
      {/* 1. 히어로 */}
      <section className="w-full bg-mint-gradient-100">
        <header className="relative content-end mx-auto flex flex-col max-w-300 items-center gap-15 px-5 py-16 md:flex-row md:justify-between md:py-24">
          <div className="flex flex-col items-start gap-16 md:items-start md:text-left">
            <div className="flex flex-col gap-8 z-1">
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

            <div className="absolute top-5 left-30 md:top-15 md:left-0 lg:top-25">
              <Image
                src="/landing/header-bg.svg"
                alt=""
                width={100}
                height={100}
              />
            </div>
          </div>

          <div className="relative h-64 w-full max-w-md md:h-96">
            <Image
              src="/landing/header.svg"
              alt="함께 책을 읽는 사람들"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-3 left-65 md:bottom-7 md:left-95 lg:left-145 flex">
            <Image
              src="/landing/chevron-down-double.svg"
              alt=""
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </header>
      </section>

      {/* 2. 모임 찾기 */}
      <section className="w-full bg-white py-16 md:py-24">
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

          <ul className="flex w-[337px] flex-wrap items-start justify-center gap-4 md:gap-5 md:w-full">
            {CATEGORIES.map(({ image, label, bgcolor, textcoler, offset }) => (
              <li
                key={label}
                className={`flex h-44 w-36 flex-col items-center justify-between rounded-3xl p-4 md:h-64 md:w-44 bg-linear-to-t ${bgcolor} ${offset}`}
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
      <section className="w-full bg-gray-50 py-16 md:py-24">
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
                src="/landing/community.svg"
                alt="달램 토크 화면"
                fill
                className="object-cover"
              />
            </div>
            <span className="absolute bottom-4 left-0 rounded-full bg-primary-500 px-4 py-2 text-xs font-medium text-white shadow-md md:-left-6">
              재밌는 모임 추천해주세요!
            </span>
            <span className="absolute bottom-55 right-0 rounded-full bg-primary-200 px-4 py-2 text-xs font-medium text-primary-600 shadow-md md:-right-6">
              모임 주최할 때 꿀팁
            </span>
            <span className="absolute bottom-7 right-0 rounded-full bg-white p-2 text-xs font-medium text-primary-600 shadow-md md:-right-6">
              <Image
                src="/profile/profile_female1.svg"
                alt=""
                width={70}
                height={70}
              />
            </span>
            <span className="absolute top-7 left-0 rounded-full bg-white p-2 text-xs font-medium text-primary-600 shadow-md md:-left-6">
              <Image
                src="/profile/profile_female2.svg"
                alt=""
                width={40}
                height={40}
              />
            </span>
          </div>
        </div>
      </section>

      {/* 4. 리뷰 */}
      <section className="w-full bg-[#9BE8C0] py-16 md:py-24">
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

          <ul className="flex flex-wrap justify-center gap-4 cursor-default">
            {REVIEWS.map(({ image, name, text }, i) => (
              <li
                key={name}
                className={`w-full rounded-2xl bg-white p-5 shadow-sm max-w-[335px] md:max-w-[527px] ${i >= 3 ? "md:mt-2" : ""}`}
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
      <section className="relative bg-mint-gradient-100 py-16 md:py-24">
        <footer className=" mx-auto flex max-w-300 flex-col items-center gap-6 px-5 text-center">
          <h2 className="text-xl font-bold leading-snug z-1 md:text-3xl">
            혼자 시작하기 어려웠던 일들,
            <br />
            <span className="text-primary-600">같이달램</span>에서 함께 해요
          </h2>
          <CtaButton />

          <div className="absolute top-5 left-30 md:top-10 md:left-40 lg:left-120 lg:top-10">
            <Image
              src="/landing/header-bg.svg"
              alt=""
              width={100}
              height={100}
            />
          </div>

          <div className="absolute top-30 left-20 md:top-40 md:left-30 lg:left-70">
            <Image src="/landing/star.svg" alt="" width={50} height={50} />
          </div>

          <div className="absolute bottom-0 right-0">
            <Image src="/landing/Union.svg" alt="" width={400} height={400} />
          </div>
        </footer>
      </section>
    </main>
  );
}
