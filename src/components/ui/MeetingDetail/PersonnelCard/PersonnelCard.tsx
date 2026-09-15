import Image from "next/image";
import DetailsProgressBar, {
  DetailsProgressBarProps,
} from "@/components/ui/ProgressBar/DetailsProgressBar";

const PersonnelCard = ({
  participantCount,
  capacity,
}: DetailsProgressBarProps) => {
  return (
    <div className="flex w-full max-w-[630px] min-w-[343px] max-h-[141px] min-h-[113px] px-10 pt-7 pb-8.5 bg-mint-gradient-200 border border-solid border-[#BEEDE7] rounded-3xl">
      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <span className="text-primary-600 font-bold text-lg">
              {participantCount}
              <span className="text-[#111827] font-medium">명 참여</span>
            </span>

            {/* 참가자 프로필 이미지들 - 5개 부터는 참가자 인원만큼 +nn으로 표시, 참여자가 없으면 렌더링 X */}
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
