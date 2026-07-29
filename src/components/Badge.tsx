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
  "inline-flex items-center justify-center font-medium leading-none whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const baseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.25rem",
  fontWeight: 600,
  lineHeight: 1.1,
  verticalAlign: "middle",
  textAlign: "center",
  whiteSpace: "nowrap",
  userSelect: "none",
  transition: "background-color 120ms ease, color 120ms ease",
};

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  primary: {
    backgroundColor: "var(--ktn-action-primary-soft-bg, #dbeafe)",
    color: "var(--ktn-action-primary-bg)",
  },
  secondary: {
    backgroundColor: "var(--ktn-bg-muted)",
    color: "var(--ktn-text-primary)",
  },
  success: {
    backgroundColor: "var(--ktn-action-success-soft-bg, #dcfce7)",
    color: "var(--ktn-action-success-bg)",
  },
  warning: {
    backgroundColor: "var(--ktn-action-warning-soft-bg, #fef3c7)",
    color: "color-mix(in srgb, var(--ktn-action-warning-bg) 88%, #111827)",
  },
  accent: {
    backgroundColor: "var(--ktn-action-accent-soft-bg, #fce7f3)",
    color: "var(--ktn-action-accent-bg)",
  },
  destructive: {
    backgroundColor: "var(--ktn-action-danger-soft-bg, #fee2e2)",
    color: "var(--ktn-action-danger-bg)",
  },
  outline: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-bg-hover, var(--ktn-bg-muted)) 88%, transparent)",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
  ghost: {
    backgroundColor: "color-mix(in srgb, var(--ktn-bg-muted) 82%, transparent)",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
  link: {
    backgroundColor: "transparent",
    color: "var(--ktn-action-primary-bg)",
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
