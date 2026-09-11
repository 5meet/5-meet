import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  // 사이트의 사이드바에 표시되는 제목
  title: "Components/Button/PrimaryButton",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type:{
      description: "버튼의 기존 타입은 button. form안에서 사용 시 submit 타입을 props로 전달"
    }
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "버튼 텍스트",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args:{
    children: "참여하기",
    variant: "secondary",
    size: "md",
  }
}

export const Disabled: Story = {
  args:{
    children: "진행 불가",
    variant: "primary",
    size: "md",
    disabled: true,
  }
}

export const Loading: Story = {
  args: {
    children: "제출하기",
    variant: "primary",
    size: "md",
    isLoading: true,
  },
};