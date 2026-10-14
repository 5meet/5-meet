"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Filter } from "@/components/ui/Filter/Filter";

import { ReviewList } from "./ReviewList";
import { ReviewSummary } from "./ReviewSummary";

import { useReviewCategoryStatisticsQuery } from "../hooks/useReviewCategoryStatisticsQuery";
import { useReviewStatisticsQuery } from "../hooks/useReviewStatisticsQuery";
import { useReviewsQuery } from "../hooks/useReviewsQuery";

export function ReviewsPage() {
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("전체");

  const [
    dateStart,
    setDateStart,
  ] = useState("");

  const [
    dateEnd,
    setDateEnd,
  ] = useState("");

  const [
    selectedRegion,
    setSelectedRegion,
  ] = useState("전체");

  const [
    isUrgent,
    setIsUrgent,
  ] = useState(false);

  const [
    teamId,
    setTeamId,
  ] = useState<string | undefined>(
    undefined,
  );

  const handleDateChange = (
    nextDateStart: string,
    nextDateEnd: string,
  ) => {
    setDateStart(nextDateStart);
    setDateEnd(nextDateEnd);
  };

  const {
    data,
    isLoading,
    isError,
    error,
  } = useReviewsQuery({
    type:
      selectedCategory !== "전체"
        ? selectedCategory
        : undefined,

    region:
      selectedRegion !== "전체"
        ? selectedRegion
        : undefined,

    dateStart:
      dateStart || undefined,

    dateEnd:
      dateEnd || undefined,

    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const reviews = data?.data ?? [];

  useEffect(() => {
    const nextTeamId =
      reviews[0]?.teamId;

    if (nextTeamId) {
      setTeamId(nextTeamId);
    }
  }, [reviews]);

  const {
    data: statistics,
    isLoading:
      isStatisticsLoading,
  } = useReviewStatisticsQuery(
    teamId,
  );

  const {
    data: categoryStatistics,
    isLoading:
      isCategoryStatisticsLoading,
  } =
    useReviewCategoryStatisticsQuery(
      teamId,
    );

  const selectedStatistics =
    selectedCategory === "전체"
      ? statistics
      : categoryStatistics?.find(
          (item) =>
            item.type ===
            selectedCategory,
        );

  const isSummaryLoading =
    selectedCategory === "전체"
      ? isStatisticsLoading
      : isCategoryStatisticsLoading;

  return (
    <main className="min-h-screen bg-[#f5f7f8]">
      <section
        className="
          mx-auto
          w-full
          max-w-[1060px]
          px-5
          py-12

          sm:px-5
          sm:py-10

          md:px-6
          md:py-12
        "
      >
        <div
          className="
            mb-10
            flex
            items-center
            gap-5

            sm:mb-9
            sm:gap-5

            md:mb-10
          "
        >
          <div
            className="
              relative
              h-[58px]
              w-[68px]
              shrink-0

              sm:h-[62px]
              sm:w-[74px]

              md:h-[66px]
              md:w-[80px]
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
            <h1
              className="
                mb-2
                text-[27px]
                font-bold
                tracking-[-1.5px]

                sm:text-[26px]

                md:mb-2
                md:text-[27px]
              "
            >
              모든 리뷰
            </h1>

            <p
              className="
                text-sm
                text-[#a0a4aa]

                sm:text-[13px]

                md:text-sm
              "
            >
              같이달램 이용자들은 이렇게 느꼈어요
            </p>
          </div>
        </div>

        <Filter
          selectedCategory={
            selectedCategory
          }
          onCategoryChange={
            setSelectedCategory
          }
          dateStart={dateStart}
          dateEnd={dateEnd}
          onDateChange={
            handleDateChange
          }
          selectedRegion={
            selectedRegion
          }
          onRegionChange={
            setSelectedRegion
          }
          isUrgent={isUrgent}
          onUrgentChange={() =>
            setIsUrgent(
              (prev) => !prev,
            )
          }
        />

        {isLoading && (
          <div
            className="
              mt-6
              rounded-[23px]
              bg-white
              px-7
              py-16
              text-center
              text-sm
              text-[#999999]
            "
          >
            리뷰를 불러오는 중이에요.
          </div>
        )}

        {isError && (
          <div
            className="
              mt-6
              rounded-[23px]
              bg-white
              px-7
              py-16
              text-center
              text-sm
              text-[#999999]
            "
          >
            {error instanceof Error
              ? error.message
              : "리뷰를 불러오지 못했습니다."}
          </div>
        )}

        {!isLoading &&
          !isError && (
            <>
              <ReviewSummary
                statistics={
                  selectedStatistics
                }
                isLoading={
                  isSummaryLoading
                }
              />

              <ReviewList
                reviews={reviews}
              />
            </>
          )}
      </section>
    </main>
  );
}