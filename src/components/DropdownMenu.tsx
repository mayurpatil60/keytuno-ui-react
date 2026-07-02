import {
  createContext,
  isValidElement,
  useEffect,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import { createPortal } from "react-dom";
import { FiCheck, FiChevronRight } from "./icons/feather";

import { Button } from "./Button";
import { Scrollbar } from "./Scrollbar";

export type DropdownMenuVariant = "default" | "outline" | "soft";
export type DropdownMenuSize = "xs" | "sm" | "md" | "lg";
export type DropdownMenuSide = "auto" | "bottom" | "top" | "left" | "right";
export type DropdownMenuItemLayout = "block" | "inline";
export type DropdownMenuActionSource =
  | "trigger"
  | "outside-click"
  | "escape"
  | "item-select"
  | "open-change";

export interface DropdownMenuActionContext {
  source: DropdownMenuActionSource;
  open: boolean;
  itemText?: string;
  checked?: boolean;
  event?: unknown;
}

type DropdownMenuResolvedSide = Exclude<DropdownMenuSide, "auto">;

export interface DropdownMenuProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (context: DropdownMenuActionContext) => void;
  size?: DropdownMenuSize;
  variant?: DropdownMenuVariant;
  side?: DropdownMenuSide;
  itemLayout?: DropdownMenuItemLayout;
  closeOnSelect?: boolean;
  disabled?: boolean;
}

export interface DropdownMenuTriggerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  disabled?: boolean;
  asChild?: boolean;
  openLabel?: ReactNode;
  closeLabel?: ReactNode;
}

export interface DropdownMenuContentProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  side?: DropdownMenuSide;
  sideOffset?: number;
  align?: "start" | "center" | "end";
}

export interface DropdownMenuGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
}

export interface DropdownMenuItemProps extends Omit<
  HTMLAttributes<HTMLButtonElement>,
  "children"
> {
  children?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  inset?: boolean;
  icon?: ReactNode;
  shortcut?: ReactNode;
  checked?: boolean;
  checkIcon?: ReactNode;
  keepOpenOnSelect?: boolean;
  onSelect?: () => void;
  submenu?: ReactNode;
  submenuSide?: DropdownMenuSide;
  submenuOffset?: number;
}

export interface DropdownMenuLabelProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  inset?: boolean;
}

export interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export interface DropdownMenuCheckboxItemProps extends Omit<
  DropdownMenuItemProps,
  "checked" | "onSelect" | "keepOpenOnSelect" | "submenu"
> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indicatorIcon?: ReactNode;
  onSelect?: () => void;
}

export interface DropdownMenuRadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface DropdownMenuRadioItemProps extends Omit<
  DropdownMenuItemProps,
  "checked" | "submenu"
> {
  value: string;
  indicatorIcon?: ReactNode;
}

type DropdownMenuSizeTokens = {
  triggerSize: "xs" | "sm" | "md" | "lg";
  panelPadding: string;
  itemHeight: string;
  itemFontSize: string;
  itemPaddingInline: string;
  labelFontSize: string;
  shortcutFontSize: string;
  iconSize: number;
};

type DropdownMenuVariantTokens = {
  panelBackgroundColor: string;
  panelBorderColor: string;
  panelShadow: string;
  itemTextColor: string;
  itemHoverBackgroundColor: string;
  itemHoverTextColor: string;
  itemDisabledColor: string;
  separatorColor: string;
  labelColor: string;
  shortcutColor: string;
  destructiveTextColor: string;
  destructiveHoverBackgroundColor: string;
};

type FloatingPosition = {
  x: number;
  y: number;
  side: DropdownMenuResolvedSide;
};

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (
    open: boolean,
    source?: DropdownMenuActionSource,
    event?: unknown,
  ) => void;
  size: DropdownMenuSize;
  variant: DropdownMenuVariant;
  side: DropdownMenuSide;
  itemLayout: DropdownMenuItemLayout;
  closeOnSelect: boolean;
  disabled: boolean;
  triggerRef: React.MutableRefObject<HTMLDivElement | null>;
  contentId: string;
  onAction?: (context: DropdownMenuActionContext) => void;
}

interface DropdownMenuRadioGroupContextValue {
  value: string | null;
  setValue: (value: string) => void;
}

const baseClasses = "inline-flex min-w-0";

const sizeTokens: Record<DropdownMenuSize, DropdownMenuSizeTokens> = {
  xs: {
    triggerSize: "xs",
    panelPadding: "0.2rem",
    itemHeight: "1.7rem",
    itemFontSize: "0.75rem",
    itemPaddingInline: "0.4rem",
    labelFontSize: "0.68rem",
    shortcutFontSize: "0.65rem",
    iconSize: 13,
  },
  sm: {
    triggerSize: "sm",
    panelPadding: "0.25rem",
    itemHeight: "1.95rem",
    itemFontSize: "0.8125rem",
    itemPaddingInline: "0.45rem",
    labelFontSize: "0.72rem",
    shortcutFontSize: "0.7rem",
    iconSize: 14,
  },
  md: {
    triggerSize: "md",
    panelPadding: "0.3rem",
    itemHeight: "2.15rem",
    itemFontSize: "0.875rem",
    itemPaddingInline: "0.5rem",
    labelFontSize: "0.76rem",
    shortcutFontSize: "0.74rem",
    iconSize: 15,
  },
  lg: {
    triggerSize: "lg",
    panelPadding: "0.35rem",
    itemHeight: "2.35rem",
    itemFontSize: "0.9375rem",
    itemPaddingInline: "0.6rem",
    labelFontSize: "0.8rem",
    shortcutFontSize: "0.78rem",
    iconSize: 16,
  },
};

const variantTokens: Record<DropdownMenuVariant, DropdownMenuVariantTokens> = {
  default: {
    panelBackgroundColor: "var(--ktn-bg-surface, #ffffff)",
    panelBorderColor: "var(--ktn-border-muted)",
    panelShadow: "0 12px 28px rgba(15, 23, 42, 0.16)",
    itemTextColor: "var(--ktn-text-primary)",
    itemHoverBackgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.14))",
    itemHoverTextColor: "var(--ktn-text-primary)",
    itemDisabledColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    separatorColor: "var(--ktn-border-muted)",
    labelColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    shortcutColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    destructiveTextColor: "var(--ktn-action-danger-bg, #dc2626)",
    destructiveHoverBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 14%, transparent)",
  },
  outline: {
    panelBackgroundColor: "var(--ktn-bg-surface, #ffffff)",
    panelBorderColor: "var(--ktn-border-strong, var(--ktn-border-muted))",
    panelShadow: "0 10px 24px rgba(15, 23, 42, 0.14)",
    itemTextColor: "var(--ktn-text-primary)",
    itemHoverBackgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.14))",
    itemHoverTextColor: "var(--ktn-text-primary)",
    itemDisabledColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    separatorColor: "var(--ktn-border-muted)",
    labelColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    shortcutColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    destructiveTextColor: "var(--ktn-action-danger-bg, #dc2626)",
    destructiveHoverBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 14%, transparent)",
  },
  soft: {
    panelBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 90%, var(--ktn-bg-muted, #f1f5f9))",
    panelBorderColor: "var(--ktn-border-muted)",
    panelShadow: "0 10px 24px rgba(15, 23, 42, 0.14)",
    itemTextColor: "var(--ktn-text-primary)",
    itemHoverBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-muted, rgba(100, 116, 139, 0.14)) 88%, transparent)",
    itemHoverTextColor: "var(--ktn-text-primary)",
    itemDisabledColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    separatorColor: "var(--ktn-border-muted)",
    labelColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    shortcutColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    destructiveTextColor: "var(--ktn-action-danger-bg, #dc2626)",
    destructiveHoverBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 14%, transparent)",
  },
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(
  null,
);
const DropdownMenuRadioGroupContext =
  createContext<DropdownMenuRadioGroupContextValue | null>(null);
const FLOATING_VIEWPORT_MARGIN = 8;
const SUBMENU_HOVER_CLOSE_DELAY_MS = 120;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getSideSpace(
  side: DropdownMenuResolvedSide,
  anchorRect: DOMRect,
): number {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (side === "bottom") {
    return viewportHeight - anchorRect.bottom;
  }

  if (side === "top") {
    return anchorRect.top;
  }

  if (side === "right") {
    return viewportWidth - anchorRect.right;
  }

  return anchorRect.left;
}

function getSidePriority(
  preferredSide: DropdownMenuSide,
  anchorRect: DOMRect,
): DropdownMenuResolvedSide[] {
  const allSides: DropdownMenuResolvedSide[] = [
    "bottom",
    "top",
    "right",
    "left",
  ];

  function sortBySpace(
    candidates: DropdownMenuResolvedSide[],
  ): DropdownMenuResolvedSide[] {
    return [...candidates].sort(
      (leftSide, rightSide) =>
        getSideSpace(rightSide, anchorRect) -
        getSideSpace(leftSide, anchorRect),
    );
  }

  if (preferredSide === "auto") {
    // In auto mode, always try bottom first. If it cannot fit, fallback to sides with more space.
    const fallbackSides = allSides.filter((side) => side !== "bottom");

    return ["bottom", ...sortBySpace(fallbackSides)];
  }

  // For explicit side requests: try requested side first, then fallback by available space.
  const fallbackSides = allSides.filter((side) => side !== preferredSide);

  return [preferredSide, ...sortBySpace(fallbackSides)];
}

function getSideCoordinates(
  side: DropdownMenuResolvedSide,
  anchorRect: DOMRect,
  menuWidth: number,
  menuHeight: number,
  align: "start" | "center" | "end",
  sideOffset: number,
): { x: number; y: number } {
  const horizontalCoordinate =
    align === "center"
      ? anchorRect.left + (anchorRect.width - menuWidth) / 2
      : align === "end"
        ? anchorRect.right - menuWidth
        : anchorRect.left;

  const verticalCoordinate =
    align === "center"
      ? anchorRect.top + (anchorRect.height - menuHeight) / 2
      : align === "end"
        ? anchorRect.bottom - menuHeight
        : anchorRect.top;

  if (side === "bottom") {
    return {
      x: horizontalCoordinate,
      y: anchorRect.bottom + sideOffset,
    };
  }

  if (side === "top") {
    return {
      x: horizontalCoordinate,
      y: anchorRect.top - menuHeight - sideOffset,
    };
  }

  if (side === "right") {
    return {
      x: anchorRect.right + sideOffset,
      y: verticalCoordinate,
    };
  }

  return {
    x: anchorRect.left - menuWidth - sideOffset,
    y: verticalCoordinate,
  };
}

function resolveFloatingPosition(
  anchorRect: DOMRect,
  menuWidth: number,
  menuHeight: number,
  preferredSide: DropdownMenuSide,
  align: "start" | "center" | "end",
  sideOffset: number,
): FloatingPosition {
  const viewportMargin = FLOATING_VIEWPORT_MARGIN;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const prioritizedSides = getSidePriority(preferredSide, anchorRect);

  const candidates: Array<{
    side: DropdownMenuResolvedSide;
    x: number;
    y: number;
    overflowScore: number;
  }> = [];

  prioritizedSides.forEach((candidateSide) => {
    const rawCoordinates = getSideCoordinates(
      candidateSide,
      anchorRect,
      menuWidth,
      menuHeight,
      align,
      sideOffset,
    );

    const overflowLeft = Math.max(viewportMargin - rawCoordinates.x, 0);
    const overflowRight = Math.max(
      rawCoordinates.x + menuWidth - (viewportWidth - viewportMargin),
      0,
    );
    const overflowTop = Math.max(viewportMargin - rawCoordinates.y, 0);
    const overflowBottom = Math.max(
      rawCoordinates.y + menuHeight - (viewportHeight - viewportMargin),
      0,
    );
    const overflowScore =
      overflowLeft + overflowRight + overflowTop + overflowBottom;

    const clampedX = clamp(
      rawCoordinates.x,
      viewportMargin,
      Math.max(viewportMargin, viewportWidth - menuWidth - viewportMargin),
    );
    const clampedY = clamp(
      rawCoordinates.y,
      viewportMargin,
      Math.max(viewportMargin, viewportHeight - menuHeight - viewportMargin),
    );

    candidates.push({
      side: candidateSide,
      x: clampedX,
      y: clampedY,
      overflowScore,
    });
  });

  const firstFitCandidate = candidates.find(
    (candidate) => candidate.overflowScore === 0,
  );

  if (firstFitCandidate != null) {
    return {
      x: firstFitCandidate.x,
      y: firstFitCandidate.y,
      side: firstFitCandidate.side,
    };
  }

  const bestCandidate = candidates.reduce<{
    side: DropdownMenuResolvedSide;
    x: number;
    y: number;
    overflowScore: number;
  } | null>((best, candidate) => {
    if (best == null || candidate.overflowScore < best.overflowScore) {
      return candidate;
    }

    return best;
  }, null);

  if (bestCandidate == null) {
    return {
      x: viewportMargin,
      y: viewportMargin,
      side: "bottom",
    };
  }

  return {
    x: bestCandidate.x,
    y: bestCandidate.y,
    side: bestCandidate.side,
  };
}

function getFocusableMenuItems(container: HTMLElement): HTMLButtonElement[] {
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>(
      'button[data-ktn-dropdown-item="true"]',
    ),
  ).filter((buttonElement) => {
    return (
      !buttonElement.disabled &&
      buttonElement.getAttribute("aria-disabled") !== "true"
    );
  });
}

function useDropdownMenuContextValue(): DropdownMenuContextValue {
  const contextValue = useContext(DropdownMenuContext);

  if (contextValue != null) {
    return contextValue;
  }

  return {
    open: false,
    setOpen: () => {},
    size: "md",
    variant: "default",
    side: "auto",
    itemLayout: "block",
    closeOnSelect: true,
    disabled: false,
    triggerRef: { current: null },
    contentId: "",
    onAction: undefined,
  };
}

function useDropdownMenuRadioGroupContextValue(): DropdownMenuRadioGroupContextValue | null {
  return useContext(DropdownMenuRadioGroupContext);
}

function renderPortal(children: ReactNode): JSX.Element | null {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}

function hasLikelyFocusableChild(node: ReactNode): boolean {
  if (!isValidElement(node)) {
    return false;
  }

  if (typeof node.type === "string") {
    const tagName = node.type.toLowerCase();

    if (
      tagName === "button" ||
      tagName === "a" ||
      tagName === "input" ||
      tagName === "select" ||
      tagName === "textarea" ||
      tagName === "summary"
    ) {
      return true;
    }
  }

  const elementProps = node.props as {
    tabIndex?: number;
    role?: string;
    href?: string;
    to?: string;
  };

  if (typeof elementProps.tabIndex === "number" && elementProps.tabIndex >= 0) {
    return true;
  }

  if (elementProps.role === "button") {
    return true;
  }

  return (
    typeof elementProps.href === "string" || typeof elementProps.to === "string"
  );
}

function getPanelStyle(
  sizeToken: DropdownMenuSizeTokens,
  variantToken: DropdownMenuVariantTokens,
  itemLayout: DropdownMenuItemLayout,
  x: number,
  y: number,
  visible: boolean,
): CSSProperties {
  return {
    position: "fixed",
    insetInlineStart: `${x}px`,
    insetBlockStart: `${y}px`,
    zIndex: 120,
    width: "max-content",
    display: itemLayout === "block" ? "flex" : "block",
    flexDirection: itemLayout === "block" ? "column" : undefined,
    alignItems: itemLayout === "block" ? "stretch" : undefined,
    maxWidth: `calc(100vw - ${FLOATING_VIEWPORT_MARGIN * 2}px)`,
    overflow: "hidden",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: variantToken.panelBorderColor,
    borderRadius: "var(--ktn-radius-md, 0.5rem)",
    backgroundColor: variantToken.panelBackgroundColor,
    boxShadow: `${variantToken.panelShadow}, 0 0 0 1px color-mix(in srgb, var(--ktn-border-muted) 50%, transparent)`,
    padding: sizeToken.panelPadding,
    visibility: visible ? "visible" : "hidden",
    opacity: visible ? 1 : 0,
    transition: "opacity 120ms ease",
  };
}

export function DropdownMenu({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  onAction,
  size = "md",
  variant,
  side = "auto",
  itemLayout = "block",
  closeOnSelect = true,
  disabled = false,
  className = "",
  style,
  ...props
}: DropdownMenuProps): JSX.Element {
  const resolvedVariant = variant ?? "default";
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const contentId = useId();
  const isOpen = isControlled ? open === true : uncontrolledOpen;

  function setDropdownOpen(
    nextOpen: boolean,
    source: DropdownMenuActionSource = "open-change",
    event?: unknown,
  ): void {
    if (disabled) {
      return;
    }

    if (nextOpen === isOpen) {
      return;
    }

    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
    onAction?.({
      source,
      open: nextOpen,
      event,
    });

    if (!nextOpen && source !== "outside-click") {
      window.requestAnimationFrame(() => {
        const triggerButton = triggerRef.current?.querySelector("button");

        if (triggerButton instanceof HTMLButtonElement) {
          triggerButton.focus();
        }
      });
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      const targetElement = event.target as HTMLElement | null;

      if (targetElement == null) {
        return;
      }

      if (triggerRef.current?.contains(targetElement)) {
        return;
      }

      if (targetElement.closest('[data-ktn-dropdown-layer="true"]') != null) {
        return;
      }

      setDropdownOpen(false, "outside-click", event);
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        setDropdownOpen(false, "escape", event);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isControlled, disabled, onOpenChange, onAction]);

  const contextValue: DropdownMenuContextValue = {
    open: isOpen,
    setOpen: setDropdownOpen,
    size,
    variant: resolvedVariant,
    side,
    itemLayout,
    closeOnSelect,
    disabled,
    triggerRef,
    contentId,
    onAction,
  };

  const rootStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    minWidth: 0,
    ...style,
  };

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <div
        className={`${baseClasses} ${className}`.trim()}
        style={rootStyle}
        {...props}
      >
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  disabled = false,
  asChild,
  openLabel = "Open menu",
  closeLabel = "Close menu",
  className = "",
  style,
  ...props
}: DropdownMenuTriggerProps): JSX.Element {
  const {
    open,
    setOpen,
    size,
    disabled: menuDisabled,
    triggerRef,
    contentId,
  } = useDropdownMenuContextValue();
  const isDisabled = menuDisabled || disabled;

  const triggerWrapperStyle: CSSProperties = {
    display: "inline-flex",
    minWidth: 0,
    ...style,
  };

  const sizeToken = sizeTokens[size];

  const triggerContent =
    children != null ? children : <span>{open ? closeLabel : openLabel}</span>;

  const shouldUseCustomTrigger = asChild ?? isValidElement(triggerContent);
  const shouldWrapAsFocusable =
    shouldUseCustomTrigger && !hasLikelyFocusableChild(triggerContent);

  function handleTriggerToggle(event: unknown): void {
    if (!isDisabled) {
      setOpen(!open, "trigger", event);
    }
  }

  function handleTriggerKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>,
  ): void {
    if (isDisabled) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        setOpen(true, "trigger", event);
        return;
      }

      handleTriggerToggle(event);
      return;
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false, "escape", event);
    }
  }

  if (shouldUseCustomTrigger) {
    return (
      <div
        ref={triggerRef}
        className={className.trim() === "" ? undefined : className}
        style={triggerWrapperStyle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={contentId}
        aria-disabled={isDisabled || undefined}
        role={shouldWrapAsFocusable ? "button" : undefined}
        tabIndex={shouldWrapAsFocusable ? (isDisabled ? -1 : 0) : undefined}
        {...props}
        onClick={(event) => {
          props.onClick?.(event);

          if (event.defaultPrevented || isDisabled) {
            return;
          }

          const targetElement = event.target;

          if (targetElement instanceof HTMLElement) {
            const anchorElement = targetElement.closest("a[href]");

            if (anchorElement != null) {
              event.preventDefault();
            }
          }

          handleTriggerToggle(event);
        }}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);

          if (!event.defaultPrevented) {
            handleTriggerKeyDown(event);
          }
        }}
      >
        {triggerContent}
      </div>
    );
  }

  return (
    <div
      ref={triggerRef}
      className={className.trim() === "" ? undefined : className}
      style={triggerWrapperStyle}
      {...props}
    >
      <Button
        type="button"
        variant="outline"
        size={sizeToken.triggerSize}
        disabled={isDisabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={contentId}
        onAction={(event) => {
          if (!isDisabled) {
            setOpen(!open, "trigger", event);
          }
        }}
        onKeyDown={(event) => {
          if (isDisabled) {
            return;
          }

          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true, "trigger", event);
          }

          if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false, "escape", event);
          }
        }}
      >
        {triggerContent}
      </Button>
    </div>
  );
}

export function DropdownMenuContent({
  children,
  side,
  sideOffset = 6,
  align = "start",
  className = "",
  style,
  ...props
}: DropdownMenuContentProps): JSX.Element | null {
  const {
    open,
    size,
    variant,
    itemLayout,
    side: rootSide,
    triggerRef,
    setOpen,
    contentId,
  } = useDropdownMenuContextValue();

  const sizeToken = sizeTokens[size];
  const variantToken = variantTokens[variant];

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<FloatingPosition | null>(null);
  const [isReady, setIsReady] = useState(false);

  const resolvedSide = side ?? rootSide;

  useEffect(() => {
    if (!open) {
      setPosition(null);
      setIsReady(false);
      return;
    }

    function updatePosition(): void {
      const anchorRect = triggerRef.current?.getBoundingClientRect();
      const contentRect = contentRef.current?.getBoundingClientRect();

      if (anchorRect == null || contentRect == null) {
        return;
      }

      const nextPosition = resolveFloatingPosition(
        anchorRect,
        contentRect.width,
        contentRect.height,
        resolvedSide,
        align,
        sideOffset,
      );

      setPosition(nextPosition);
      setIsReady(true);
    }

    const rafId = window.requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, open, resolvedSide, sideOffset, triggerRef]);

  useEffect(() => {
    if (!(open && isReady)) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      const contentNode = contentRef.current;

      if (contentNode == null) {
        return;
      }

      const focusableItems = getFocusableMenuItems(contentNode);
      const focusTarget = focusableItems[0] ?? contentNode;
      focusTarget.focus();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isReady, open]);

  if (!open) {
    return null;
  }

  const panelStyle = getPanelStyle(
    sizeToken,
    variantToken,
    itemLayout,
    position?.x ?? FLOATING_VIEWPORT_MARGIN,
    position?.y ?? FLOATING_VIEWPORT_MARGIN,
    isReady,
  );

  const composedStyle: CSSProperties = {
    ...panelStyle,
    ...style,
  };

  const viewportStyle: CSSProperties = {
    maxHeight: `calc(100vh - ${FLOATING_VIEWPORT_MARGIN * 2}px)`,
    maxWidth: `calc(100vw - ${FLOATING_VIEWPORT_MARGIN * 2}px)`,
    overscrollBehavior: "contain",
    scrollbarGutter: "stable both-edges",
  };

  const contentStackStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    minWidth: 0,
  };

  const portalNode = renderPortal(
    <div
      ref={contentRef}
      id={contentId}
      role="menu"
      tabIndex={-1}
      aria-orientation="vertical"
      data-ktn-dropdown-layer="true"
      className={className.trim() === "" ? undefined : className}
      style={composedStyle}
      {...props}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        if (event.key === "Escape") {
          event.preventDefault();
          setOpen(false, "escape", event);
          return;
        }

        if (event.key === "Tab") {
          setOpen(false, "open-change", event);
          return;
        }

        if (
          event.key !== "ArrowDown" &&
          event.key !== "ArrowUp" &&
          event.key !== "Home" &&
          event.key !== "End"
        ) {
          return;
        }

        const contentNode = contentRef.current;

        if (contentNode == null) {
          return;
        }

        const focusableItems = getFocusableMenuItems(contentNode);

        if (focusableItems.length === 0) {
          return;
        }

        event.preventDefault();

        if (event.key === "Home") {
          focusableItems[0]?.focus();
          return;
        }

        if (event.key === "End") {
          focusableItems[focusableItems.length - 1]?.focus();
          return;
        }

        const activeElement = document.activeElement;
        const currentIndex =
          activeElement instanceof HTMLButtonElement
            ? focusableItems.indexOf(activeElement)
            : -1;

        if (event.key === "ArrowDown") {
          const nextIndex =
            currentIndex < 0 ? 0 : (currentIndex + 1) % focusableItems.length;
          focusableItems[nextIndex]?.focus();
          return;
        }

        const previousIndex =
          currentIndex < 0
            ? focusableItems.length - 1
            : (currentIndex - 1 + focusableItems.length) %
              focusableItems.length;
        focusableItems[previousIndex]?.focus();
      }}
    >
      <Scrollbar
        axis="y"
        role="presentation"
        tabIndex={-1}
        style={viewportStyle}
      >
        <div style={contentStackStyle}>{children}</div>
      </Scrollbar>
    </div>,
  );

  return portalNode;
}

export function DropdownMenuGroup({
  children,
  className = "",
  style,
  ...props
}: DropdownMenuGroupProps): JSX.Element {
  const groupStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.05rem",
    minWidth: 0,
    ...style,
  };

  return (
    <div
      className={className.trim() === "" ? undefined : className}
      style={groupStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({
  children,
  inset = false,
  className = "",
  style,
  ...props
}: DropdownMenuLabelProps): JSX.Element {
  const { size, variant } = useDropdownMenuContextValue();
  const sizeToken = sizeTokens[size];
  const variantToken = variantTokens[variant];

  const labelStyle: CSSProperties = {
    margin: 0,
    minWidth: 0,
    display: "inline-flex",
    alignItems: "center",
    minHeight: `calc(${sizeToken.itemHeight} - 0.35rem)`,
    paddingInline: inset
      ? `calc(${sizeToken.itemPaddingInline} + ${sizeToken.iconSize + 8}px)`
      : sizeToken.itemPaddingInline,
    fontSize: sizeToken.labelFontSize,
    fontWeight: 600,
    lineHeight: 1.3,
    color: variantToken.labelColor,
    ...style,
  };

  return (
    <div
      className={className.trim() === "" ? undefined : className}
      style={labelStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({
  className = "",
  style,
  ...props
}: DropdownMenuSeparatorProps): JSX.Element {
  const { variant } = useDropdownMenuContextValue();
  const variantToken = variantTokens[variant];

  const separatorStyle: CSSProperties = {
    width: "100%",
    height: "1px",
    backgroundColor: variantToken.separatorColor,
    marginBlock: "0.18rem",
    borderRadius: "999px",
    ...style,
  };

  return (
    <div
      role="separator"
      className={className.trim() === "" ? undefined : className}
      style={separatorStyle}
      {...props}
    />
  );
}

export function DropdownMenuItem({
  children,
  disabled = false,
  destructive = false,
  inset = false,
  icon,
  shortcut,
  checked,
  checkIcon,
  keepOpenOnSelect,
  onSelect,
  submenu,
  submenuSide = "auto",
  submenuOffset = 6,
  className = "",
  style,
  ...props
}: DropdownMenuItemProps): JSX.Element {
  const {
    role,
    onClick,
    onKeyDown,
    ["aria-label"]: ariaLabel,
    ...restProps
  } = props;
  const {
    size,
    variant,
    itemLayout,
    closeOnSelect,
    setOpen,
    disabled: menuDisabled,
    onAction,
  } = useDropdownMenuContextValue();

  const sizeToken = sizeTokens[size];
  const variantToken = variantTokens[variant];

  const [isHovered, setIsHovered] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [submenuPosition, setSubmenuPosition] =
    useState<FloatingPosition | null>(null);
  const [isSubmenuReady, setIsSubmenuReady] = useState(false);
  const itemRef = useRef<HTMLButtonElement | null>(null);
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const submenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const hasSubmenu = submenu != null;
  const isSelectableItem = checked !== undefined;
  const resolvedDisabled = menuDisabled || disabled;
  const shouldCloseOnSelect =
    keepOpenOnSelect ?? (!hasSubmenu && !isSelectableItem);
  const resolvedRole = role ?? "menuitem";
  const isSelectionItemRole =
    resolvedRole === "menuitemcheckbox" || resolvedRole === "menuitemradio";
  const itemText =
    typeof ariaLabel === "string" && ariaLabel.trim() !== ""
      ? ariaLabel
      : typeof children === "string"
        ? children
        : undefined;

  function isHtmlElement(target: EventTarget | null): target is HTMLElement {
    return target instanceof HTMLElement;
  }

  function isWithinDropdownLayer(target: EventTarget | null): boolean {
    return (
      isHtmlElement(target) &&
      target.closest('[data-ktn-dropdown-layer="true"]') != null
    );
  }

  function isMovingIntoOwnSubmenu(target: EventTarget | null): boolean {
    return (
      isHtmlElement(target) && submenuRef.current?.contains(target) === true
    );
  }

  function clearSubmenuCloseTimer(): void {
    if (submenuCloseTimerRef.current != null) {
      clearTimeout(submenuCloseTimerRef.current);
      submenuCloseTimerRef.current = null;
    }
  }

  function openSubmenu(): void {
    clearSubmenuCloseTimer();
    setIsSubmenuOpen(true);
  }

  function closeSubmenu(useDelay: boolean): void {
    clearSubmenuCloseTimer();

    if (!useDelay) {
      setIsSubmenuOpen(false);
      return;
    }

    submenuCloseTimerRef.current = setTimeout(() => {
      setIsSubmenuOpen(false);
      submenuCloseTimerRef.current = null;
    }, SUBMENU_HOVER_CLOSE_DELAY_MS);
  }

  useEffect(() => {
    return () => {
      clearSubmenuCloseTimer();
    };
  }, []);

  useEffect(() => {
    if (!isSubmenuOpen) {
      setSubmenuPosition(null);
      setIsSubmenuReady(false);
      return;
    }

    function updateSubmenuPosition(): void {
      const anchorRect = itemRef.current?.getBoundingClientRect();
      const submenuRect = submenuRef.current?.getBoundingClientRect();

      if (anchorRect == null || submenuRect == null) {
        return;
      }

      const preferredSubmenuSide =
        submenuSide === "auto" ? "right" : submenuSide;

      const nextPosition = resolveFloatingPosition(
        anchorRect,
        submenuRect.width,
        submenuRect.height,
        preferredSubmenuSide,
        "start",
        submenuOffset,
      );

      setSubmenuPosition(nextPosition);
      setIsSubmenuReady(true);
    }

    const rafId = window.requestAnimationFrame(updateSubmenuPosition);

    window.addEventListener("resize", updateSubmenuPosition);
    window.addEventListener("scroll", updateSubmenuPosition, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateSubmenuPosition);
      window.removeEventListener("scroll", updateSubmenuPosition, true);
    };
  }, [isSubmenuOpen, submenuOffset, submenuSide]);

  const rowStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    minHeight: sizeToken.itemHeight,
    border: "none",
    backgroundColor: isHovered
      ? destructive
        ? variantToken.destructiveHoverBackgroundColor
        : variantToken.itemHoverBackgroundColor
      : "transparent",
    color: destructive
      ? variantToken.destructiveTextColor
      : variantToken.itemTextColor,
    cursor: resolvedDisabled ? "not-allowed" : "pointer",
    opacity: resolvedDisabled ? 0.62 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.35rem",
    borderRadius: "var(--ktn-radius-sm, 0.375rem)",
    paddingInline: sizeToken.itemPaddingInline,
    fontSize: sizeToken.itemFontSize,
    lineHeight: 1.3,
    textAlign: "start",
    transition: "background-color 120ms ease, color 120ms ease",
    ...(inset
      ? {
          paddingInlineStart: `calc(${sizeToken.itemPaddingInline} + ${sizeToken.iconSize + 8}px)`,
        }
      : {}),
    ...style,
  };

  const leftWrapStyle: CSSProperties = {
    minWidth: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    flex: 1,
  };

  const iconWrapStyle: CSSProperties = {
    width: `${sizeToken.iconSize}px`,
    minWidth: `${sizeToken.iconSize}px`,
    height: `${sizeToken.iconSize}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 0,
    color: destructive
      ? variantToken.destructiveTextColor
      : variantToken.itemTextColor,
  };

  const selectionIndicatorWrapStyle: CSSProperties = {
    width: `${sizeToken.iconSize}px`,
    minWidth: `${sizeToken.iconSize}px`,
    height: `${sizeToken.iconSize}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 0,
    color: destructive
      ? variantToken.destructiveTextColor
      : variantToken.itemTextColor,
  };

  const labelWrapStyle: CSSProperties = {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const trailingWrapStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    minWidth: 0,
    color: variantToken.shortcutColor,
  };

  const shortcutStyle: CSSProperties = {
    fontSize: sizeToken.shortcutFontSize,
    lineHeight: 1.2,
    color: variantToken.shortcutColor,
    whiteSpace: "nowrap",
  };

  const hasLeadingIcon = icon != null;

  function handleSelect(event?: unknown): void {
    if (resolvedDisabled) {
      return;
    }

    if (hasSubmenu) {
      openSubmenu();
      return;
    }

    onSelect?.();

    const nextChecked =
      resolvedRole === "menuitemcheckbox"
        ? !Boolean(checked)
        : resolvedRole === "menuitemradio"
          ? true
          : checked;
    const willCloseMenu = closeOnSelect && shouldCloseOnSelect;

    onAction?.({
      source: "item-select",
      open: !willCloseMenu,
      itemText,
      checked: isSelectionItemRole ? nextChecked : undefined,
      event,
    });

    if (willCloseMenu) {
      setOpen(false, "item-select", event);
    }
  }

  const panelStyle = getPanelStyle(
    sizeToken,
    variantToken,
    itemLayout,
    submenuPosition?.x ?? FLOATING_VIEWPORT_MARGIN,
    submenuPosition?.y ?? FLOATING_VIEWPORT_MARGIN,
    isSubmenuReady,
  );

  const submenuViewportStyle: CSSProperties = {
    maxHeight: `calc(100vh - ${FLOATING_VIEWPORT_MARGIN * 2}px)`,
    maxWidth: `calc(100vw - ${FLOATING_VIEWPORT_MARGIN * 2}px)`,
    overscrollBehavior: "contain",
    scrollbarGutter: "stable both-edges",
  };

  const submenuStackStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    minWidth: 0,
  };

  return (
    <>
      <button
        ref={itemRef}
        type="button"
        data-ktn-dropdown-item="true"
        role={resolvedRole}
        aria-checked={isSelectionItemRole ? checked === true : undefined}
        aria-disabled={resolvedDisabled}
        aria-haspopup={hasSubmenu ? "menu" : undefined}
        aria-expanded={hasSubmenu ? isSubmenuOpen : undefined}
        className={className.trim() === "" ? undefined : className}
        style={rowStyle}
        {...restProps}
        onMouseEnter={() => {
          if (!resolvedDisabled) {
            setIsHovered(true);

            if (hasSubmenu) {
              openSubmenu();
            }
          }
        }}
        onMouseLeave={(event: MouseEvent<HTMLButtonElement>) => {
          setIsHovered(false);

          if (hasSubmenu) {
            if (!isMovingIntoOwnSubmenu(event.relatedTarget)) {
              closeSubmenu(true);
            }
          }
        }}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            handleSelect(event);
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.defaultPrevented || resolvedDisabled || !hasSubmenu) {
            return;
          }

          if (event.key === "ArrowRight") {
            event.preventDefault();
            openSubmenu();

            window.requestAnimationFrame(() => {
              const submenuNode = submenuRef.current;

              if (submenuNode == null) {
                return;
              }

              const focusableSubmenuItems = getFocusableMenuItems(submenuNode);
              const focusTarget = focusableSubmenuItems[0] ?? submenuNode;
              focusTarget.focus();
            });
          }

          if (event.key === "ArrowLeft" && isSubmenuOpen) {
            event.preventDefault();
            closeSubmenu(false);
          }
        }}
      >
        <span style={leftWrapStyle}>
          {hasLeadingIcon ? <span style={iconWrapStyle}>{icon}</span> : null}

          <span style={labelWrapStyle}>{children}</span>
        </span>

        <span style={trailingWrapStyle}>
          {shortcut != null ? (
            <span style={shortcutStyle}>{shortcut}</span>
          ) : null}
          {checked === true ? (
            <span style={selectionIndicatorWrapStyle}>
              {checkIcon ?? <FiCheck size={sizeToken.iconSize} />}
            </span>
          ) : null}
          {hasSubmenu ? <FiChevronRight size={sizeToken.iconSize} /> : null}
        </span>
      </button>

      {hasSubmenu && isSubmenuOpen
        ? renderPortal(
            <div
              ref={submenuRef}
              data-ktn-dropdown-layer="true"
              tabIndex={-1}
              role="menu"
              style={panelStyle}
              onMouseEnter={() => {
                openSubmenu();
              }}
              onMouseLeave={(event: MouseEvent<HTMLDivElement>) => {
                if (isWithinDropdownLayer(event.relatedTarget)) {
                  return;
                }

                closeSubmenu(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  closeSubmenu(false);
                  itemRef.current?.focus();
                  return;
                }

                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  closeSubmenu(false);
                  itemRef.current?.focus();
                }
              }}
            >
              <Scrollbar
                axis="y"
                role="presentation"
                tabIndex={-1}
                style={submenuViewportStyle}
              >
                <div style={submenuStackStyle}>{submenu}</div>
              </Scrollbar>
            </div>,
          )
        : null}
    </>
  );
}

export function DropdownMenuCheckboxItem({
  checked = false,
  onCheckedChange,
  indicatorIcon,
  onSelect,
  ...props
}: DropdownMenuCheckboxItemProps): JSX.Element {
  return (
    <DropdownMenuItem
      role="menuitemcheckbox"
      checked={checked}
      checkIcon={indicatorIcon}
      keepOpenOnSelect
      onSelect={() => {
        onCheckedChange?.(!checked);
        onSelect?.();
      }}
      {...props}
    />
  );
}

export function DropdownMenuRadioGroup({
  children,
  value,
  defaultValue,
  onValueChange,
  className = "",
  style,
  ...props
}: DropdownMenuRadioGroupProps): JSX.Element {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? null,
  );
  const resolvedValue = isControlled ? (value ?? null) : uncontrolledValue;

  function setValue(nextValue: string): void {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  const contextValue: DropdownMenuRadioGroupContextValue = {
    value: resolvedValue,
    setValue,
  };

  const groupStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.05rem",
    ...style,
  };

  return (
    <DropdownMenuRadioGroupContext.Provider value={contextValue}>
      <div
        className={className.trim() === "" ? undefined : className}
        style={groupStyle}
        {...props}
      >
        {children}
      </div>
    </DropdownMenuRadioGroupContext.Provider>
  );
}

export function DropdownMenuRadioItem({
  value,
  indicatorIcon,
  onSelect,
  ...props
}: DropdownMenuRadioItemProps): JSX.Element {
  const radioGroupContext = useDropdownMenuRadioGroupContextValue();
  const isSelected = radioGroupContext?.value === value;

  return (
    <DropdownMenuItem
      role="menuitemradio"
      checked={isSelected}
      checkIcon={indicatorIcon ?? <FiCheck size={12} />}
      keepOpenOnSelect
      onSelect={() => {
        radioGroupContext?.setValue(value);
        onSelect?.();
      }}
      {...props}
    />
  );
}
