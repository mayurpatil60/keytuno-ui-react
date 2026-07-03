import {
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
} from "react";

export type SeparatorSize = "xs" | "sm" | "md" | "lg";
export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorActionSource = "click" | "focus" | "blur";

export interface SeparatorActionContext {
  source: SeparatorActionSource;
  orientation: SeparatorOrientation;
  size: SeparatorSize;
  decorative: boolean;
  event?: unknown;
}

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  size?: SeparatorSize;
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  onAction?: (context: SeparatorActionContext) => void;
}

type SeparatorSizeTokens = {
  thickness: string;
  minLength: string;
  /** Default height for a vertical separator so it centres naturally in flex rows. */
  length: string;
};

const sizeTokens: Record<SeparatorSize, SeparatorSizeTokens> = {
  xs: {
    thickness: "1px",
    minLength: "0.9rem",
    length: "1rem",
  },
  sm: {
    thickness: "1.5px",
    minLength: "1.1rem",
    length: "1.25rem",
  },
  md: {
    thickness: "2px",
    minLength: "1.35rem",
    length: "1.5rem",
  },
  lg: {
    thickness: "3px",
    minLength: "1.7rem",
    length: "1.8rem",
  },
};

const baseClasses = "shrink-0";

export function Separator({
  size = "md",
  orientation = "horizontal",
  decorative = true,
  onAction,
  className = "",
  style,
  onClick,
  onFocus,
  onBlur,
  ...props
}: SeparatorProps): JSX.Element {
  const tokens = sizeTokens[size];
  const separatorColor =
    "var(--ktn-separator-color, color-mix(in srgb, var(--ktn-border-muted, #d4dce6) 88%, var(--ktn-bg-default, #ffffff) 12%))";

  const separatorStyle: CSSProperties = {
    borderRadius: "999px",
    backgroundColor: separatorColor,
    flexShrink: 0,
    ...(orientation === "vertical"
      ? {
          width: tokens.thickness,
          minWidth: tokens.thickness,
          height: tokens.length,
          minHeight: tokens.minLength,
          alignSelf: "center" as const,
        }
      : {
          width: "100%",
          minWidth: tokens.minLength,
          height: tokens.thickness,
          minHeight: tokens.thickness,
        }),
    ...style,
  };

  function emitAction(source: SeparatorActionSource, event: unknown): void {
    onAction?.({
      source,
      orientation,
      size,
      decorative,
      event,
    });
  }

  function handleClick(event: MouseEvent<HTMLDivElement>): void {
    onClick?.(event);

    if (!event.defaultPrevented) {
      emitAction("click", event);
    }
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>): void {
    onFocus?.(event);

    if (!event.defaultPrevented) {
      emitAction("focus", event);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    onBlur?.(event);

    if (!event.defaultPrevented) {
      emitAction("blur", event);
    }
  }

  return (
    <div
      role={decorative ? "presentation" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      aria-hidden={decorative ? true : undefined}
      className={`${baseClasses} ${className}`.trim()}
      style={separatorStyle}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}
