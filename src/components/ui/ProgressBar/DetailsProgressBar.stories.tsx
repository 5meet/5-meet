import type { Meta, StoryObj } from "@storybook/nextjs";

import DetailsProgressBar from "./DetailsProgressBar";

const meta = {
  title: "Components/ProgressBar/DetailsProgressBar",
  component: DetailsProgressBar,
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
      description: "참가자 비율",
    },
  },
} satisfies Meta<typeof DetailsProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percentage: 50,
  },
};

export const Minimum: Story = {
  args: {
    percentage: 25,
  },
};

export const Maximum: Story = {
  args: {
    percentage: 100,
  },
};
