import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { Badge, type BadgeSize, type BadgeVariant } from "./Badge";

export const toastVariants = [
  "default",
  "success",
  "warning",
  "accent",
  "danger",
] as const;
export type ToastVariant = (typeof toastVariants)[number];

export const toastSizes = ["xs", "sm", "md"] as const;
export type ToastSize = (typeof toastSizes)[number];

export type ToastActionSource = "open" | "open-change" | "auto-close";

export interface ToastActionContext {
  source: ToastActionSource;
  open: boolean;
  variant: ToastVariant;
  size: ToastSize;
  duration: number;
  event?: unknown;
}

export interface ToastProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (context: ToastActionContext) => void;
  variant?: ToastVariant;
  size?: ToastSize;
  duration?: number;
  bottomOffset?: number;
  bordered?: boolean;
  contentStyle?: CSSProperties;
}

type ToastSizeTokens = {
  minHeight: string;
  paddingInline: string;
  paddingBlock: string;
  fontSize: string;
};

const TOAST_ENTER_MS = 140;
const TOAST_EXIT_MS = 120;

const sizeTokens: Record<ToastSize, ToastSizeTokens> = {
  xs: {
    minHeight: "1.8rem",
    paddingInline: "0.65rem",
    paddingBlock: "0.24rem",
    fontSize: "0.72rem",
  },
  sm: {
    minHeight: "2rem",
    paddingInline: "0.8rem",
    paddingBlock: "0.3rem",
    fontSize: "0.8rem",
  },
  md: {
    minHeight: "2.2rem",
    paddingInline: "0.95rem",
    paddingBlock: "0.38rem",
    fontSize: "0.86rem",
  },
};

const badgeVariantByToastVariant: Record<ToastVariant, BadgeVariant> = {
  default: "secondary",
  success: "primary",
  warning: "outline",
  accent: "accent",
  danger: "destructive",
};

const badgeSizeByToastSize: Record<ToastSize, BadgeSize> = {
  xs: "xs",
  sm: "sm",
  md: "md",
};

const surfaceStyleByVariant: Record<ToastVariant, CSSProperties> = {
  default: {
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
    borderColor: "var(--ktn-border-muted)",
  },
  success: {
    backgroundColor: "var(--ktn-action-success-soft-bg, #dcfce7)",
    color: "var(--ktn-action-success-bg, #15803d)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-success-bg, #15803d) 28%, var(--ktn-border-muted))",
  },
  warning: {
    backgroundColor: "var(--ktn-action-warning-soft-bg, #fef3c7)",
    color:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #b45309) 90%, #111827)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #b45309) 28%, var(--ktn-border-muted))",
  },
  accent: {
    backgroundColor: "var(--ktn-action-accent-soft-bg, #fce7f3)",
    color: "var(--ktn-action-accent-bg, #be185d)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-accent-bg, #be185d) 26%, var(--ktn-border-muted))",
  },
  danger: {
    backgroundColor: "var(--ktn-action-danger-soft-bg, #fee2e2)",
    color: "var(--ktn-action-danger-bg, #b91c1c)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #b91c1c) 28%, var(--ktn-border-muted))",
  },
};

const containerBaseStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  pointerEvents: "none",
  zIndex: 2200,
  width: "max-content",
  maxWidth: "min(92vw, 28rem)",
};

const badgeBaseStyle: CSSProperties = {
  height: "auto",
  borderRadius: "999px",
  lineHeight: 1.2,
  textAlign: "center",
  whiteSpace: "normal",
  maxWidth: "100%",
  boxShadow: "0 12px 26px rgba(15, 23, 42, 0.2)",
  pointerEvents: "auto",
};

function resolveVariant(variant: ToastVariant | undefined): ToastVariant {
  if (variant != null) {
    return variant;
  }

  return "default";
}

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

export function Toast({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  onAction,
  variant,
  size = "sm",
  duration = 1000,
  bottomOffset = 20,
  bordered = true,
  className = "",
  style,
  contentStyle,
  role,
  ["aria-label"]: ariaLabel,
  ["aria-live"]: ariaLive,
  ["aria-atomic"]: ariaAtomic,
  ...props
}: ToastProps): JSX.Element | null {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpen === true,
  );
  const resolvedOpen = isControlled ? open === true : uncontrolledOpen;
  const [isRendered, setIsRendered] = useState(resolvedOpen);
  const [isVisible, setIsVisible] = useState(resolvedOpen);
  const previousOpenRef = useRef(resolvedOpen);
  const transitionSourceRef = useRef<ToastActionSource | null>(null);

  const resolvedVariant = resolveVariant(variant);
  const resolvedSize = size;
  const normalizedDuration = Math.max(Math.round(duration), 0);
  const normalizedBottomOffset = Number.isFinite(bottomOffset)
    ? bottomOffset
    : 20;

  const emitAction = useCallback(
    (
      source: ToastActionSource,
      openOverride?: boolean,
      event?: unknown,
    ): void => {
      onAction?.({
        source,
        open: openOverride ?? resolvedOpen,
        variant: resolvedVariant,
        size: resolvedSize,
        duration: normalizedDuration,
        event,
      });
    },
    [onAction, resolvedOpen, resolvedSize, resolvedVariant, normalizedDuration],
  );

  const setToastOpen = useCallback(
    (
      nextOpen: boolean,
      source: ToastActionSource = "open-change",
      event?: unknown,
    ): void => {
      if (nextOpen === resolvedOpen) {
        return;
      }

      transitionSourceRef.current = source;

      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
      emitAction(source, nextOpen, event);
    },
    [emitAction, isControlled, onOpenChange, resolvedOpen],
  );

  useEffect(() => {
    if (resolvedOpen) {
      setIsRendered(true);

      if (typeof window === "undefined") {
        setIsVisible(true);
        return;
      }

      const frameId = window.requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    }

    setIsVisible(false);

    const timeoutId = window.setTimeout(() => {
      setIsRendered(false);
    }, TOAST_EXIT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [resolvedOpen]);

  useEffect(() => {
    if (previousOpenRef.current === resolvedOpen) {
      return;
    }

    previousOpenRef.current = resolvedOpen;

    if (transitionSourceRef.current != null) {
      transitionSourceRef.current = null;
      return;
    }

    emitAction(resolvedOpen ? "open" : "open-change", resolvedOpen);
  }, [emitAction, resolvedOpen]);

  useEffect(() => {
    if (!resolvedOpen || normalizedDuration <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastOpen(false, "auto-close");
    }, normalizedDuration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [normalizedDuration, resolvedOpen, setToastOpen]);

  if (!isRendered) {
    return null;
  }

  const toastLabel = getTextContent(children).trim();
  const resolvedAriaLabel =
    ariaLabel ?? (toastLabel === "" ? "Toast message" : toastLabel);
  const resolvedRole = role ?? "status";
  const resolvedAriaLive = ariaLive ?? "polite";
  const resolvedAriaAtomic = ariaAtomic ?? true;

  const composedContainerStyle: CSSProperties = {
    ...containerBaseStyle,
    bottom: `${normalizedBottomOffset}px`,
    opacity: isVisible ? 1 : 0,
    transform: `translateX(-50%) translateY(${isVisible ? "0px" : "10px"})`,
    transition: `opacity ${TOAST_ENTER_MS}ms ease, transform ${TOAST_ENTER_MS}ms ease`,
    ...style,
  };

  const composedBadgeStyle: CSSProperties = {
    ...badgeBaseStyle,
    ...sizeTokens[resolvedSize],
    ...surfaceStyleByVariant[resolvedVariant],
    ...(bordered ? {} : { borderWidth: 0, borderColor: "transparent" }),
    ...contentStyle,
  };

  return (
    <div
      className={className.trim() === "" ? undefined : className}
      style={composedContainerStyle}
      role={resolvedRole}
      aria-label={resolvedAriaLabel}
      aria-live={resolvedAriaLive}
      aria-atomic={resolvedAriaAtomic}
      data-state={resolvedOpen ? "open" : "closed"}
      {...props}
    >
      <Badge
        variant={badgeVariantByToastVariant[resolvedVariant]}
        size={badgeSizeByToastSize[resolvedSize]}
        style={composedBadgeStyle}
      >
        {children}
      </Badge>
    </div>
  );
}
