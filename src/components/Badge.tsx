import type {
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "accent"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";
export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  onAction?: (event: ReactMouseEvent<HTMLSpanElement>) => void;
}

const baseClasses =
  "inline-flex items-center justify-center border font-medium leading-none whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const baseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.25rem",
  borderWidth: "1px",
  borderStyle: "solid",
  fontWeight: 600,
  lineHeight: 1.1,
  verticalAlign: "middle",
  textAlign: "center",
  whiteSpace: "nowrap",
  userSelect: "none",
  transition:
    "background-color 120ms ease, color 120ms ease, border-color 120ms ease",
};

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  primary: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 16%, white)",
    color: "color-mix(in srgb, var(--ktn-action-primary-bg) 88%, black)",
    borderColor: "color-mix(in srgb, var(--ktn-action-primary-bg) 30%, white)",
  },
  secondary: {
    backgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.12))",
    color: "var(--ktn-text-primary)",
    borderColor: "var(--ktn-border-muted)",
  },
  success: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-success-bg, #15803d) 14%, white)",
    color:
      "color-mix(in srgb, var(--ktn-action-success-bg, #15803d) 88%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-success-bg, #15803d) 28%, white)",
  },
  warning: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #ca8a04) 16%, white)",
    color:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #ca8a04) 90%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #ca8a04) 30%, white)",
  },
  accent: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-accent-bg, #7c3aed) 14%, white)",
    color:
      "color-mix(in srgb, var(--ktn-action-accent-bg, #7c3aed) 88%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-accent-bg, #7c3aed) 28%, white)",
  },
  destructive: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 14%, white)",
    color:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 88%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 28%, white)",
  },
  outline: {
    backgroundColor: "transparent",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    borderColor: "var(--ktn-border-muted)",
  },
  ghost: {
    backgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    borderColor: "transparent",
  },
  link: {
    backgroundColor: "transparent",
    color: "var(--ktn-action-primary-bg)",
    borderColor: "transparent",
    borderWidth: 0,
    textDecoration: "underline",
    textUnderlineOffset: "0.12em",
  },
};

const sizeStyles: Record<BadgeSize, CSSProperties> = {
  xs: {
    height: "0.95rem",
    paddingInline: "0.25rem",
    paddingBlock: 0,
    fontSize: "0.625rem",
    borderRadius: "999px",
  },
  sm: {
    height: "1.1rem",
    paddingInline: "0.3125rem",
    paddingBlock: 0,
    fontSize: "0.6875rem",
    borderRadius: "999px",
  },
  md: {
    height: "1.25rem",
    paddingInline: "0.375rem",
    paddingBlock: 0,
    fontSize: "0.75rem",
    borderRadius: "999px",
  },
  lg: {
    height: "1.4rem",
    paddingInline: "0.5rem",
    paddingBlock: 0,
    fontSize: "0.8125rem",
    borderRadius: "999px",
  },
};

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node
      .map((child) => getTextContent(child))
      .join(" ")
      .trim();
  }

  return "";
}

export function Badge({
  children,
  variant,
  size = "md",
  onAction,
  className = "",
  style,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: BadgeProps): JSX.Element {
  const resolvedVariant = variant ?? "primary";
  const isActionable = onAction != null || onClick != null;
  const fallbackAriaLabel = getTextContent(children).trim();
  const resolvedAriaLabel =
    ariaLabel ??
    (ariaLabelledBy == null && isActionable && fallbackAriaLabel !== ""
      ? fallbackAriaLabel
      : undefined);
  const resolvedRole = role ?? (isActionable ? "button" : undefined);
  const resolvedTabIndex = tabIndex ?? (isActionable ? 0 : undefined);

  const composedClassName = `${baseClasses} ${className}`.trim();
  const composedStyle: CSSProperties = {
    ...baseStyle,
    ...variantStyles[resolvedVariant],
    ...sizeStyles[size],
    ...(isActionable ? { cursor: "pointer" } : {}),
    ...style,
  };

  function handleClick(event: ReactMouseEvent<HTMLSpanElement>): void {
    onAction?.(event);
    onClick?.(event);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLSpanElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || !isActionable) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  const resolvedOnClick = isActionable ? handleClick : onClick;

  return (
    <span
      className={composedClassName}
      style={composedStyle}
      role={resolvedRole}
      tabIndex={resolvedTabIndex}
      aria-label={resolvedAriaLabel}
      aria-labelledby={ariaLabelledBy}
      onClick={resolvedOnClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </span>
  );
}
