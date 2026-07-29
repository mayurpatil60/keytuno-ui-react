import type { PrimitiveTokens } from "../contracts/theme-contract";

export const basePrimitiveTokens: PrimitiveTokens = {
  colors: {
    white: "#ffffff",
    black: "#000000",
    slate50: "#f7f9fc",
    slate100: "#edf3fb",
    slate300: "#c6d4e6",
    slate500: "#6b7d98",
    slate600: "#51647f",
    slate700: "#3c4f68",
    slate800: "#293b53",
    slate900: "#16263d",
    blue600: "#1d6fd9",
    teal700: "#0f9f6e",
    teal800: "#0d7c58",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
  },
  radius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    pill: "9999px",
  },
  shadow: {
    sm: "0 1px 2px rgb(15 23 42 / 0.08)",
    md: "0 6px 16px rgb(15 23 42 / 0.12)",
  },
};
