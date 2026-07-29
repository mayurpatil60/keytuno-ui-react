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
  backgroundHover: string;
  backgroundSelected: string;
  textPrimary: string;
  textSecondary: string;
  borderMuted: string;
  borderStrong: string;
  actionPrimaryBackground: string;
  actionPrimaryForeground: string;
  actionPrimarySoftBackground: string;
  actionSuccessBackground: string;
  actionSuccessForeground: string;
  actionSuccessSoftBackground: string;
  actionWarningBackground: string;
  actionWarningForeground: string;
  actionWarningSoftBackground: string;
  actionAccentBackground: string;
  actionAccentForeground: string;
  actionAccentSoftBackground: string;
  actionDangerBackground: string;
  actionDangerForeground: string;
  actionDangerSoftBackground: string;
  buttonDefaultBackground: string;
  buttonDefaultForeground: string;
  buttonDefaultBorder: string;
  buttonPrimaryBackground: string;
  buttonPrimaryForeground: string;
  buttonSuccessBackground: string;
  buttonSuccessForeground: string;
  buttonWarningBackground: string;
  buttonWarningForeground: string;
  buttonAccentBackground: string;
  buttonAccentForeground: string;
  buttonDestructiveBackground: string;
  buttonDestructiveForeground: string;
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
