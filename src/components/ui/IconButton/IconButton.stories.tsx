import type { Meta, StoryObj } from "@storybook/react";
import { Pencil, Trash2, Share2, Plus } from "lucide-react";
import { IconButton } from "./IconButton";
import { useState } from "react";
import { Heart } from "lucide-react";

const meta = {
  // 사이트의 사이드바에 표시되는 제목
  title: "Components/Button/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: <Pencil className="w-5 h-5 text-neutral-600" />,
    "aria-label": "수정하기",
  },
  argTypes: {
    children: {
      control: false,
      description: "버튼 내부에 표시될 아이콘 컴포넌트",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    "aria-label": {
      control: "text",
      description: "스크린 리더를 위한 필수 접근성 라벨",
      table: {
        type: { summary: "string" },
      },
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "버튼 크기(너비, 높이, 패딩)",
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
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Pencil className="w-5 h-5 text-neutral-600" />,
    "aria-label": "수정하기",
    size: "md",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton size="sm" aria-label="추가하기">
        <Plus className="w-4 h-4 text-neutral-600" />
      </IconButton>
      <IconButton size="md" aria-label="추가하기">
        <Plus className="w-5 h-5 text-neutral-600" />
      </IconButton>
      <IconButton size="lg" aria-label="추가하기">
        <Plus className="w-6 h-6 text-neutral-600" />
      </IconButton>
    </div>
  ),
};

export const ActionVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton aria-label="수정하기">
        <Pencil className="w-5 h-5 text-neutral-600" />
      </IconButton>
      <IconButton aria-label="공유하기">
        <Share2 className="w-5 h-5 text-neutral-600" />
      </IconButton>
      <IconButton aria-label="삭제하기">
        <Trash2 className="w-5 h-5 text-red-500" />
      </IconButton>
    </div>
  ),
};

export const LikeToggle: Story = {
  args: {
    size: "md",
  },
  render: (args) => {
    const [isLiked, setIsLiked] = useState(false);

    return (
      <div className="flex flex-col items-center gap-2">
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient
              id="mint-gradient-500"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#17DA71" />
              <stop offset="100%" stopColor="#08DDF0" />
            </linearGradient>
          </defs>
        </svg>

        <IconButton
          {...args} // Controls 패널에서 조작하는 size, disabled 등이 실시간 반영됩니다.
          size={args.size}
          aria-label={isLiked ? "좋아요 취소" : "좋아요"}
          aria-pressed={isLiked}
          onClick={() => setIsLiked((prev) => !prev)}
        >
          <Heart
            fill={isLiked ? "url(#mint-gradient-500)" : "none"}
            stroke={isLiked ? "url(#mint-gradient-500)" : "currentColor"}
            className={`w-5 h-5 transition-transform duration-200 ${
              isLiked ? "scale-110" : "scale-100"
            }`}
          />
        </IconButton>
        <span className="text-xs text-neutral-500">
          {isLiked ? "좋아요 완료" : "클릭하여 좋아요 토글"}
        </span>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    children: <Pencil className="w-5 h-5 text-neutral-600" />,
    "aria-label": "수정하기",
    size: "md",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: <Pencil className="w-5 h-5 text-neutral-600" />,
    "aria-label": "수정하기",
    size: "md",
    isLoading: true,
  },
};
