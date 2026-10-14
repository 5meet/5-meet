export interface MeetingFormState {
  name: string;
  type: string;
  region: string; // 도로명 주소
  address: string; // 상세 주소
  latitude: number;
  longitude: number;
  date: string; // "2027-02-10"
  time: string; // "17:30"
  registrationEndDate: string;
  registrationEndTime: string;
  capacity: number;
  image: string;
  description: string;
}
