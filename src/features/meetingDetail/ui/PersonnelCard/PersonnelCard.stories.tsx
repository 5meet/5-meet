import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PersonnelCard from "./PersonnelCard";

const meta = {
  title: "Components/MeetingDetail/PersonnelCard/PersonnelCard",
  component: PersonnelCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    participantCount: {
      control: {
        type: "number",
      },
      description: "현재 참여 중인 인원 수",
    },
    capacity: {
      control: {
        type: "number",
      },
      description: "모임의 최대 수용 인원",
    },
  },
} satisfies Meta<typeof PersonnelCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const participants = [
  {
    id: 11,
    name: "이영희",
    image: "/profile/profile_female1.svg",
  },
  {
    id: 12,
    name: "김철수",
    image: "/profile/profile_female2.svg",
  },
  {
    id: 13,
    name: "박민수",
    image: "/profile/profile_male.svg",
  },
  {
    id: 14,
    name: "최지은",
    image: "/profile/profile_female1.svg",
  },
  {
    id: 15,
    name: "정수현",
    image: "/profile/profile_male.svg",
  },
  {
    id: 16,
    name: "강민지",
    image: "/profile/profile_female2.svg",
  },
  {
    id: 17,
    name: "윤지훈",
    image: "/profile/profile_male.svg",
  },
  {
    id: 18,
    name: "한서연",
    image: "/profile/profile_female1.svg",
  },
  {
    id: 19,
    name: "조현우",
    image: "/profile/profile_female1.svg",
  },
  {
    id: 10,
    name: "송예린",
    image: "/profile/profile_female2.svg",
  },
  {
    id: 11,
    name: "오준혁",
    image: "/profile/profile_male.svg",
  },
  {
    id: 12,
    name: "임수진",
    image: "/profile/profile_female1.svg",
  },
  {
    id: 13,
    name: "장도윤",
    image: "/profile/profile_female2.svg",
  },
  {
    id: 14,
    name: "김하은",
    image: "/profile/profile_female2.svg",
  },
  {
    id: 15,
    name: "서준호",
    image: "/profile/profile_male.svg",
  },
];

export const Default: Story = {
  args: {
    participantCount: 3,
    capacity: 20,
    participants: [],
  },
};

export const FewParticipants: Story = {
  args: {
    participantCount: 1,
    capacity: 20,
    participants: participants.slice(0, 1),
  },
};

export const HalfParticipants: Story = {
  args: {
    participantCount: 15,
    capacity: 30,
    participants,
  },
};

export const FullParticipants: Story = {
  args: {
    participantCount: 10,
    capacity: 10,
    participants,
  },
};
