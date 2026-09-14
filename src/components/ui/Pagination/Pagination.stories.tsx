import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import Pagination from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    currentPage: {
      control: {
        type: "number",
        min: 1,
      },
      description: "현재 페이지",
    },
    totalPages: {
      control: {
        type: "number",
        min: 1,
      },
      description: "전체 페이지 수",
    },
    maxVisiblePages: {
      control: {
        type: "number",
        min: 1,
      },
      description: "한 번에 표시할 최대 페이지 수",
    },
    scrollToTop: {
      control: "boolean",
      description: "페이지 변경 시 화면을 최상단으로 스크롤할지 여부",
    },
    onPageChange: {
      action: "page changed",
      description: "페이지 변경 시 호출되는 콜백",
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    maxVisiblePages: 5,
    scrollToTop: false,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    maxVisiblePages: 5,
    scrollToTop: false,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    maxVisiblePages: 5,
    scrollToTop: false,
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    maxVisiblePages: 5,
    scrollToTop: false,
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 25,
    totalPages: 50,
    maxVisiblePages: 7,
    scrollToTop: false,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          args.onPageChange(page);
        }}
      />
    );
  },
  args: {
    currentPage: 1,
    totalPages: 20,
    maxVisiblePages: 5,
    scrollToTop: false,
  },
};
