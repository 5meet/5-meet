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
    variant: {
      control: "select",
      options: ["meeting", "talk"],
      description: "카드 사용처",
    },
    id: {
      control: "number",
      description: "콘텐츠 ID",
    },
    title: {
      control: "text",
      description: "카드 제목",
    },
    image: {
      control: "text",
      description: "카드 이미지 URL",
    },

    // meeting
    location: {
      control: "text",
      description: "모임 지역",
      if: {
        arg: "variant",
        eq: "meeting",
      },
    },
    category: {
      control: "text",
      description: "모임 유형",
      if: {
        arg: "variant",
        eq: "meeting",
      },
    },
    dateTime: {
      control: "text",
      description: "모임 일시",
      if: {
        arg: "variant",
        eq: "meeting",
      },
    },
    registrationEnd: {
      control: "text",
      description: "모임 모집 마감일",
      if: {
        arg: "variant",
        eq: "meeting",
      },
    },
    initialIsFavorited: {
      control: "boolean",
      description: "초기 찜 상태",
      if: {
        arg: "variant",
        eq: "meeting",
      },
    },

    // talk
    createdAt: {
      control: "text",
      description: "게시글 작성 시간",
      if: {
        arg: "variant",
        eq: "talk",
      },
    },
    likeCount: {
      control: "number",
      description: "좋아요 수",
      if: {
        arg: "variant",
        eq: "talk",
      },
    },
    commentCount: {
      control: "number",
      description: "댓글 수",
      if: {
        arg: "variant",
        eq: "talk",
      },
    },
  },
} satisfies Meta<typeof CompactCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const meetingArgs = {
  variant: "meeting" as const,
  id: 1,
  title: "달램핏 모임",
  location: "건대입구",
  category: "달램핏",
  dateTime: "2026-09-30T14:00:00.000Z",
  registrationEnd: "2026-09-28T23:59:59.000Z",
  image: "",
  initialIsFavorited: false,
};

const talkArgs = {
  variant: "talk" as const,
  id: 1,
  title: "새로운 모임에 참여해 보세요!",
  image: "",
  createdAt: "3시간 전",
  likeCount: 12,
  commentCount: 4,
};

/* -------------------- Meeting -------------------- */

export const Meeting: Story = {
  args: meetingArgs,
};

export const MeetingFavorited: Story = {
  args: {
    ...meetingArgs,
    initialIsFavorited: true,
  },
};

export const MeetingLongTitle: Story = {
  args: {
    ...meetingArgs,
    title: "처음 만나는 사람들과 함께하는 즐거운 달램핏 모임",
  },
};

export const MeetingClosed: Story = {
  args: {
    ...meetingArgs,
    registrationEnd: "2026-09-20T23:59:59.000Z",
  },
};

/* -------------------- Talk -------------------- */

export const Talk: Story = {
  args: talkArgs,
};

export const TalkLongTitle: Story = {
  args: {
    ...talkArgs,
    title:
      "처음 만나는 사람들과 함께 새로운 이야기를 나누는 달램 토크 모임입니다",
  },
};

export const TalkManyReactions: Story = {
  args: {
    ...talkArgs,
    likeCount: 128,
    commentCount: 56,
  },
};
