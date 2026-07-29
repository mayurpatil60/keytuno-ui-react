import type {
  PrimitiveTokens,
  ThemeContract,
} from "../contracts/theme-contract";
import { basePrimitiveTokens } from "../tokens/primitives";
import { createSemanticColors } from "../tokens/semantic";

const lightPrimitives: PrimitiveTokens = {
  ...basePrimitiveTokens,
};

export const lightTheme: ThemeContract = {
  name: "light",
  mode: "default",
  primitives: lightPrimitives,
  semantic: {
    colors: createSemanticColors(lightPrimitives.colors, {
      backgroundDefault: "#fbfcfd",
      backgroundSurface: "#f5f7fb",
      backgroundMuted: "#edf2f7",
      textPrimary: "#0f172a",
      textSecondary: "#4b5563",
      borderMuted: "#d4dce6",
      actionPrimaryBackground: "#0e639c",
      actionPrimaryForeground: "#ffffff",
      actionSuccessBackground: "#15803d",
      actionSuccessForeground: "#ffffff",
      actionWarningBackground: "#ca8a04",
      actionWarningForeground: "#111827",
      actionAccentBackground: "#7c3aed",
      actionAccentForeground: "#ffffff",
    }),
  },
};
