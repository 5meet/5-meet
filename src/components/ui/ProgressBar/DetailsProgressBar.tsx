"use client";

import ProgressBar from "./ProgressBar";

const DetailsProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="flex max-w-[549px] min-w-[295px] flex-col">
      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>최소 5명</span>
        <span>최대 20명</span>
      </div>

      <ProgressBar percentage={percentage} />
    </div>
  );
};

export default DetailsProgressBar;
