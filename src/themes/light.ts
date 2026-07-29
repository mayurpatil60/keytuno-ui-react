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
      backgroundDefault: "#f8fbff",
      backgroundSurface: "#ffffff",
      backgroundMuted: "#eff4ff",
      backgroundHover: "#e2ecff",
      backgroundSelected: "#dbeafe",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      borderMuted: "#cbd5e1",
      borderStrong: "#94a3b8",
      actionPrimaryBackground: "#1d4ed8",
      actionPrimaryForeground: "#ffffff",
      actionPrimarySoftBackground: "#dbeafe",
      actionSuccessBackground: "#15803d",
      actionSuccessForeground: "#ffffff",
      actionSuccessSoftBackground: "#dcfce7",
      actionWarningBackground: "#b45309",
      actionWarningForeground: "#ffffff",
      actionWarningSoftBackground: "#fef3c7",
      actionAccentBackground: "#be185d",
      actionAccentForeground: "#ffffff",
      actionAccentSoftBackground: "#fce7f3",
      actionDangerBackground: "#b91c1c",
      actionDangerForeground: "#ffffff",
      actionDangerSoftBackground: "#fee2e2",
      buttonDefaultBackground: "#edf2f7",
      buttonDefaultForeground: "#1f2937",
      buttonDefaultBorder: "#d2dce8",
      buttonPrimaryBackground: "#2563eb",
      buttonPrimaryForeground: "#ffffff",
      buttonSuccessBackground: "#16a34a",
      buttonSuccessForeground: "#ffffff",
      buttonWarningBackground: "#f59e0b",
      buttonWarningForeground: "#ffffff",
      buttonAccentBackground: "#db2777",
      buttonAccentForeground: "#ffffff",
      buttonDestructiveBackground: "#ef4444",
      buttonDestructiveForeground: "#ffffff",
    }),
  },
};
