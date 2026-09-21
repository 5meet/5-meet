"use client";

import DetailsProgressBar, {
  DetailsProgressBarProps,
} from "@/components/ui/ProgressBar/DetailsProgressBar";
import ParticipantProfiles from "./ParticipantProfiles";
import OpenConfirmedTag from "@/components/ui/Tags/OpenConfirmedTag";
import useCountUp from "@/lib/hooks/useCountUp";

interface PersonnelCardProps extends DetailsProgressBarProps {
  participants: ParticipantProfile[];
}
interface ParticipantProfile {
  id: string;
  name: string;
  image: string | null;
}

const PersonnelCard = ({
  participantCount,
  capacity,
  participants,
}: PersonnelCardProps) => {
  const animatedParticipantCount = useCountUp(participantCount);

  const isConfirmed = participantCount >= capacity;

  return (
    <div className="flex w-[343px] min-h-[113px] px-6 pt-5 pb-[22px] lg:px-10 lg:pt-7 lg:pb-8.5 bg-mint-gradient-200 border border-solid border-[#BEEDE7] rounded-3xl lg:w-[630px] lg:h-[141px]">
      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <span className="text-primary-600 font-bold text-lg">
              {animatedParticipantCount}
              <span className="text-[#111827] font-medium">명 참여</span>
            </span>

            {participantCount > 0 && (
              <ParticipantProfiles
                participants={participants}
                participantCount={participantCount}
              />
            )}
          </div>

          <OpenConfirmedTag isConfirmed={isConfirmed} />
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
