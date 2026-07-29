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
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-success-bg, #16a34a) 18%, white)",
    color:
      "color-mix(in srgb, var(--ktn-action-success-bg, #16a34a) 90%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-success-bg, #16a34a) 34%, white)",
  },
  warning: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #d97706) 18%, white)",
    color:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #d97706) 90%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #d97706) 34%, white)",
  },
  accent: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-accent-bg, #7c3aed) 18%, white)",
    color:
      "color-mix(in srgb, var(--ktn-action-accent-bg, #7c3aed) 90%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-accent-bg, #7c3aed) 34%, white)",
  },
  danger: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 16%, white)",
    color:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 90%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 32%, white)",
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
