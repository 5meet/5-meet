"use client";

import ProgressBar from "./ProgressBar";
import Image from "next/image";

const MeetingProgressBar = ({
  percentage,
  count,
}: {
  percentage: number;
  count: number;
}) => {
  return (
    <div className="flex items-center gap-2 w-full max-w-[258px] min-w-[191px]">
      <Image src="/person.svg" alt="Person" width={20} height={20} />

      <ProgressBar percentage={percentage} />

      <span className="flex items-center text-sm font-medium text-gray-600">
        <span className="text-primary-500">{count}</span> /20
      </span>
    </div>
  );
};
export default MeetingProgressBar;
