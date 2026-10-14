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
    children: {
      control: "text",
      description: "버튼 내부에 표시될 텍스트 또는 React 노트",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
      description: "버튼 스타일 테마",
      table: {
        type: { summary: '"primary" | "secondary"' },
        defaultValue: { summary: '"primary"' },
      },
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "버튼 크기(높이, 내부 패팅, 폰트 크기)",
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
    isLoading: {
      control: "boolean",
      description: "비동기 작업 중 스피너 노출 및 클릭 비활성화 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "버튼의 비활성화 상태 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
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
  args: {
    children: "참여하기",
    variant: "secondary",
    size: "md",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="primary" size="sm">
        테스트
      </Button>
      <Button variant="primary" size="md">
        테스트
      </Button>
      <Button variant="primary" size="lg">
        테스트
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: "진행 불가",
    variant: "primary",
    size: "md",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: "제출하기",
    variant: "primary",
    size: "md",
    isLoading: true,
  },
};
