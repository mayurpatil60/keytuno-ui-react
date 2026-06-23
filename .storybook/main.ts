import { resolve } from "node:path";

import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(baseConfig) {
    const existingAlias =
      baseConfig.resolve?.alias && !Array.isArray(baseConfig.resolve.alias)
        ? baseConfig.resolve.alias
        : {};

    return {
      ...baseConfig,
      resolve: {
        ...baseConfig.resolve,
        alias: {
          ...existingAlias,
          "@keytuno/ui-react": resolve(__dirname, "../src"),
          "@keytuno/themes": resolve(__dirname, "../src"),
        },
      },
    };
  },
};

export default config;
