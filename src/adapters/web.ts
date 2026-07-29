import type { ThemeContract } from "../contracts/theme-contract";

export type CssVariableMap = Record<string, string>;

export function themeToCssVariables(theme: ThemeContract): CssVariableMap {
  const colors = theme.semantic.colors;
  const spacing = theme.primitives.spacing;
  const radius = theme.primitives.radius;
  const shadow = theme.primitives.shadow;

  return {
    "--ktn-bg-default": colors.backgroundDefault,
    "--ktn-bg-surface": colors.backgroundSurface,
    "--ktn-bg-muted": colors.backgroundMuted,
    "--ktn-text-primary": colors.textPrimary,
    "--ktn-text-secondary": colors.textSecondary,
    "--ktn-border-muted": colors.borderMuted,
    "--ktn-action-primary-bg": colors.actionPrimaryBackground,
    "--ktn-action-primary-fg": colors.actionPrimaryForeground,
    "--ktn-action-success-bg": colors.actionSuccessBackground,
    "--ktn-action-success-fg": colors.actionSuccessForeground,
    "--ktn-action-warning-bg": colors.actionWarningBackground,
    "--ktn-action-warning-fg": colors.actionWarningForeground,
    "--ktn-action-accent-bg": colors.actionAccentBackground,
    "--ktn-action-accent-fg": colors.actionAccentForeground,
    "--ktn-space-xs": spacing.xs,
    "--ktn-space-sm": spacing.sm,
    "--ktn-space-md": spacing.md,
    "--ktn-space-lg": spacing.lg,
    "--ktn-space-xl": spacing.xl,
    "--ktn-radius-sm": radius.sm,
    "--ktn-radius-md": radius.md,
    "--ktn-radius-lg": radius.lg,
    "--ktn-radius-pill": radius.pill,
    "--ktn-shadow-sm": shadow.sm,
    "--ktn-shadow-md": shadow.md,
  };
}

export function selectorToCssBlock(
  selector: string,
  variables: CssVariableMap,
): string {
  const body = Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `${selector} {\n${body}\n}`;
}
