import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Meetballs from "./Meetballs";

const meta = {
  title: "Components/Meetballs",
  component: Meetballs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onEdit: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof Meetballs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
