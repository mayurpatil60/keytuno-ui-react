type ThemeName = "dark" | "light";
type ThemeMode = "default";
interface PrimitiveColorTokens {
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
interface PrimitiveSpacingTokens {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
}
interface PrimitiveRadiusTokens {
    sm: string;
    md: string;
    lg: string;
    pill: string;
}
interface PrimitiveShadowTokens {
    sm: string;
    md: string;
}
interface PrimitiveTokens {
    colors: PrimitiveColorTokens;
    spacing: PrimitiveSpacingTokens;
    radius: PrimitiveRadiusTokens;
    shadow: PrimitiveShadowTokens;
}
interface SemanticColorTokens {
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
interface SemanticTokens {
    colors: SemanticColorTokens;
}
interface ThemeContract {
    name: ThemeName;
    mode: ThemeMode;
    primitives: PrimitiveTokens;
    semantic: SemanticTokens;
}

export type { PrimitiveColorTokens, PrimitiveRadiusTokens, PrimitiveShadowTokens, PrimitiveSpacingTokens, PrimitiveTokens, SemanticColorTokens, SemanticTokens, ThemeContract, ThemeMode, ThemeName };
