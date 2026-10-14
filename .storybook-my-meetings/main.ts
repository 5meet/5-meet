import type { StorybookConfig } from "@storybook/nextjs-vite";

// Run this PR's stories without modifying or hiding failures in the main config.
const config: StorybookConfig = {
  stories: [
    "../src/components/ui/DetailCard/DetailCard.stories.tsx",
    "../src/features/mypage/my-meetings/components/MyMeetingsView.stories.tsx",
  ],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
};
export default config;
