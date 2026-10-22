/** Host information shared by raw meeting API responses. */
export interface MeetingHost {
  id: number;
  name: string;
  image: string | null;
}

/** Only fields with matching meaning and nullability across meeting responses. */
export interface BaseMeeting {
  id: number;
  teamId: string;
  name: string;
  type: string;
  region: string;
  capacity: number;
  participantCount: number;
  image: string | null;
  canceledAt: string | null;
  confirmedAt: string | null;
  hostId: number;
  createdBy: number;
  host: MeetingHost;
  isCompleted: boolean;
}
