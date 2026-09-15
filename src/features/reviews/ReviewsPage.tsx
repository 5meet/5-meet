"use client";

import Image from "next/image";

import { mockReviews } from "@/data/reviews";

import { Filter } from "@/components/ui/Filter/Filter";
import { ReviewSummary } from "./ReviewSummary";
import { ReviewList } from "./ReviewList";

export function ReviewsPage() {
    return (
        <main className="min-h-screen bg-[#f5f7f8]">
            <section className="mx-auto w-full max-w-[1060px] px-5 py-12 sm:px-5 sm:py-10 md:px-6 md:py-12">

                <div className="mb-10 flex items-center gap-5 sm:mb-9 sm:gap-5 md:mb-10">
                <div
                    className="
                        relative
                        h-[58px] w-[68px]
                        shrink-0

                        sm:h-[62px] sm:w-[74px]
                        md:h-[66px] md:w-[80px]
                    "
                    >
                    <Image
                     src="/reviews.svg"
                        alt="모든 리뷰"
                        fill
                        className="object-contain"
                    />
                    </div>

                <div>
                    <h1 className="mb-2 text-[27px] font-bold tracking-[-1.5px] sm:text-[26px] md:mb-2 md:text-[27px]">
                    모든 리뷰
                    </h1>

                    <p className="text-sm text-[#a0a4aa] sm:text-[13px] md:text-sm">
                    같이달램 이용자들은 이렇게 느꼈어요
                    </p>
                </div>
                </div>

                <Filter />
                <ReviewSummary reviews={mockReviews} />
                <ReviewList reviews={mockReviews} />
            </section>
        </main>
    )
}