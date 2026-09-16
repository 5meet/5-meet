import Image from "next/image";
import DetailsProgressBar, {
  DetailsProgressBarProps,
} from "@/components/ui/ProgressBar/DetailsProgressBar";
import ParticipantProfiles from "./ParticipantProfiles";

interface PersonnelCardProps extends DetailsProgressBarProps {
  participants: ParticipantProfile[];
}
interface ParticipantProfile {
  id: number;
  name: string;
  image: string | null;
}

const PersonnelCard = ({
  participantCount,
  capacity,
  participants,
}: PersonnelCardProps) => {
  return (
    <div className="flex w-full max-w-[630px] min-w-[343px] max-h-[141px] min-h-[113px] px-10 pt-7 pb-8.5 bg-mint-gradient-200 border border-solid border-[#BEEDE7] rounded-3xl">
      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <span className="text-primary-600 font-bold text-lg">
              {participantCount}
              <span className="text-[#111827] font-medium">명 참여</span>
            </span>

            {participantCount > 0 && (
              <ParticipantProfiles
                participants={participants}
                participantCount={participantCount}
              />
            )}
          </div>

          {/* 개설 확정 라벨 컴포넌트 - 참여 인원이 최소 인원을 넘으면 나타나도록 설정*/}
        </div>

        <DetailsProgressBar
          participantCount={participantCount}
          capacity={capacity}
        />
      </div>
    </div>
  );
};

export default PersonnelCard;
