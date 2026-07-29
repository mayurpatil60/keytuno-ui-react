import type {
  PrimitiveColorTokens,
  SemanticColorTokens,
} from "../contracts/theme-contract";

export function createSemanticColors(
  palette: PrimitiveColorTokens,
  overrides: Partial<SemanticColorTokens> = {},
): SemanticColorTokens {
  return {
    backgroundDefault: palette.white,
    backgroundSurface: palette.slate50,
    backgroundMuted: palette.slate100,
    textPrimary: palette.slate900,
    textSecondary: palette.slate600,
    borderMuted: palette.slate300,
    actionPrimaryBackground: palette.teal700,
    actionPrimaryForeground: palette.white,
    actionSuccessBackground: "#15803d",
    actionSuccessForeground: palette.white,
    actionWarningBackground: "#ca8a04",
    actionWarningForeground: palette.slate900,
    actionAccentBackground: "#7c3aed",
    actionAccentForeground: palette.white,
    ...overrides,
  };
}
