import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import type { User } from "@/features/auth/type";
import MyPageShell from "./MyPageShell";
import MyPageProfileView from "./MyPageProfileView";

const user: User = {
  id: 7, teamId: "storybook", name: "프로필 사용자", email: "profile@example.invalid",
  image: "/profile/profile_male.svg", companyName: null,
  createdAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z",
};
const content = <div aria-label="탭 본문" className="min-h-60 rounded-3xl bg-white p-6">각 탭의 기존 본문이 들어가는 영역입니다.</div>;
const meta = {
  title: "Features/Mypage/MyPageShell",
  component: MyPageShell,
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true, navigation: { pathname: "/mypage/meetings" } } },
  args: { profile: <MyPageProfileView status="success" user={user} />, children: content },
} satisfies Meta<typeof MyPageShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Desktop: Story = {};
export const Tablet: Story = {};
export const Mobile: Story = {};
export const Loading: Story = { args: { profile: <MyPageProfileView status="loading" /> } };
export const Error: Story = { args: { profile: <MyPageProfileView status="error" onRetry={fn()} /> } };
export const SignedOut: Story = { args: { profile: <MyPageProfileView status="signed-out" /> } };
export const MissingImage: Story = { args: { profile: <MyPageProfileView status="success" user={{ ...user, image: null }} /> } };
export const LongIdentity: Story = { args: { profile: <MyPageProfileView status="success" user={{ ...user, name: "길이가아주긴프로필사용자이름입니다", email: "very-long-profile-address-for-layout-check@example.invalid" }} /> } };
