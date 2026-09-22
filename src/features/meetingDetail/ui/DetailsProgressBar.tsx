import ProgressBar from "../../../components/ui/ProgressBar/ProgressBar";
import { DetailsProgressBarProps } from "@/features/meetingDetail/types/meetingDetail";

const DetailsProgressBar = ({
  participantCount,
  capacity,
}: DetailsProgressBarProps) => {
  const percentage =
    capacity > 0 ? Math.min((participantCount / capacity) * 100, 100) : 0;

  return (
    <div className="flex w-full max-w-[549px] min-w-[295px] flex-col">
      <span className="mb-2 text-right text-sm text-gray-600">
        최대 {capacity}명
      </span>

      <ProgressBar percentage={percentage} animated={true} />
    </div>
  );
};

export default DetailsProgressBar;
