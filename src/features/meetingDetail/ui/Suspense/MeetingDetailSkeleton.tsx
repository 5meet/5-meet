const Bone = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />
);

function MeetingDetailSkeleton() {
  return (
    <main className="flex flex-col items-center mt-10 mb-10 px-2 md:mt-20 md:mb-20">
      <div
        className="flex flex-col w-full max-w-[343px] gap-20 md:max-w-174 lg:max-w-7xl"
        aria-busy="true"
        aria-label="모임 정보를 불러오는 중"
      >
        <div className="flex gap-4 justify-center flex-wrap md:flex-nowrap">
          <Bone className="w-[343px] h-[241px] rounded-4xl md:w-[333px] md:h-[362px] lg:w-[630px] lg:h-[443px]" />
          <div className="flex flex-col gap-4">
            <Bone className="w-85.75 h-50 rounded-3xl lg:w-157.5 lg:h-70.5" />
            <Bone className="w-85.75 h-28 rounded-3xl lg:w-157.5 lg:h-35" />
          </div>
        </div>
        <Bone className="h-40 w-full rounded-3xl" />
        <Bone className="h-65 w-full rounded-4xl md:h-88" />
        <Bone className="h-60 w-full rounded-3xl" />
      </div>
    </main>
  );
}

export default MeetingDetailSkeleton;
