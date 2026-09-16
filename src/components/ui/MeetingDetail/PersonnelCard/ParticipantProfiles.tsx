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

  const visibleParticipants = participants.slice(
    0,
    Math.min(MAX_VISIBLE_PROFILES, participantCount),
  );
  const hiddenParticipants = participants.slice(
    MAX_VISIBLE_PROFILES,
    participantCount,
  );
  const remainingCount = Math.max(participantCount - MAX_VISIBLE_PROFILES, 0);

  return (
    <div className="group flex items-center">
      {visibleParticipants.map((participant, index) => (
        <div
          key={participant.id}
          className={`
            relative h-7 w-7 shrink-0 overflow-hidden rounded-full
            transition-all duration-300 ease-out
            ${index > 0 ? "-ml-3 group-hover:ml-1" : ""}
          `}
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
        <div
          className="
            flex h-7 w-7 shrink-0 items-center justify-center
            overflow-hidden rounded-full
            bg-white text-xs font-semibold text-gray-700
            -ml-3
            transition-all duration-300 ease-out
            group-hover:ml-0
            group-hover:w-0
          "
        >
          +{remainingCount}
        </div>
      )}

      {hiddenParticipants.map((participant) => (
        <div
          key={participant.id}
          className="
            relative h-7 w-7 shrink-0 overflow-hidden rounded-full
            -ml-7 opacity-0
            transition-all duration-300 ease-out
            group-hover:ml-1
            group-hover:opacity-100
          "
        >
          <Image
            src={participant.image ?? "/profile/profile_female1.svg"}
            alt={`${participant.name} 프로필`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default ParticipantProfiles;
