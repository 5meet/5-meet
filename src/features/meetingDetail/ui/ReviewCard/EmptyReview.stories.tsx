import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import EmptyReview from "./EmptyReview";

const meta = {
  title: "Features/MeetingDetail/ReviewCard/EmptyReview",
  component: EmptyReview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyReview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
