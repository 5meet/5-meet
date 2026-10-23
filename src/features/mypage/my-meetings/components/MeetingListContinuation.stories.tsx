import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import MeetingListContinuation from "./MeetingListContinuation";

const meta = {
  title: "Features/Mypage/MeetingListContinuation",
  component: MeetingListContinuation,
  args: { isLoading: false, isError: false, onRetry: fn() },
  parameters: { layout: "padded" },
} satisfies Meta<typeof MeetingListContinuation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Waiting: Story = {};
export const Loading: Story = { args: { isLoading: true } };
export const Error: Story = { args: { isError: true } };
