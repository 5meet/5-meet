import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import DetailCard from "./DetailCard";

const meta = {
  title: "UI/DetailCard",
  component: DetailCard,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-gray-50">
        <Story />
      </div>
    ),
  ],
  args: {
    id: 1,
    title: "힐링 오피스 스트레칭",
    category: "오피스 스트레칭",
    location: "강남구",
    date: "11월 17일",
    time: "17:30",
    participantCount: 20,
    capacity: 20,
    status: "upcoming",
    isConfirmed: true,
    actionLabel: "예약 취소하기",
    onAction: fn(),
    onFavorite: fn(),
    isFavorited: true,
    imageUrl: "/meetings-hero.jpg",
  },
} satisfies Meta<typeof DetailCard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Large: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 958 }}>
        <Story />
      </div>
    ),
  ],
};
export const Medium: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 696 }}>
        <Story />
      </div>
    ),
  ],
};
export const Small: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 343 }}>
        <Story />
      </div>
    ),
  ],
};
export const Completed: Story = {
  args: {
    status: "completed",
    isConfirmed: false,
    actionLabel: "리뷰 작성하기",
    actionHref: "/mypage/reviews",
    onAction: undefined,
  },
};
export const Canceled: Story = {
  args: { status: "canceled", isConfirmed: false, actionLabel: undefined },
};

export const CancelPending: Story = { args: { actionPending: true } };
export const CancelDisabled: Story = { args: { actionDisabled: true } };
export const LongTitle: Story = {
  args: {
    title:
      "아주 긴 제목과 다양한 위치를 가진 모임에서도 화면을 넘치지 않도록 검증하는 테스트 모임",
  },
};

export const NarrowColumn: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 343 }}>
        <Story />
      </div>
    ),
  ],
};
export const ParentPadding: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 391, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};
