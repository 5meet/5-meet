import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CompactCard from "./CompactCard";

const meta = {
  title: "Components/CompactCard",
  component: CompactCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    id: {
      control: "number",
      description: "모임 ID",
    },
    title: {
      control: "text",
      description: "모임 이름",
    },
    location: {
      control: "text",
      description: "모임 지역",
    },
    category: {
      control: "text",
      description: "모임 유형",
    },
    dateTime: {
      control: "text",
      description: "모임 일시",
    },
    registrationEnd: {
      control: "text",
      description: "모임 모집 마감일",
    },
    image: {
      control: "text",
      description: "모임 이미지 URL",
    },
    initialIsFavorited: {
      control: "boolean",
      description: "초기 찜 상태",
    },
  },
} satisfies Meta<typeof CompactCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  id: 1,
  title: "달램핏 모임",
  location: "건대입구",
  category: "달램핏",
  dateTime: "2026-09-30T14:00:00.000Z",
  registrationEnd: "2026-09-28T23:59:59.000Z",
  image: "",
  initialIsFavorited: false,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const Favorited: Story = {
  args: {
    ...defaultArgs,
    initialIsFavorited: true,
  },
};

export const LongTitle: Story = {
  args: {
    ...defaultArgs,
    title: "처음 만나는 사람들과 함께하는 즐거운 달램핏 모임",
  },
};

export const Closed: Story = {
  args: {
    ...defaultArgs,
    registrationEnd: "2026-09-20T23:59:59.000Z",
  },
};
