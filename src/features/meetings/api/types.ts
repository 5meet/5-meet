export type MeetingHost = {
  id: number;
  name: string;
  image: string | null;
};

export type Meeting = {
  id: number;
  teamId: string;
  name: string;
  type: string;
  region: string;
  address?: string;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  participantCount: number;
  image: string | null;
  confirmedAt: string | null;
  canceledAt: string | null;
  host?: MeetingHost;
};

export type MeetingsPage = {
  data: Meeting[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type GetMeetingsParams = {
  type?: string;
  region?: string;
  keyword?: string;
  dateStart?: string;
  dateEnd?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  size?: number;
};
