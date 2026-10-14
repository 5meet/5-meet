import type { Meta, StoryObj } from "@storybook/react";
import { FloatingActionButton } from "./FloatingActionButton";
import { UserPlus, PenSquare, MessageSquarePlus } from "lucide-react";
const iconMap = {
  UserPlus,
  PenSquare,
  MessageSquarePlus,
};
const meta = {
  // 사이트의 사이드바에 표시되는 제목
  title: "Components/Button/FloatingActionButton",
  component: FloatingActionButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      description:
        "버튼에 표시할 아이콘 (LucideIcon)",
      options: Object.keys(iconMap),
      mapping: iconMap,
      control: {
        type: "select",
        labels: {
          UserPlus: "UserPlus (모임 만들기)",
          PenSquare: "PenSquare (글쓰기)",
          MessageSquarePlus: "MessageSquarePlus (리뷰 쓰기)",
          Plus: "Plus (추가)",
        },
      },
      table: {
        type: { summary: "LucideIcon" },
      },
    },
    label: {
      control: "text",
      description: "데스크톱/태블릿 환경에서 노출할 텍스트 (모바일 aria-label)",
      table: {
        type: { summary: "string" },
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
    className: {
      control: "text",
      description: "추가 스타일 클래스",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "''" },
      },
    },
  },
} satisfies Meta<typeof FloatingActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

;

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    icon: UserPlus,
    label: "모임 만들기",
  },
};

export const Disabled: Story = {
  args: {
    icon: UserPlus,
    label: "모임 만들기",
    disabled: true,
  },
};
