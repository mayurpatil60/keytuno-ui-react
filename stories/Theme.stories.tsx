import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { themeNames, themeSubthemeModes } from "@keytuno/ui-react";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@keytuno/ui-react";

const meta: Meta = {
  title: "Themes/Overview",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

type ThemeTokenPreview = {
  label: string;
  cssVariable: string;
  fallback: string;
  previewType: "background" | "text";
};

const tokenPreviews: ThemeTokenPreview[] = [
  {
    label: "Background Default",
    cssVariable: "--ktn-bg-default",
    fallback: "#f8fafc",
    previewType: "background",
  },
  {
    label: "Background Surface",
    cssVariable: "--ktn-bg-surface",
    fallback: "#ffffff",
    previewType: "background",
  },
  {
    label: "Background Muted",
    cssVariable: "--ktn-bg-muted",
    fallback: "#e2e8f0",
    previewType: "background",
  },
  {
    label: "Text Primary",
    cssVariable: "--ktn-text-primary",
    fallback: "#0f172a",
    previewType: "text",
  },
  {
    label: "Text Secondary",
    cssVariable: "--ktn-text-secondary",
    fallback: "#475569",
    previewType: "text",
  },
  {
    label: "Border Muted",
    cssVariable: "--ktn-border-muted",
    fallback: "#cbd5e1",
    previewType: "background",
  },
  {
    label: "Action Primary BG",
    cssVariable: "--ktn-action-primary-bg",
    fallback: "#2563eb",
    previewType: "background",
  },
  {
    label: "Action Primary FG",
    cssVariable: "--ktn-action-primary-fg",
    fallback: "#ffffff",
    previewType: "text",
  },
];

const rootStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.9rem",
  width: "min(920px, 94vw)",
};

const tokenGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "0.65rem",
};

export const ThemeTokens: Story = {
  name: "Theme Tokens",
  render: () => (
    <div style={rootStyle}>
      <Card>
        <CardHeader>
          <CardTitle>Theme Controls</CardTitle>
          <CardDescription>
            Use the Storybook toolbar to switch Theme and Theme Mode globally.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {themeNames.map((name) => (
              <Badge key={name} variant="secondary">
                theme: {name}
              </Badge>
            ))}

            {themeSubthemeModes.map((mode) => (
              <Badge key={mode} variant="outline">
                mode: {mode}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div style={tokenGridStyle}>
        {tokenPreviews.map((token) => (
          <div
            key={token.cssVariable}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              padding: "0.65rem",
              border: "1px solid var(--ktn-border-muted)",
              borderRadius: "var(--ktn-radius-md, 0.5rem)",
              backgroundColor: "var(--ktn-bg-surface, #ffffff)",
            }}
          >
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
              }}
            >
              {token.label}
            </span>

            <div
              style={{
                height: "2.25rem",
                borderRadius: "var(--ktn-radius-sm, 0.375rem)",
                border: "1px solid var(--ktn-border-muted)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  token.previewType === "background"
                    ? `var(${token.cssVariable}, ${token.fallback})`
                    : "var(--ktn-bg-default, #f8fafc)",
                color:
                  token.previewType === "text"
                    ? `var(${token.cssVariable}, ${token.fallback})`
                    : "var(--ktn-text-primary, #0f172a)",
                fontSize: "0.78rem",
              }}
            >
              Aa
            </div>

            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
              }}
            >
              {token.cssVariable}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
