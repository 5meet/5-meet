import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ParticipantProfiles from "./ParticipantProfiles";

const meta = {
  title: "Components/MeetingDetail/PersonnelCard/ParticipantProfiles",
  component: ParticipantProfiles,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    participantCount: {
      control: {
        type: "number",
      },
      description: "전체 모임 참가자 수",
    },
    participants: {
      control: false,
      description: "프로필을 표시할 참가자 목록",
    },
  },
} satisfies Meta<typeof ParticipantProfiles>;

export default meta;

type Story = StoryObj<typeof meta>;

const participants = [
  {
    id: "a-1",
    name: "이영희",
    image: "/profile/profile_female1.svg",
  },
  {
    id: "a-2",
    name: "김철수",
    image: "/profile/profile_female2.svg",
  },
  {
    id: "a-3",
    name: "박민수",
    image: "/profile/profile_male.svg",
  },
  {
    id: "a-4",
    name: "최지은",
    image: "/profile/profile_female1.svg",
  },
  {
    id: "a-5",
    name: "정수현",
    image: "/profile/profile_male.svg",
  },
  {
    id: "a-6",
    name: "강민지",
    image: "/profile/profile_female2.svg",
  },
  {
    id: "a-7",
    name: "윤지훈",
    image: "/profile/profile_male.svg",
  },
  {
    id: "a-8",
    name: "한서연",
    image: "/profile/profile_female1.svg",
  },
  {
    id: "a-9",
    name: "조현우",
    image: "/profile/profile_female1.svg",
  },
  {
    id: "a-10",
    name: "송예린",
    image: "/profile/profile_female2.svg",
  },
  {
    id: "a-11",
    name: "오준혁",
    image: "/profile/profile_male.svg",
  },
  {
    id: "a-12",
    name: "임수진",
    image: "/profile/profile_female1.svg",
  },
  {
    id: "a-13",
    name: "장도윤",
    image: "/profile/profile_female2.svg",
  },
  {
    id: "a-14",
    name: "김하은",
    image: "/profile/profile_female2.svg",
  },
  {
    id: "a-15",
    name: "서준호",
    image: "/profile/profile_male.svg",
  },
];

export const NoParticipants: Story = {
  args: {
    participantCount: 0,
    participants: [],
  },
};

export const OneParticipant: Story = {
  args: {
    participantCount: 1,
    participants: participants.slice(0, 1),
  },
};

export const FourParticipants: Story = {
  args: {
    participantCount: 4,
    participants,
  },
};

export const FiveParticipants: Story = {
  args: {
    participantCount: 5,
    participants,
  },
};

export const EightParticipants: Story = {
  args: {
    participantCount: 8,
    participants,
  },
};

export const FiftenParticipants: Story = {
  args: {
    participantCount: 15,
    participants,
  },
};
