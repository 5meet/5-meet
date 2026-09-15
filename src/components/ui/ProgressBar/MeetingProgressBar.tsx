import ProgressBar from "./ProgressBar";
import Image from "next/image";

const MeetingProgressBar = ({
  participantCount,
  capacity,
}: {
  participantCount: number;
  capacity: number;
}) => {
  const percentage =
    capacity > 0 ? Math.min((participantCount / capacity) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-2 w-full max-w-[258px] min-w-[191px]">
      <Image src="/person.svg" alt="Person" width={20} height={20} />

      <ProgressBar percentage={percentage} />

      <span className="flex items-center text-sm font-medium text-gray-600">
        <span className="text-primary-500">{participantCount}</span> /{capacity}
      </span>
    </div>
  );
};
export default MeetingProgressBar;
