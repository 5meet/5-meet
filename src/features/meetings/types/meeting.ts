export interface MeetingHost {
  id: number;
  name: string;
  image: string | null;
}

export interface Meeting {
  id: number;
  teamId: string;
  name: string;
  description: string;
  type: string;
  image: string | null;

  address: string;
  region: string;
  latitude: number;
  longitude: number;

  dateTime: string;
  registrationEnd: string;

  capacity: number;
  participantCount: number;

  createdBy: number;
  hostId: number;
  host: MeetingHost;

  isCompleted: boolean;
  confirmedAt: string | null;
  canceledAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface MeetingsResponse {
  data: Meeting[];
  hasMore: boolean;
  nextCursor: string | null;
}