import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import CreatedMeetingsView from "./CreatedMeetingsView";
import type { CreatedMeeting } from "../types";

const meetings: CreatedMeeting[] = [1, 2].map((id) => ({
  id, teamId: "storybook", name: id === 1 ? "힐링 오피스 스트레칭" : "작은 독서 습관 만들기",
  type: "스터디", region: "강남구", capacity: 20, participantCount: 20,
  image: "/meetings-hero.jpg", canceledAt: null, confirmedAt: null,
  hostId: 7, createdBy: 7, host: { id: 7, name: "주최자", image: null },
  isCompleted: false, dateTime: "2099-11-17T08:30:00.000Z", isFavorited: id === 1, role: "host",
}));
const meta = {
  title: "Features/Mypage/CreatedMeetingsView",
  component: CreatedMeetingsView,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CreatedMeetingsView>;
export default meta;
type Story = StoryObj<typeof meta>;
const success = { status: "success" as const, meetings, onFavorite: fn() };
export const Large: Story = { args: success, decorators: [(Story) => <div style={{ maxWidth: 958 }}><Story /></div>] };
export const Medium: Story = { args: success, decorators: [(Story) => <div style={{ maxWidth: 696 }}><Story /></div>] };
export const Small: Story = { args: success, decorators: [(Story) => <div style={{ maxWidth: 343 }}><Story /></div>] };
export const Empty: Story = { args: { status: "success", meetings: [] } };
export const Loading: Story = { args: { status: "loading" } };
export const Error: Story = { args: { status: "error", onRetry: fn() } };
export const FavoritePending: Story = { args: { ...success, favoritePending: true } };
export const MissingDateAndLongTitle: Story = { args: { ...success, meetings: [{ ...meetings[0], dateTime: null, name: "아주 긴 모임 이름도 잘리지 않고 확인할 수 있는 내가 만든 모임 목록" }] } };
