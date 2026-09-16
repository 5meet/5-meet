import Image from "next/image";

interface ParticipantProfile {
  id: number;
  name: string;
  image: string | null;
}

interface ParticipantProfilesProps {
  participants: ParticipantProfile[];
  participantCount: number;
}

const MAX_VISIBLE_PROFILES = 4;

const ParticipantProfiles = ({
  participants,
  participantCount,
}: ParticipantProfilesProps) => {
  if (participantCount === 0) {
    return null;
  }

  const visibleParticipants = participants.slice(0, MAX_VISIBLE_PROFILES);
  const remainingCount = participantCount - MAX_VISIBLE_PROFILES;

  return (
    <div className="flex items-center">
      {visibleParticipants.map((participant, index) => (
        <div
          key={participant.id}
          className={`relative h-7 w-7 overflow-hidden ${
            index > 0 ? "-ml-3" : ""
          }`}
        >
          <Image
            src={participant.image ?? "/profile/profile_female1.svg"}
            alt={`${participant.name} 프로필`}
            fill
            className="object-cover"
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="-ml-3 flex relative h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-gray-700">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default ParticipantProfiles;
