import {
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Badge, type BadgeProps, type BadgeSize } from "./Badge";
import { Button } from "./Button";
import { Scrollbar } from "./Scrollbar";

export type BadgeSelectDropdownVariant = "inline" | "overlay";
export type BadgeSelectSide = "auto" | "left" | "top" | "bottom" | "right";
export type BadgeSelectValue = string | string[] | null;
export type BadgeSelectActionSource = "open" | "close" | "select";

type FixedBadgeSelectSide = Exclude<BadgeSelectSide, "auto">;

export interface BadgeSelectActionContext {
  source: BadgeSelectActionSource;
  value: BadgeSelectValue;
  previousValue?: BadgeSelectValue;
  multiple: boolean;
  open: boolean;
  required: boolean;
  requestedSide: BadgeSelectSide;
  resolvedSide: FixedBadgeSelectSide;
  optionValue?: string;
  event?: unknown;
}

export interface BadgeSelectOption {
  value: string;
  label: string;
  description?: string;
  keywords?: string[];
  disabled?: boolean;
}

export interface BadgeSelectGroup {
  label: string;
  options: BadgeSelectOption[];
}

export interface BadgeSelectProps extends Omit<
  BadgeProps,
  "value" | "defaultValue" | "onChange"
> {
  dropdownVariant?: BadgeSelectDropdownVariant;
  side?: BadgeSelectSide;
  sideOffset?: number;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  multiple?: boolean;
  showSelectedValue?: boolean;
  openOptionsLabel?: string;
  closeOptionsLabel?: string;
  placeholder?: string;
  emptyText?: string;
  options?: BadgeSelectOption[];
  groups?: BadgeSelectGroup[];
  value?: BadgeSelectValue;
  defaultValue?: BadgeSelectValue;
  panelMaxHeight?: CSSProperties["maxHeight"];
  panelStyle?: CSSProperties;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  onValueChange?: (value: BadgeSelectValue) => void;
  onSelectAction?: (context: BadgeSelectActionContext) => void;
  renderItem?: (
    option: BadgeSelectOption,
    state: { selected: boolean },
  ) => ReactNode;
}

type BadgeSelectSizeTokens = {
  fontSize: string;
  panelPadding: string;
  optionHeight: string;
  optionPaddingInline: string;
  optionGap: string;
  groupLabelSize: string;
  checkSize: string;
  optionRadius: string;
  minPanelWidth: string;
  maxPanelWidth: string;
};

type NormalizedGroup = {
  label?: string;
  options: BadgeSelectOption[];
};

const EMPTY_OPTIONS: BadgeSelectOption[] = [];
const EMPTY_GROUPS: BadgeSelectGroup[] = [];

const sizeTokens: Record<BadgeSize, BadgeSelectSizeTokens> = {
  xs: {
    fontSize: "0.6875rem",
    panelPadding: "0.16rem",
    optionHeight: "1.22rem",
    optionPaddingInline: "0.38rem",
    optionGap: "0.2rem",
    groupLabelSize: "0.5625rem",
    checkSize: "0.6rem",
    optionRadius: "var(--ktn-radius-sm, 0.375rem)",
    minPanelWidth: "6.75rem",
    maxPanelWidth: "9rem",
  },
  sm: {
    fontSize: "0.75rem",
    panelPadding: "0.18rem",
    optionHeight: "1.36rem",
    optionPaddingInline: "0.42rem",
    optionGap: "0.22rem",
    groupLabelSize: "0.625rem",
    checkSize: "0.66rem",
    optionRadius: "var(--ktn-radius-sm, 0.375rem)",
    minPanelWidth: "7rem",
    maxPanelWidth: "9.5rem",
  },
  md: {
    fontSize: "0.8125rem",
    panelPadding: "0.2rem",
    optionHeight: "1.5rem",
    optionPaddingInline: "0.46rem",
    optionGap: "0.24rem",
    groupLabelSize: "0.6875rem",
    checkSize: "0.7rem",
    optionRadius: "var(--ktn-radius-sm, 0.375rem)",
    minPanelWidth: "7.5rem",
    maxPanelWidth: "10.5rem",
  },
  lg: {
    fontSize: "0.875rem",
    panelPadding: "0.22rem",
    optionHeight: "1.64rem",
    optionPaddingInline: "0.54rem",
    optionGap: "0.26rem",
    groupLabelSize: "0.75rem",
    checkSize: "0.74rem",
    optionRadius: "var(--ktn-radius-sm, 0.375rem)",
    minPanelWidth: "8rem",
    maxPanelWidth: "11.5rem",
  },
};

const baseClasses = "relative inline-flex flex-col items-start";
const VIEWPORT_PADDING = 8;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getSideSpace(side: FixedBadgeSelectSide, anchorRect: DOMRect): number {
  if (side === "bottom") {
    return window.innerHeight - anchorRect.bottom;
  }

  if (side === "top") {
    return anchorRect.top;
  }

  if (side === "right") {
    return window.innerWidth - anchorRect.right;
  }

  return anchorRect.left;
}

function resolveFloatingSide(
  requestedSide: BadgeSelectSide,
  anchorRect: DOMRect,
  panelRect: DOMRect,
  sideOffset: number,
): FixedBadgeSelectSide {
  if (requestedSide !== "auto") {
    return requestedSide;
  }

  const requiredSpace = {
    top: panelRect.height + sideOffset + VIEWPORT_PADDING,
    bottom: panelRect.height + sideOffset + VIEWPORT_PADDING,
    left: panelRect.width + sideOffset + VIEWPORT_PADDING,
    right: panelRect.width + sideOffset + VIEWPORT_PADDING,
  } satisfies Record<FixedBadgeSelectSide, number>;

  const sidePriority: FixedBadgeSelectSide[] = [
    "bottom",
    "top",
    "right",
    "left",
  ];

  for (const candidate of sidePriority) {
    if (getSideSpace(candidate, anchorRect) >= requiredSpace[candidate]) {
      return candidate;
    }
  }

  return sidePriority.reduce((best, candidate) =>
    getSideSpace(candidate, anchorRect) > getSideSpace(best, anchorRect)
      ? candidate
      : best,
  );
}

function getFloatingCoordinates(
  side: FixedBadgeSelectSide,
  anchorRect: DOMRect,
  panelRect: DOMRect,
  sideOffset: number,
): { x: number; y: number } {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const minX = VIEWPORT_PADDING;
  const maxX = Math.max(
    VIEWPORT_PADDING,
    viewportWidth - panelRect.width - VIEWPORT_PADDING,
  );
  const minY = VIEWPORT_PADDING;
  const maxY = Math.max(
    VIEWPORT_PADDING,
    viewportHeight - panelRect.height - VIEWPORT_PADDING,
  );

  let x = anchorRect.left;
  let y = anchorRect.bottom + sideOffset;

  if (side === "bottom") {
    x = anchorRect.left;
    y = anchorRect.bottom + sideOffset;
  } else if (side === "top") {
    x = anchorRect.left;
    y = anchorRect.top - panelRect.height - sideOffset;
  } else if (side === "right") {
    x = anchorRect.right + sideOffset;
    y = anchorRect.top + (anchorRect.height - panelRect.height) / 2;
  } else {
    x = anchorRect.left - panelRect.width - sideOffset;
    y = anchorRect.top + (anchorRect.height - panelRect.height) / 2;
  }

  return {
    x: clamp(x, minX, maxX),
    y: clamp(y, minY, maxY),
  };
}

function normalizeValue(
  value: BadgeSelectValue | undefined,
  multiple: boolean,
): BadgeSelectValue {
  if (multiple) {
    if (Array.isArray(value)) {
      return Array.from(
        new Set(
          value.filter(
            (item) => typeof item === "string" && item.trim() !== "",
          ),
        ),
      );
    }

    if (typeof value === "string" && value.trim() !== "") {
      return [value];
    }

    return [];
  }

  if (Array.isArray(value)) {
    const first = value.find(
      (item) => typeof item === "string" && item.trim() !== "",
    );

    return first ?? null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    return trimmed === "" ? null : trimmed;
  }

  return null;
}

function valueToArray(value: BadgeSelectValue): string[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    return [value];
  }

  return [];
}

function normalizeGroups(
  options: BadgeSelectOption[],
  groups: BadgeSelectGroup[],
): NormalizedGroup[] {
  const normalized: NormalizedGroup[] = [];

  if (groups.length > 0) {
    groups.forEach((group) => {
      const validOptions = group.options.filter(
        (option) => option.value.trim() !== "",
      );

      if (validOptions.length > 0) {
        normalized.push({
          label: group.label,
          options: validOptions,
        });
      }
    });
  }

  if (options.length > 0) {
    normalized.push({
      options: options.filter((option) => option.value.trim() !== ""),
    });
  }

  return normalized;
}

function resolveAccentColor(variant: BadgeProps["variant"]): string {
  if (variant === "destructive") {
    return "var(--ktn-action-danger-bg)";
  }

  if (variant === "success") {
    return "var(--ktn-action-success-bg)";
  }

  if (variant === "warning") {
    return "var(--ktn-action-warning-bg)";
  }

  if (variant === "accent") {
    return "var(--ktn-action-accent-bg)";
  }

  return "var(--ktn-action-primary-bg)";
}

function resolveAccentSoftColor(variant: BadgeProps["variant"]): string {
  if (variant === "destructive") {
    return "var(--ktn-action-danger-soft-bg, #fee2e2)";
  }

  if (variant === "success") {
    return "var(--ktn-action-success-soft-bg, #dcfce7)";
  }

  if (variant === "warning") {
    return "var(--ktn-action-warning-soft-bg, #fef3c7)";
  }

  if (variant === "accent") {
    return "var(--ktn-action-accent-soft-bg, #fce7f3)";
  }

  return "var(--ktn-action-primary-soft-bg, #dbeafe)";
}

export function BadgeSelect({
  dropdownVariant = "inline",
  side = "bottom",
  sideOffset = 0,
  disabled = false,
  required = false,
  invalid = false,
  multiple = false,
  showSelectedValue = true,
  openOptionsLabel = "Open options",
  closeOptionsLabel = "Close options",
  placeholder = "Select",
  emptyText = "No items found.",
  options,
  groups,
  value,
  defaultValue,
  panelMaxHeight = "8.5rem",
  panelStyle,
  containerClassName = "",
  containerStyle,
  onValueChange,
  onSelectAction,
  renderItem,
  children,
  variant,
  size = "md",
  onAction,
  onClick,
  onKeyDown,
  tabIndex,
  className = "",
  style,
  ...badgeProps
}: BadgeSelectProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOptionValue, setHoveredOptionValue] = useState<string | null>(
    null,
  );
  const [resolvedFloatingSide, setResolvedFloatingSide] =
    useState<FixedBadgeSelectSide>("bottom");
  const [floatingPosition, setFloatingPosition] = useState({ x: 0, y: 0 });

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerWrapRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const isControlled = value !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState<BadgeSelectValue>(
    () => normalizeValue(defaultValue, multiple),
  );

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledValue((current) => normalizeValue(current, multiple));
    }
  }, [isControlled, multiple]);

  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setHoveredOptionValue((current) => (current == null ? current : null));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (
        rootRef.current != null &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpenState(false, event);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const tokens = sizeTokens[size];
  const shouldFloatPanel = dropdownVariant === "overlay" || side !== "bottom";
  const resolvedSide: FixedBadgeSelectSide = shouldFloatPanel
    ? resolvedFloatingSide
    : "bottom";
  const resolvedAccentColor = resolveAccentColor(variant);
  const resolvedAccentSoftColor = resolveAccentSoftColor(variant);
  const resolvedOptions = options ?? EMPTY_OPTIONS;
  const resolvedGroups = groups ?? EMPTY_GROUPS;

  const resolvedValue = normalizeValue(
    isControlled ? value : uncontrolledValue,
    multiple,
  );
  const selectedValues = valueToArray(resolvedValue);
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const normalizedGroups = useMemo(
    () => normalizeGroups(resolvedOptions, resolvedGroups),
    [resolvedGroups, resolvedOptions],
  );

  const allOptions = useMemo(
    () => normalizedGroups.flatMap((group) => group.options),
    [normalizedGroups],
  );

  const optionByValue = useMemo(() => {
    const map = new Map<string, BadgeSelectOption>();

    allOptions.forEach((option) => {
      if (!map.has(option.value)) {
        map.set(option.value, option);
      }
    });

    return map;
  }, [allOptions]);

  const filteredGroups = normalizedGroups;

  const selectedLabels = selectedValues
    .map(
      (selectedValue) =>
        optionByValue.get(selectedValue)?.label ?? selectedValue,
    )
    .filter((label) => label.trim() !== "");

  const selectedText =
    selectedLabels.length === 0
      ? ""
      : multiple
        ? selectedLabels.length <= 2
          ? selectedLabels.join(", ")
          : `${selectedLabels.length} selected`
        : selectedLabels[0];

  const triggerLabel =
    showSelectedValue && selectedText !== ""
      ? selectedText
      : (children ?? placeholder);

  useLayoutEffect(() => {
    if (!isOpen || !shouldFloatPanel) {
      setFloatingPosition((previous) =>
        previous.x === 0 && previous.y === 0 ? previous : { x: 0, y: 0 },
      );
      setResolvedFloatingSide((previous) =>
        side === "auto" ? previous : previous === side ? previous : side,
      );
      return;
    }

    if (triggerWrapRef.current == null || panelRef.current == null) {
      return;
    }

    function updateFloatingGeometry(): void {
      if (triggerWrapRef.current == null || panelRef.current == null) {
        return;
      }

      const anchorRect = triggerWrapRef.current.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();

      const nextSide = resolveFloatingSide(
        side,
        anchorRect,
        panelRect,
        sideOffset,
      );
      const nextPosition = getFloatingCoordinates(
        nextSide,
        anchorRect,
        panelRect,
        sideOffset,
      );
      const roundedPosition = {
        x: Math.round(nextPosition.x),
        y: Math.round(nextPosition.y),
      };

      setResolvedFloatingSide((previous) =>
        previous === nextSide ? previous : nextSide,
      );
      setFloatingPosition((previous) =>
        previous.x === roundedPosition.x && previous.y === roundedPosition.y
          ? previous
          : roundedPosition,
      );
    }

    updateFloatingGeometry();
    const animationFrame = window.requestAnimationFrame(updateFloatingGeometry);
    window.addEventListener("resize", updateFloatingGeometry);
    window.addEventListener("scroll", updateFloatingGeometry, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updateFloatingGeometry);
      window.removeEventListener("scroll", updateFloatingGeometry, true);
    };
  }, [
    isOpen,
    shouldFloatPanel,
    side,
    sideOffset,
    allOptions.length,
    selectedValues.length,
    size,
    multiple,
  ]);

  function emitSelectAction(
    source: BadgeSelectActionSource,
    options?: {
      value?: BadgeSelectValue;
      previousValue?: BadgeSelectValue;
      open?: boolean;
      optionValue?: string;
      event?: unknown;
    },
  ): void {
    onSelectAction?.({
      source,
      value: options?.value ?? resolvedValue,
      previousValue: options?.previousValue,
      multiple,
      open: options?.open ?? isOpen,
      required,
      requestedSide: side,
      resolvedSide,
      optionValue: options?.optionValue,
      event: options?.event,
    });
  }

  function setOpenState(nextOpen: boolean, event?: unknown): void {
    if (disabled || nextOpen === isOpen) {
      return;
    }

    setIsOpen(nextOpen);
    emitSelectAction(nextOpen ? "open" : "close", {
      open: nextOpen,
      event,
    });
  }

  function setValue(
    nextValue: BadgeSelectValue,
    source: Extract<BadgeSelectActionSource, "select">,
    event?: unknown,
    optionValue?: string,
  ): void {
    const normalized = normalizeValue(nextValue, multiple);
    const previousValue = resolvedValue;

    if (!isControlled) {
      setUncontrolledValue(normalized);
    }

    onValueChange?.(normalized);
    emitSelectAction(source, {
      value: normalized,
      previousValue,
      optionValue,
      event,
    });
  }

  function toggleOpen(event?: unknown): void {
    if (disabled) {
      return;
    }

    setOpenState(!isOpen, event);
  }

  function handleTriggerAction(event: ReactMouseEvent<HTMLSpanElement>): void {
    onAction?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    toggleOpen(event);
  }

  function handleTriggerKeyDown(
    event: ReactKeyboardEvent<HTMLSpanElement>,
  ): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpenState(true, event);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpenState(false, event);
    }
  }

  function handleOptionSelect(
    option: BadgeSelectOption,
    event?: unknown,
  ): void {
    if (disabled || option.disabled) {
      return;
    }

    if (multiple) {
      const nextValues = new Set(selectedValues);

      if (nextValues.has(option.value)) {
        nextValues.delete(option.value);
      } else {
        nextValues.add(option.value);
      }

      setValue(Array.from(nextValues), "select", event, option.value);
      return;
    }

    setValue(option.value, "select", event, option.value);
    setOpenState(false, event);
  }

  function handleRootBlur(event: FocusEvent<HTMLDivElement>): void {
    const relatedTarget = event.relatedTarget;

    if (
      relatedTarget instanceof Node &&
      rootRef.current?.contains(relatedTarget)
    ) {
      return;
    }

    setOpenState(false, event);
  }

  const resolvedRootClassName = `${baseClasses} ${containerClassName}`.trim();

  const rootStyle: CSSProperties = {
    gap: isOpen && !shouldFloatPanel ? "0.16rem" : 0,
    ...containerStyle,
  };

  const triggerStyle: CSSProperties = {
    ...style,
    ...(disabled ? { opacity: 0.62, cursor: "not-allowed" } : {}),
  };

  const triggerContentStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.22rem",
    minWidth: 0,
  };

  const triggerTextStyle: CSSProperties = {
    display: "inline-block",
  };

  const chevronStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "0.72rem",
    height: "0.72rem",
    lineHeight: 0,
    flexShrink: 0,
    transition: "transform 120ms ease",
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
  };

  const panelPositionStyle: CSSProperties = shouldFloatPanel
    ? {
        position: "fixed",
        insetInlineStart: `${floatingPosition.x}px`,
        insetBlockStart: `${floatingPosition.y}px`,
        zIndex: 1200,
      }
    : {
        position: "relative",
        marginBlockStart: "0px",
      };

  const panelWrapperStyle: CSSProperties = {
    ...panelPositionStyle,
    width: "max-content",
    minWidth: "max-content",
    maxWidth: `min(${tokens.maxPanelWidth}, calc(100vw - 16px))`,
    borderRadius: "var(--ktn-radius-lg, 0.75rem)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    boxShadow: invalid
      ? "0 0 0 2px color-mix(in srgb, var(--ktn-action-danger-bg) 42%, transparent), var(--ktn-shadow-md, 0 6px 16px rgb(15 23 42 / 0.12))"
      : "var(--ktn-shadow-md, 0 6px 16px rgb(15 23 42 / 0.12))",
    padding: tokens.panelPadding,
    display: "flex",
    flexDirection: "column",
    gap: tokens.optionGap,
    ...panelStyle,
  };

  const listStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: tokens.optionGap,
  };

  const listViewportStyle: CSSProperties = {
    maxHeight: panelMaxHeight,
    minWidth: "inherit",
    overflowX: "hidden",
  };

  const groupStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.14rem",
  };

  const groupLabelStyle: CSSProperties = {
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    fontSize: tokens.groupLabelSize,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    paddingInline: "0.5rem",
    paddingBlock: "0.12rem 0.08rem",
  };

  const optionStyle: CSSProperties = {
    width: "max-content",
    maxWidth: "100%",
    justifyContent: "flex-start",
    height: tokens.optionHeight,
    paddingInline: tokens.optionPaddingInline,
    borderRadius: tokens.optionRadius,
    borderWidth: 0,
    lineHeight: 1,
    fontWeight: 400,
    gap: "0.22rem",
    transition: "background-color 120ms ease, color 120ms ease",
  };

  const optionHoverBackground = `color-mix(in srgb, var(--ktn-bg-hover, var(--ktn-bg-muted)) 78%, ${resolvedAccentSoftColor} 22%)`;
  const optionSelectedBackground = `color-mix(in srgb, ${resolvedAccentSoftColor} 86%, ${resolvedAccentColor} 14%)`;
  const optionAccentTextColor = `color-mix(in srgb, ${resolvedAccentColor} 90%, var(--ktn-text-primary, #0f172a))`;

  const optionTextWrapStyle: CSSProperties = {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: "0.25rem",
    minWidth: 0,
  };

  const optionLabelStyle: CSSProperties = {
    fontSize: tokens.fontSize,
    fontWeight: 400,
    color: "var(--ktn-text-primary)",
    maxWidth: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const checkMarkStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: tokens.checkSize,
    height: tokens.checkSize,
    lineHeight: 0,
    color: `color-mix(in srgb, ${resolvedAccentColor} 90%, var(--ktn-text-primary, #0f172a))`,
    flexShrink: 0,
    marginInlineStart: 0,
  };

  const emptyStyle: CSSProperties = {
    paddingBlock: "0.4rem",
    paddingInline: "0.5rem",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    fontSize: tokens.fontSize,
  };

  const resolvedTriggerTabIndex = disabled ? -1 : tabIndex;

  return (
    <div
      className={resolvedRootClassName}
      style={rootStyle}
      ref={rootRef}
      onBlur={handleRootBlur}
    >
      <span ref={triggerWrapRef} style={{ display: "inline-flex" }}>
        <Badge
          {...badgeProps}
          variant={variant}
          size={size}
          className={className}
          style={triggerStyle}
          tabIndex={resolvedTriggerTabIndex}
          onAction={(event) => {
            handleTriggerAction(event);
            onClick?.(event);
          }}
          onKeyDown={handleTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-disabled={disabled || undefined}
          aria-required={required || undefined}
          aria-invalid={invalid ? true : undefined}
          title={
            badgeProps.title ?? (isOpen ? closeOptionsLabel : openOptionsLabel)
          }
        >
          <span style={triggerContentStyle}>
            <span style={triggerTextStyle}>{triggerLabel}</span>
            <span aria-hidden style={chevronStyle}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                <path
                  d="M6 8l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>
        </Badge>
      </span>

      {isOpen ? (
        <div
          ref={panelRef}
          id={listboxId}
          role="listbox"
          aria-label={
            badgeProps["aria-labelledby"] == null
              ? (badgeProps["aria-label"] ?? placeholder)
              : undefined
          }
          aria-labelledby={badgeProps["aria-labelledby"]}
          aria-describedby={badgeProps["aria-describedby"]}
          aria-multiselectable={multiple || undefined}
          style={panelWrapperStyle}
        >
          {filteredGroups.length === 0 ? (
            <div role="status" aria-live="polite" style={emptyStyle}>
              {emptyText}
            </div>
          ) : (
            <Scrollbar
              axis="y"
              role="presentation"
              tabIndex={-1}
              style={listViewportStyle}
            >
              <div style={listStyle}>
                {filteredGroups.map((group, groupIndex) => (
                  <div
                    key={`badge-select-group-${group.label ?? "plain"}-${groupIndex}`}
                    role={
                      group.label != null && group.label.trim() !== ""
                        ? "group"
                        : undefined
                    }
                    aria-labelledby={
                      group.label != null && group.label.trim() !== ""
                        ? `${listboxId}-group-${groupIndex}-label`
                        : undefined
                    }
                    style={{
                      ...groupStyle,
                      paddingBlockStart: groupIndex > 0 ? "0.2rem" : 0,
                    }}
                  >
                    {group.label != null && group.label.trim() !== "" ? (
                      <div
                        id={`${listboxId}-group-${groupIndex}-label`}
                        style={groupLabelStyle}
                      >
                        {group.label}
                      </div>
                    ) : null}

                    {group.options.map((option, optionIndex) => {
                      const selected = selectedSet.has(option.value);
                      const hovered = hoveredOptionValue === option.value;

                      return (
                        <Button
                          key={option.value}
                          id={`${listboxId}-option-${groupIndex}-${optionIndex}`}
                          type="button"
                          variant="ghost"
                          size="xs"
                          disabled={disabled || option.disabled}
                          aria-selected={selected}
                          aria-disabled={
                            disabled || option.disabled ? true : undefined
                          }
                          role="option"
                          style={{
                            ...optionStyle,
                            backgroundColor: selected
                              ? optionSelectedBackground
                              : hovered
                                ? optionHoverBackground
                                : "transparent",
                            color: option.disabled
                              ? "var(--ktn-text-secondary, var(--ktn-text-primary))"
                              : selected
                                ? optionAccentTextColor
                                : hovered
                                  ? optionAccentTextColor
                                  : "var(--ktn-text-primary)",
                            cursor:
                              disabled || option.disabled
                                ? "not-allowed"
                                : "pointer",
                            opacity: option.disabled ? 0.6 : 1,
                          }}
                          onMouseDown={(event) => {
                            event.preventDefault();
                          }}
                          onMouseEnter={() => {
                            if (!disabled && !option.disabled) {
                              setHoveredOptionValue(option.value);
                            }
                          }}
                          onMouseLeave={() => {
                            setHoveredOptionValue((current) =>
                              current === option.value ? null : current,
                            );
                          }}
                          onFocus={() => {
                            if (!disabled && !option.disabled) {
                              setHoveredOptionValue(option.value);
                            }
                          }}
                          onBlur={() => {
                            setHoveredOptionValue((current) =>
                              current === option.value ? null : current,
                            );
                          }}
                          onClick={(event) => {
                            handleOptionSelect(option, event);
                          }}
                        >
                          {renderItem != null ? (
                            renderItem(option, { selected })
                          ) : (
                            <span style={optionTextWrapStyle}>
                              <span style={optionLabelStyle}>
                                {option.label}
                              </span>
                            </span>
                          )}

                          {selected ? (
                            <span aria-hidden style={checkMarkStyle}>
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M3.5 8.2l2.8 2.8 6.2-6.2"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          ) : null}
                        </Button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Scrollbar>
          )}
        </div>
      ) : null}
    </div>
  );
}
