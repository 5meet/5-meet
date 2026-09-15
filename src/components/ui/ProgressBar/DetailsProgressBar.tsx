import ProgressBar from "./ProgressBar";

interface DetailsProgressBarProps {
  participantCount: number;
  capacity: number;
}

const DetailsProgressBar = ({
  participantCount,
  capacity,
}: DetailsProgressBarProps) => {
  const percentage =
    capacity > 0 ? Math.min((participantCount / capacity) * 100, 100) : 0;

  return (
    <div className="flex w-full max-w-[549px] min-w-[295px] flex-col">
      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>최소 5명</span>
        <span>최대 {capacity}명</span>
      </div>

      <ProgressBar percentage={percentage} />
    </div>
  );
};

export default DetailsProgressBar;
