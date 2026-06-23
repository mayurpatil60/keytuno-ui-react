import type { Preview } from "@storybook/react";
import {
  resolveTheme,
  themeNames,
  themeSubthemeModes,
  themeToCssVariables,
  type ThemeMode,
  type ThemeName,
} from "@keytuno/ui-react";

import "./tailwind.css";

function applyThemeToDocument(themeName: ThemeName, mode: ThemeMode): void {
  if (typeof document === "undefined") {
    return;
  }

  const variables = themeToCssVariables(resolveTheme(themeName, mode));
  const root = document.documentElement;

  Object.entries(variables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for all stories",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: themeNames,
      },
    },
    themeMode: {
      name: "Theme Mode",
      description: "Subtheme mode for all stories",
      defaultValue: "default",
      toolbar: {
        icon: "circlehollow",
        items: themeSubthemeModes,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const selectedTheme = (context.globals.theme ?? "light") as ThemeName;
      const selectedMode = (context.globals.themeMode ??
        "default") as ThemeMode;
      applyThemeToDocument(selectedTheme, selectedMode);
      return Story();
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ["Component", "Icons", "Theme"],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
};

export default preview;
