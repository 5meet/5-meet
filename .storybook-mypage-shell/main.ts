import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";
const config: StorybookConfig = {
  stories: [
    "../src/features/mypage/components/MyPageShell.stories.tsx",
    "../src/features/mypage/components/ProfileCard.stories.tsx",
    "../src/features/mypage/components/ProfileEditModal.stories.tsx",
    "../src/features/mypage/components/MyPageTabs.stories.tsx",
  ],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  async viteFinal(config) {
    const alias = config.resolve?.alias;
    const existing = Array.isArray(alias) ? alias : Object.entries(alias ?? {}).map(([find, replacement]) => ({ find, replacement }));
    config.resolve = { ...config.resolve, alias: [{ find: "@", replacement: fileURLToPath(new URL("../src", import.meta.url)) }, ...existing] };
    return config;
  },
};
export default config;
