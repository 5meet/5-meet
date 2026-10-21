import type { StorybookConfig } from "@storybook/nextjs-vite";
const config: StorybookConfig = {
  stories: [
    "../src/components/ui/DetailCard/DetailCard.stories.tsx",
    "../src/features/mypage/my-meetings/components/*.stories.tsx",
    "../src/features/mypage/created-meetings/components/*.stories.tsx",
  ],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
};
export default config;
