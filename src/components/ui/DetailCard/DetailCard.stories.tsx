import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DetailCard from "./DetailCard";

const meta = {
  title: "UI/DetailCard",
  component: DetailCard,
  parameters: { layout: "padded" },
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
    actionDisabled: true,
  },
} satisfies Meta<typeof DetailCard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Large: Story = { decorators: [(Story) => <div style={{ maxWidth: 958 }}><Story /></div>] };
export const Medium: Story = { decorators: [(Story) => <div style={{ maxWidth: 696 }}><Story /></div>] };
export const Small: Story = { decorators: [(Story) => <div style={{ maxWidth: 343 }}><Story /></div>] };
export const Completed: Story = { args: { status: "completed", isConfirmed: false, actionLabel: undefined } };
export const Canceled: Story = { args: { status: "canceled", isConfirmed: false, actionLabel: undefined } };
