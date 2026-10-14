import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import OpenConfirmedTag from "./OpenConfirmedTag";

const meta = {
  title: "Components/Tags/OpenConfirmedTag",
  component: OpenConfirmedTag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isConfirmed: {
      control: "boolean",
      description: "모임 개설 확정 여부",
    },
  },
} satisfies Meta<typeof OpenConfirmedTag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Confirmed: Story = {
  args: {
    isConfirmed: true,
  },
};

export const NotConfirmed: Story = {
  args: {
    isConfirmed: false,
  },
};
