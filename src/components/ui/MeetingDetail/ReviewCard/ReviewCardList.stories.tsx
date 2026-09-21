import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReviewCardList from "./ReviewCardList";
import type { Review } from "./ReviewCard";

const meta = {
  title: "Components/MeetingDetail/ReviewCard/ReviewCardList",
  component: ReviewCardList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    reviews: {
      control: "object",
      description: "리뷰 목록",
    },
  },
} satisfies Meta<typeof ReviewCardList>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultReviews: Review[] = [
  // {
  //   user: {
  //     id: "1",
  //     name: "김영희",
  //     image: "/profile/profile_female1.svg",
  //   },
  //   score: 5,
  //   comment: "친절하고 편안한 분위기에서 즐겁게 참여했습니다.",
  //   datetime: "2026.09.21",
  // },
  // {
  //   user: {
  //     id: "2",
  //     name: "이서준",
  //     image: "/profile/profile_male.svg",
  //   },
  //   score: 4,
  //   comment: "진행도 원활했고 다른 참여자분들도 친절했습니다.",
  //   datetime: "2026.09.20",
  // },
  // {
  //   user: {
  //     id: "3",
  //     name: "박지민",
  //     image: null,
  //   },
  //   score: 5,
  //   comment: "다음에도 기회가 된다면 다시 참여하고 싶어요.",
  //   datetime: "2026.09.19",
  // },
  // {
  //   user: {
  //     id: "4",
  //     name: "최유진",
  //     image: "/profile/profile_female2.svg",
  //   },
  //   score: 3,
  //   comment: "전체적으로 만족스러운 모임이었습니다.",
  //   datetime: "2026.09.18",
  // },
];

export const Default: Story = {
  args: {
    reviews: defaultReviews,
  },
};

export const OneReview: Story = {
  args: {
    reviews: defaultReviews.slice(0, 1),
  },
};

export const FourReviews: Story = {
  args: {
    reviews: defaultReviews,
  },
};

export const MoreThanFourReviews: Story = {
  args: {
    reviews: [
      ...defaultReviews,
      {
        user: {
          id: "5",
          name: "정하늘",
          image: null,
        },
        score: 4,
        comment: "좋은 사람들과 함께해서 즐거웠습니다.",
        datetime: "2026.09.17",
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    reviews: [],
  },
};
