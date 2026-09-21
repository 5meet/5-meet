import Image from "next/image";

const EmptyReview = () => {
  return (
    <div className="flex flex-col w-full p-14">
      <Image
        src="/review_empty.svg"
        alt="아직 리뷰가 없어요."
        width={120}
        height={72}
      />
      <span className="font-medium text-base text-gray-500">
        아직 리뷰가 없어요.
      </span>
    </div>
  );
};

export default EmptyReview;
