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
      description: "진행률을 백분율로 설정합니다.",
    },
    animated: {
      control: "boolean",
      description: "진행률 애니메이션 적용 여부",
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percentage: 50,
    animated: false,
  },
};

export const Animated: Story = {
  args: {
    percentage: 70,
    animated: true,
  },
};

export const Empty: Story = {
  args: {
    percentage: 0,
    animated: false,
  },
};

export const Half: Story = {
  args: {
    percentage: 50,
    animated: false,
  },
};

export const Complete: Story = {
  args: {
    percentage: 100,
    animated: false,
  },
};
