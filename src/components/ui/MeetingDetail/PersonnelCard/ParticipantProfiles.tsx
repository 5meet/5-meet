import Image from "next/image";

export interface ParticipantProfile {
  id: string;
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
    <div className="group relative flex items-center">
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

      {hiddenParticipants.length > 0 && (
        <div
          className="
            absolute left-full top-0 flex items-center gap-1.5
            max-w-[160px] lg:max-w-[280px] overflow-x-auto
            -translate-x-7 opacity-0 pointer-events-none
            transition-all duration-300 ease-out
            group-hover:translate-x-1 group-hover:opacity-100
            group-hover:pointer-events-auto
            [&::-webkit-scrollbar]:h-1
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-track]:bg-transparent
          "
        >
          {hiddenParticipants.map((participant) => (
            <div
              key={participant.id}
              className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full"
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
      )}
    </div>
  );
};

export default ParticipantProfiles;
