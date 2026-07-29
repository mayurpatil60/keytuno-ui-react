export type ThemeName = "dark" | "light";

export type ThemeMode = "default";

export interface PrimitiveColorTokens {
  white: string;
  black: string;
  slate50: string;
  slate100: string;
  slate300: string;
  slate500: string;
  slate600: string;
  slate700: string;
  slate800: string;
  slate900: string;
  blue600: string;
  teal700: string;
  teal800: string;
}

export interface PrimitiveSpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface PrimitiveRadiusTokens {
  sm: string;
  md: string;
  lg: string;
  pill: string;
}

export interface PrimitiveShadowTokens {
  sm: string;
  md: string;
}

export interface PrimitiveTokens {
  colors: PrimitiveColorTokens;
  spacing: PrimitiveSpacingTokens;
  radius: PrimitiveRadiusTokens;
  shadow: PrimitiveShadowTokens;
}

export interface SemanticColorTokens {
  backgroundDefault: string;
  backgroundSurface: string;
  backgroundMuted: string;
  textPrimary: string;
  textSecondary: string;
  borderMuted: string;
  actionPrimaryBackground: string;
  actionPrimaryForeground: string;
  actionSuccessBackground: string;
  actionSuccessForeground: string;
  actionWarningBackground: string;
  actionWarningForeground: string;
  actionAccentBackground: string;
  actionAccentForeground: string;
}

export interface SemanticTokens {
  colors: SemanticColorTokens;
}

export interface ThemeContract {
  name: ThemeName;
  mode: ThemeMode;
  primitives: PrimitiveTokens;
  semantic: SemanticTokens;
}
