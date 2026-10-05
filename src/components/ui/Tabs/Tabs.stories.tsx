import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Tabs } from "./Tabs";

const tabs = [
  { label: "탭1", value: "info" },
  { label: "탭2", value: "reviews" },
  { label: "탭3", value: "participants" },
];

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    tabs,
    activeTab: "info",
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    return (
      <div className="w-full">
        <Tabs {...args} activeTab={activeTab} onChange={setActiveTab} />
      </div>
    );
  },
};

export const FirstTabActive: Story = {
  args: {
    activeTab: "info",
  },
};

export const SecondTabActive: Story = {
  args: {
    activeTab: "reviews",
  },
};

export const ThirdTabActive: Story = {
  args: {
    activeTab: "participants",
  },
};
