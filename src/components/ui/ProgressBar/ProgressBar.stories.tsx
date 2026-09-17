import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ProgressBar from "./ProgressBar";

const meta = {
  title: "Components/ProgressBar/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    percentage: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percentage: 50,
  },
};

export const Empty: Story = {
  args: {
    percentage: 0,
  },
};

export const Half: Story = {
  args: {
    percentage: 50,
  },
};

export const Complete: Story = {
  args: {
    percentage: 100,
  },
};
