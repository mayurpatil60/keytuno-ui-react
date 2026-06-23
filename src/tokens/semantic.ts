import type { PrimitiveColorTokens, SemanticColorTokens } from '../contracts/theme-contract';

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
    ...overrides,
  };
}
