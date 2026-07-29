import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { FiX } from "./icons/feather";

import { Button, type ButtonProps } from "./Button";

export type AlertVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "accent"
  | "destructive"
  | "outline"
  | "link"
  | "compact";
export type AlertSide =
  | "top-left"
  | "bottom-left"
  | "bottom-right"
  | "top-right"
  | "bottom-center"
  | "top-center";
export type AlertSize = "xs" | "sm" | "md" | "lg";
export type AlertActionSource =
  | "open"
  | "open-change"
  | "close-button"
  | "auto-close"
  | "escape"
  | "action-click"
  | "focus"
  | "blur";

export interface AlertCustomColors {
  backgroundColor?: CSSProperties["backgroundColor"];
  borderColor?: CSSProperties["borderColor"];
  titleColor?: CSSProperties["color"];
  descriptionColor?: CSSProperties["color"];
  actionColor?: CSSProperties["color"];
}

export interface AlertViewportInset {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface AlertActionContext {
  source: AlertActionSource;
  open: boolean;
  variant: AlertVariant;
  side: AlertSide;
  size: AlertSize;
  actionRequired: boolean;
  duration: number;
  startedAt?: number;
  closesAt?: number;
  stackIndex: number;
  stackCount: number;
  event?: unknown;
}

export interface AlertProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (context: AlertActionContext) => void;
  variant?: AlertVariant;
  side?: AlertSide;
  size?: AlertSize;
  duration?: number;
  actionRequired?: boolean;
  closeOnEscape?: boolean;
  closeButtonLabel?: string;
  customColors?: AlertCustomColors;
  viewportInset?: number | AlertViewportInset;
}

export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export interface AlertActionProps extends Omit<ButtonProps, "onAction"> {
  closeOnAction?: boolean;
}

type AlertSizeTokens = {
  maxWidth: string;
  minHeight: string;
  paddingInline: string;
  paddingBlock: string;
  contentGap: string;
  titleFontSize: string;
  descriptionFontSize: string;
  actionGap: string;
  closeButtonSize: NonNullable<ButtonProps["size"]>;
  stackGapPx: number;
};

type AlertVariantTokens = {
  backgroundColor: CSSProperties["backgroundColor"];
  borderColor: CSSProperties["borderColor"];
  titleColor: CSSProperties["color"];
  descriptionColor: CSSProperties["color"];
  actionColor: CSSProperties["color"];
  shadowColor: string;
};

type AlertStackEntry = {
  id: string;
  height: number;
};

type AlertStackInfo = {
  index: number;
  offsetPx: number;
  count: number;
};

interface AlertContextValue {
  size: AlertSize;
  variant: AlertVariant;
  customColors?: AlertCustomColors;
  setAlertOpen: (
    nextOpen: boolean,
    source?: AlertActionSource,
    event?: unknown,
  ) => void;
  emitAction: (
    source: AlertActionSource,
    event?: unknown,
    openOverride?: boolean,
  ) => void;
}

const sizeTokens: Record<AlertSize, AlertSizeTokens> = {
  xs: {
    maxWidth: "18rem",
    minHeight: "3.1rem",
    paddingInline: "0.6rem",
    paddingBlock: "0.5rem",
    contentGap: "0.3rem",
    titleFontSize: "0.78rem",
    descriptionFontSize: "0.72rem",
    actionGap: "0.35rem",
    closeButtonSize: "xs",
    stackGapPx: 8,
  },
  sm: {
    maxWidth: "20.5rem",
    minHeight: "3.45rem",
    paddingInline: "0.7rem",
    paddingBlock: "0.56rem",
    contentGap: "0.35rem",
    titleFontSize: "0.84rem",
    descriptionFontSize: "0.78rem",
    actionGap: "0.4rem",
    closeButtonSize: "xs",
    stackGapPx: 9,
  },
  md: {
    maxWidth: "23rem",
    minHeight: "3.8rem",
    paddingInline: "0.8rem",
    paddingBlock: "0.64rem",
    contentGap: "0.4rem",
    titleFontSize: "0.9rem",
    descriptionFontSize: "0.825rem",
    actionGap: "0.48rem",
    closeButtonSize: "sm",
    stackGapPx: 10,
  },
  lg: {
    maxWidth: "25rem",
    minHeight: "4.2rem",
    paddingInline: "0.9rem",
    paddingBlock: "0.72rem",
    contentGap: "0.45rem",
    titleFontSize: "0.98rem",
    descriptionFontSize: "0.9rem",
    actionGap: "0.55rem",
    closeButtonSize: "sm",
    stackGapPx: 12,
  },
};

const variantTokens: Record<AlertVariant, AlertVariantTokens> = {
  primary: {
    backgroundColor: "var(--ktn-action-primary-soft-bg, #dbeafe)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 24%, var(--ktn-border-muted))",
    titleColor: "var(--ktn-action-primary-bg)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    actionColor: "var(--ktn-action-primary-bg)",
    shadowColor: "rgba(29, 78, 216, 0.16)",
  },
  secondary: {
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    borderColor: "var(--ktn-border-muted)",
    titleColor: "var(--ktn-text-primary)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    actionColor: "var(--ktn-text-primary)",
    shadowColor: "rgba(15, 23, 42, 0.14)",
  },
  success: {
    backgroundColor: "var(--ktn-action-success-soft-bg, #dcfce7)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-success-bg, #15803d) 24%, var(--ktn-border-muted))",
    titleColor: "var(--ktn-action-success-bg, #15803d)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    actionColor: "var(--ktn-action-success-bg, #15803d)",
    shadowColor: "rgba(21, 128, 61, 0.16)",
  },
  warning: {
    backgroundColor: "var(--ktn-action-warning-soft-bg, #fef3c7)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #b45309) 24%, var(--ktn-border-muted))",
    titleColor: "var(--ktn-action-warning-bg, #b45309)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    actionColor: "var(--ktn-action-warning-bg, #b45309)",
    shadowColor: "rgba(180, 83, 9, 0.16)",
  },
  accent: {
    backgroundColor: "var(--ktn-action-accent-soft-bg, #fce7f3)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-accent-bg, #be185d) 24%, var(--ktn-border-muted))",
    titleColor: "var(--ktn-action-accent-bg, #be185d)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    actionColor: "var(--ktn-action-accent-bg, #be185d)",
    shadowColor: "rgba(190, 24, 93, 0.16)",
  },
  destructive: {
    backgroundColor: "var(--ktn-action-danger-soft-bg, #fee2e2)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #b91c1c) 24%, var(--ktn-border-muted))",
    titleColor: "var(--ktn-action-danger-bg, #b91c1c)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    actionColor: "var(--ktn-action-danger-bg, #b91c1c)",
    shadowColor: "rgba(185, 28, 28, 0.16)",
  },
  outline: {
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    borderColor: "var(--ktn-border-muted)",
    titleColor: "var(--ktn-text-primary)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    actionColor: "var(--ktn-text-primary)",
    shadowColor: "rgba(15, 23, 42, 0.12)",
  },
  link: {
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 24%, var(--ktn-border-muted))",
    titleColor: "var(--ktn-action-primary-bg)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    actionColor: "var(--ktn-action-primary-bg)",
    shadowColor: "rgba(37, 99, 235, 0.16)",
  },
  compact: {
    backgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))",
    borderColor: "var(--ktn-border-muted)",
    titleColor: "var(--ktn-text-primary)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    actionColor: "var(--ktn-text-primary)",
    shadowColor: "rgba(15, 23, 42, 0.1)",
  },
};

const stackEntriesBySide: Record<AlertSide, AlertStackEntry[]> = {
  "top-left": [],
  "bottom-left": [],
  "bottom-right": [],
  "top-right": [],
  "bottom-center": [],
  "top-center": [],
};

const stackListeners = new Set<() => void>();

const baseClasses = "z-[1200]";

const AlertContext = createContext<AlertContextValue | null>(null);

function subscribeStack(listener: () => void): () => void {
  stackListeners.add(listener);

  return () => {
    stackListeners.delete(listener);
  };
}

function notifyStackListeners(): void {
  stackListeners.forEach((listener) => {
    listener();
  });
}

function addStackEntry(side: AlertSide, id: string): void {
  const sideEntries = stackEntriesBySide[side];

  if (sideEntries.some((entry) => entry.id === id)) {
    return;
  }

  sideEntries.unshift({
    id,
    height: 0,
  });

  notifyStackListeners();
}

function removeStackEntry(side: AlertSide, id: string): void {
  const sideEntries = stackEntriesBySide[side];
  const nextEntries = sideEntries.filter((entry) => entry.id !== id);

  if (nextEntries.length === sideEntries.length) {
    return;
  }

  stackEntriesBySide[side] = nextEntries;
  notifyStackListeners();
}

function updateStackEntryHeight(
  side: AlertSide,
  id: string,
  height: number,
): void {
  const sideEntries = stackEntriesBySide[side];
  const targetEntry = sideEntries.find((entry) => entry.id === id);

  if (targetEntry == null) {
    return;
  }

  const nextHeight = Math.max(height, 0);

  if (Math.abs(targetEntry.height - nextHeight) <= 0.5) {
    return;
  }

  targetEntry.height = nextHeight;
  notifyStackListeners();
}

function getStackInfo(
  side: AlertSide,
  id: string,
  gapPx: number,
): AlertStackInfo {
  const sideEntries = stackEntriesBySide[side];
  const index = sideEntries.findIndex((entry) => entry.id === id);

  if (index < 0) {
    return {
      index: -1,
      offsetPx: 0,
      count: sideEntries.length,
    };
  }

  const offsetPx = sideEntries
    .slice(0, index)
    .reduce((total, entry) => total + entry.height + gapPx, 0);

  return {
    index,
    offsetPx,
    count: sideEntries.length,
  };
}

function resolveVariant(variant: AlertVariant | undefined): AlertVariant {
  if (variant != null) {
    return variant;
  }

  return "primary";
}

function getBasePlacementTransform(side: AlertSide): string {
  if (side === "top-center" || side === "bottom-center") {
    return "translateX(-50%)";
  }

  return "";
}

function getHiddenMotionTransform(side: AlertSide): string {
  if (side === "top-left") {
    return "translateX(-14px) translateY(-18px)";
  }

  if (side === "top-right") {
    return "translateX(14px) translateY(-18px)";
  }

  if (side === "bottom-left") {
    return "translateX(-14px) translateY(18px)";
  }

  if (side === "bottom-right") {
    return "translateX(14px) translateY(18px)";
  }

  if (side === "bottom-center") {
    return "translateY(18px)";
  }

  return "translateY(-18px)";
}

function resolveViewportInset(input: number | AlertViewportInset | undefined): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  if (typeof input === "number") {
    const safeInset = Math.max(input, 0);

    return {
      top: safeInset,
      right: safeInset,
      bottom: safeInset,
      left: safeInset,
    };
  }

  return {
    top: Math.max(input?.top ?? 14, 0),
    right: Math.max(input?.right ?? 14, 0),
    bottom: Math.max(input?.bottom ?? 14, 0),
    left: Math.max(input?.left ?? 14, 0),
  };
}

function getPlacementStyle(
  side: AlertSide,
  offsetPx: number,
  viewportInset: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  },
): CSSProperties {
  const topOffset = `${viewportInset.top + offsetPx}px`;
  const rightOffset = `${viewportInset.right}px`;
  const bottomOffset = `${viewportInset.bottom + offsetPx}px`;
  const leftOffset = `${viewportInset.left}px`;

  if (side === "top-left") {
    return {
      top: topOffset,
      left: leftOffset,
    };
  }

  if (side === "top-right") {
    return {
      top: topOffset,
      right: rightOffset,
    };
  }

  if (side === "bottom-left") {
    return {
      bottom: bottomOffset,
      left: leftOffset,
    };
  }

  if (side === "bottom-right") {
    return {
      bottom: bottomOffset,
      right: rightOffset,
    };
  }

  if (side === "bottom-center") {
    return {
      bottom: bottomOffset,
      left: "50%",
    };
  }

  return {
    top: topOffset,
    left: "50%",
  };
}

function resolveActionButtonVariant(
  variant: AlertVariant,
): NonNullable<ButtonProps["variant"]> {
  if (variant === "success") {
    return "success";
  }

  if (variant === "warning") {
    return "warning";
  }

  if (variant === "accent") {
    return "accent";
  }

  if (variant === "destructive") {
    return "destructive";
  }

  if (variant === "link") {
    return "link";
  }

  if (variant === "secondary") {
    return "secondary";
  }

  return "outline";
}

function resolveActionButtonSize(
  size: AlertSize,
): NonNullable<ButtonProps["size"]> {
  if (size === "xs" || size === "sm") {
    return "xs";
  }

  return "sm";
}

function useAlertContextValue(): AlertContextValue {
  const contextValue = useContext(AlertContext);

  if (contextValue != null) {
    return contextValue;
  }

  return {
    size: "md",
    variant: "primary",
    setAlertOpen: () => {},
    emitAction: () => {},
  };
}

function isAlertActionType(type: unknown): boolean {
  if (type === AlertAction) {
    return true;
  }

  const maybeType = type as {
    displayName?: string;
    name?: string;
  };

  return (
    maybeType.displayName === "AlertAction" || maybeType.name === "AlertAction"
  );
}

function containsAlertAction(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) {
      return false;
    }

    const element = child as ReactElement<{ children?: ReactNode }>;

    if (isAlertActionType(element.type)) {
      return true;
    }

    return containsAlertAction(element.props.children);
  });
}

function partitionAlertChildren(children: ReactNode): {
  contentChildren: ReactNode[];
  actionChildren: ReactElement<AlertActionProps>[];
} {
  const contentChildren: ReactNode[] = [];
  const actionChildren: ReactElement<AlertActionProps>[] = [];

  Children.toArray(children).forEach((child) => {
    if (!isValidElement(child)) {
      contentChildren.push(child);
      return;
    }

    const element = child as ReactElement<AlertActionProps>;

    if (isAlertActionType(element.type)) {
      actionChildren.push(element);
      return;
    }

    contentChildren.push(child);
  });

  return {
    contentChildren,
    actionChildren,
  };
}

export function Alert({
  children,
  open,
  defaultOpen = true,
  onOpenChange,
  onAction,
  variant,
  side = "top-right",
  size = "md",
  duration = 30_000,
  actionRequired,
  closeOnEscape = true,
  closeButtonLabel = "Close alert",
  customColors,
  viewportInset,
  className = "",
  style,
  onFocus,
  onBlur,
  role,
  ["aria-live"]: ariaLive,
  ...props
}: AlertProps): JSX.Element {
  const alertId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const autoCloseTimeoutRef = useRef<number | null>(null);
  const openTransitionSourceRef = useRef<AlertActionSource | null>(null);
  const previousOpenRef = useRef(
    open !== undefined ? open === true : defaultOpen,
  );
  const startedAtRef = useRef<number | undefined>(undefined);
  const closesAtRef = useRef<number | undefined>(undefined);

  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpen === true,
  );
  const [isRendered, setIsRendered] = useState(
    isControlled ? open === true : defaultOpen === true,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [stackRevision, setStackRevision] = useState(0);
  const [lastStackInfo, setLastStackInfo] = useState<AlertStackInfo>({
    index: 0,
    offsetPx: 0,
    count: 1,
  });

  const isOpen = isControlled ? open === true : uncontrolledOpen;
  const normalizedDuration = Math.max(duration, 0);
  const resolvedVariant = resolveVariant(variant);
  const resolvedViewportInset = resolveViewportInset(viewportInset);
  const sizeToken = sizeTokens[size];
  const variantToken = variantTokens[resolvedVariant];

  const hasActionableChild = useMemo(
    () => containsAlertAction(children),
    [children],
  );
  const { contentChildren, actionChildren } = useMemo(
    () => partitionAlertChildren(children),
    [children],
  );
  const resolvedActionRequired = actionRequired ?? hasActionableChild;
  const shouldAutoClose = !resolvedActionRequired && normalizedDuration > 0;

  const stackInfo = useMemo(
    () => getStackInfo(side, alertId, sizeToken.stackGapPx),
    [alertId, side, sizeToken.stackGapPx, stackRevision],
  );

  const effectiveStackInfo =
    stackInfo.index >= 0
      ? stackInfo
      : {
          ...lastStackInfo,
          count: stackInfo.count,
        };

  function buildActionContext(
    source: AlertActionSource,
    openState: boolean,
    event?: unknown,
  ): AlertActionContext {
    const currentStack =
      stackInfo.index >= 0
        ? stackInfo
        : {
            ...lastStackInfo,
            count: stackInfo.count,
          };

    return {
      source,
      open: openState,
      variant: resolvedVariant,
      side,
      size,
      actionRequired: resolvedActionRequired,
      duration: normalizedDuration,
      startedAt: startedAtRef.current,
      closesAt: closesAtRef.current,
      stackIndex: Math.max(currentStack.index, 0),
      stackCount: Math.max(currentStack.count, 1),
      event,
    };
  }

  function emitAction(
    source: AlertActionSource,
    event?: unknown,
    openOverride?: boolean,
  ): void {
    onAction?.(buildActionContext(source, openOverride ?? isOpen, event));
  }

  function setAlertOpen(
    nextOpen: boolean,
    source: AlertActionSource = "open-change",
    event?: unknown,
  ): void {
    if (nextOpen === isOpen) {
      return;
    }

    openTransitionSourceRef.current = source;

    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
    onAction?.(buildActionContext(source, nextOpen, event));
  }

  useEffect(() => {
    if (stackInfo.index < 0) {
      return;
    }

    setLastStackInfo(stackInfo);
  }, [stackInfo]);

  useEffect(
    () => subscribeStack(() => setStackRevision((current) => current + 1)),
    [],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    addStackEntry(side, alertId);

    return () => {
      removeStackEntry(side, alertId);
    };
  }, [alertId, isOpen, side]);

  useLayoutEffect(() => {
    if (!(isOpen && rootRef.current != null)) {
      return;
    }

    const node = rootRef.current;

    function syncHeight(): void {
      updateStackEntryHeight(
        side,
        alertId,
        node.getBoundingClientRect().height,
      );
    }

    syncHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      syncHeight();
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, [alertId, children, isOpen, side, size]);

  useEffect(() => {
    if (isOpen) {
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

    if (typeof window === "undefined") {
      setIsRendered(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsRendered(false);
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  useEffect(() => {
    const wasOpen = previousOpenRef.current;

    if (wasOpen === isOpen) {
      return;
    }

    previousOpenRef.current = isOpen;

    if (isOpen) {
      const startedAt = Date.now();
      startedAtRef.current = startedAt;
      closesAtRef.current = shouldAutoClose
        ? startedAt + normalizedDuration
        : undefined;

      if (openTransitionSourceRef.current == null) {
        emitAction("open", undefined, true);
      }
    } else if (openTransitionSourceRef.current == null) {
      emitAction("open-change", undefined, false);
    }

    openTransitionSourceRef.current = null;
  }, [isOpen, normalizedDuration, shouldAutoClose]);

  useEffect(
    () => () => {
      if (autoCloseTimeoutRef.current != null) {
        window.clearTimeout(autoCloseTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!(isOpen && shouldAutoClose)) {
      return;
    }

    const now = Date.now();

    if (startedAtRef.current == null) {
      startedAtRef.current = now;
    }

    // Rebase active countdown when duration is updated at runtime.
    closesAtRef.current = now + normalizedDuration;
  }, [isOpen, normalizedDuration, shouldAutoClose]);

  useEffect(() => {
    if (autoCloseTimeoutRef.current != null) {
      window.clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }

    if (!(isOpen && shouldAutoClose)) {
      return;
    }

    const now = Date.now();
    const startedAt = startedAtRef.current ?? now;
    const closesAt = closesAtRef.current ?? startedAt + normalizedDuration;
    const remaining = Math.max(closesAt - now, 0);

    autoCloseTimeoutRef.current = window.setTimeout(() => {
      autoCloseTimeoutRef.current = null;
      setAlertOpen(false, "auto-close");
    }, remaining);

    return () => {
      if (autoCloseTimeoutRef.current != null) {
        window.clearTimeout(autoCloseTimeoutRef.current);
        autoCloseTimeoutRef.current = null;
      }
    };
  }, [isOpen, normalizedDuration, shouldAutoClose]);

  useEffect(() => {
    if (!(isOpen && !shouldAutoClose)) {
      return;
    }

    if (startedAtRef.current == null) {
      startedAtRef.current = Date.now();
    }

    closesAtRef.current = undefined;
  }, [isOpen, shouldAutoClose]);

  useEffect(() => {
    if (!(isOpen && closeOnEscape)) {
      return;
    }

    function handleEscape(event: globalThis.KeyboardEvent): void {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      setAlertOpen(false, "escape", event);
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeOnEscape, isOpen]);

  function handleRootFocus(event: FocusEvent<HTMLDivElement>): void {
    onFocus?.(event);

    if (!event.defaultPrevented) {
      emitAction("focus", event, true);
    }
  }

  function handleRootBlur(event: FocusEvent<HTMLDivElement>): void {
    onBlur?.(event);

    if (!event.defaultPrevented) {
      emitAction("blur", event, isOpen);
    }
  }

  function handleCloseButtonClick(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    setAlertOpen(false, "close-button", event);
  }

  if (!isRendered) {
    return <></>;
  }

  const placementStyle = getPlacementStyle(side, 0, resolvedViewportInset);
  const basePlacementTransform = getBasePlacementTransform(side);
  const motionTransform = isVisible
    ? "translateX(0) translateY(0) scale(1)"
    : `${getHiddenMotionTransform(side)} scale(0.94)`;
  const transform = `${basePlacementTransform} ${motionTransform}`.trim();

  const resolvedBackgroundColor =
    customColors?.backgroundColor ?? variantToken.backgroundColor;
  const resolvedBorderColor =
    customColors?.borderColor ?? variantToken.borderColor;

  const rootStyle: CSSProperties = {
    position: "fixed",
    pointerEvents: "auto",
    ...placementStyle,
    width: `min(${sizeToken.maxWidth}, calc(100vw - 1rem))`,
    minHeight: sizeToken.minHeight,
    display: "flex",
    flexDirection: "column",
    gap: 0,
    boxSizing: "border-box",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: resolvedBorderColor,
    backgroundColor: resolvedBackgroundColor,
    borderRadius: "var(--ktn-radius-md, 0.5rem)",
    paddingInline: sizeToken.paddingInline,
    paddingBlock: sizeToken.paddingBlock,
    boxShadow: `0 10px 22px ${variantToken.shadowColor}`,
    willChange: "transform, opacity",
    opacity: isVisible ? 1 : 0,
    transform,
    transition:
      "transform 240ms cubic-bezier(0.18, 0.89, 0.32, 1.08), opacity 220ms ease-out, top 180ms ease, right 180ms ease, bottom 180ms ease, left 180ms ease",
    zIndex: 1300 + Math.max(0, 200 - effectiveStackInfo.index),
    ...style,
  };

  const headerRowStyle: CSSProperties = {
    minWidth: 0,
    display: "flex",
    alignItems: "flex-start",
    gap: "0.45rem",
  };

  const contentStyle: CSSProperties = {
    minWidth: 0,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: sizeToken.contentGap,
  };

  const actionRowStyle: CSSProperties = {
    minWidth: 0,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: sizeToken.actionGap,
    marginTop: contentChildren.length > 0 ? sizeToken.actionGap : 0,
  };

  const closeButtonStyle: CSSProperties = {
    color: customColors?.actionColor ?? variantToken.actionColor,
    marginTop: "-0.1rem",
    flexShrink: 0,
  };

  const contextValue: AlertContextValue = {
    size,
    variant: resolvedVariant,
    customColors,
    setAlertOpen,
    emitAction,
  };

  const composedClassName = `${baseClasses} ${className}`.trim();
  const resolvedRole =
    role ?? (resolvedVariant === "destructive" ? "alert" : "status");
  const resolvedAriaLive =
    ariaLive ?? (resolvedVariant === "destructive" ? "assertive" : "polite");

  return (
    <AlertContext.Provider value={contextValue}>
      <div
        {...props}
        ref={rootRef}
        className={composedClassName}
        role={resolvedRole}
        aria-live={resolvedAriaLive}
        aria-atomic="true"
        data-state={isOpen ? "open" : "closed"}
        data-side={side}
        style={rootStyle}
        onFocus={handleRootFocus}
        onBlur={handleRootBlur}
      >
        <div style={headerRowStyle}>
          <div style={contentStyle}>{contentChildren}</div>

          <Button
            type="button"
            iconOnly
            size={sizeToken.closeButtonSize}
            variant="ghost"
            aria-label={closeButtonLabel}
            onClick={handleCloseButtonClick}
            style={closeButtonStyle}
          >
            <FiX size={14} aria-hidden />
          </Button>
        </div>

        {actionChildren.length > 0 ? (
          <div style={actionRowStyle}>
            {actionChildren.map((actionChild, index) =>
              cloneElement(actionChild, {
                key: actionChild.key ?? `alert-action-${index}`,
                style: {
                  ...(actionChild.props.style ?? {}),
                  marginTop: 0,
                },
              }),
            )}
          </div>
        ) : null}
      </div>
    </AlertContext.Provider>
  );
}

export function AlertTitle({
  children,
  className = "",
  style,
  ...props
}: AlertTitleProps): JSX.Element {
  const { size, variant, customColors } = useAlertContextValue();
  const sizeToken = sizeTokens[size];
  const variantToken = variantTokens[variant];
  const composedClassName = className.trim() === "" ? undefined : className;

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: sizeToken.titleFontSize,
    fontWeight: 600,
    lineHeight: 1.28,
    color: customColors?.titleColor ?? variantToken.titleColor,
    letterSpacing: "0.01em",
    ...style,
  };

  return (
    <h5 className={composedClassName} style={titleStyle} {...props}>
      {children}
    </h5>
  );
}

export function AlertDescription({
  children,
  className = "",
  style,
  ...props
}: AlertDescriptionProps): JSX.Element {
  const { size, variant, customColors } = useAlertContextValue();
  const sizeToken = sizeTokens[size];
  const variantToken = variantTokens[variant];
  const composedClassName = className.trim() === "" ? undefined : className;

  const descriptionStyle: CSSProperties = {
    margin: 0,
    fontSize: sizeToken.descriptionFontSize,
    lineHeight: 1.4,
    color: customColors?.descriptionColor ?? variantToken.descriptionColor,
    ...style,
  };

  return (
    <p className={composedClassName} style={descriptionStyle} {...props}>
      {children}
    </p>
  );
}

export function AlertAction({
  closeOnAction = false,
  variant,
  size,
  style,
  onClick,
  type = "button",
  ...props
}: AlertActionProps): JSX.Element {
  const {
    size: alertSize,
    variant: alertVariant,
    customColors,
    setAlertOpen,
    emitAction,
  } = useAlertContextValue();

  const resolvedVariant = variant ?? resolveActionButtonVariant(alertVariant);
  const resolvedSize = size ?? resolveActionButtonSize(alertSize);

  const actionStyle: CSSProperties = {
    marginTop: sizeTokens[alertSize].actionGap,
    color: customColors?.actionColor,
    ...(style ?? {}),
  };

  function handleActionClick(event: MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    emitAction("action-click", event, true);

    if (closeOnAction) {
      setAlertOpen(false, "action-click", event);
    }
  }

  return (
    <Button
      {...props}
      type={type}
      variant={resolvedVariant}
      size={resolvedSize}
      onClick={handleActionClick}
      style={actionStyle}
    />
  );
}

AlertAction.displayName = "AlertAction";
