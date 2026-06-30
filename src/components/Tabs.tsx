import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

export type TabsVariant = "line" | "button" | "only icon";
export type TabsOrientation = "horizontal" | "vertical";
export type TabsSize = "xs" | "sm" | "md" | "lg";
export type TabsSide = "left" | "top" | "bottom" | "right";
export type TabsActionSource = "value-change" | "tab-focus" | "tab-blur";

export interface TabsActionContext {
  source: TabsActionSource;
  value: string | null;
  previousValue?: string | null;
  triggerValue?: string;
  orientation: TabsOrientation;
  side: TabsSide;
  variant: TabsVariant;
  size: TabsSize;
  disabled: boolean;
  event?: unknown;
}

export interface TabsItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  items: TabsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onAction?: (context: TabsActionContext) => void;
  variant?: TabsVariant;
  varient?: TabsVariant;
  orientation?: TabsOrientation;
  size?: TabsSize;
  side?: TabsSide;
  disabled?: boolean;
  emptyText?: ReactNode;
}

type TabsSizeTokens = {
  triggerHeight: string;
  fontSize: string;
  paddingInline: string;
  radius: string;
  panelPadding: string;
  iconButtonSize: string;
  gap: string;
  indicatorThickness: string;
};

const sizeTokens: Record<TabsSize, TabsSizeTokens> = {
  xs: {
    triggerHeight: "1.75rem",
    fontSize: "0.75rem",
    paddingInline: "0.5rem",
    radius: "var(--ktn-radius-sm, 0.375rem)",
    panelPadding: "0.6rem",
    iconButtonSize: "1.75rem",
    gap: "0.35rem",
    indicatorThickness: "2px",
  },
  sm: {
    triggerHeight: "2.05rem",
    fontSize: "0.8125rem",
    paddingInline: "0.6rem",
    radius: "var(--ktn-radius-sm, 0.375rem)",
    panelPadding: "0.7rem",
    iconButtonSize: "2.05rem",
    gap: "0.4rem",
    indicatorThickness: "2px",
  },
  md: {
    triggerHeight: "2.3rem",
    fontSize: "0.875rem",
    paddingInline: "0.7rem",
    radius: "var(--ktn-radius-md, 0.5rem)",
    panelPadding: "0.85rem",
    iconButtonSize: "2.3rem",
    gap: "0.45rem",
    indicatorThickness: "2px",
  },
  lg: {
    triggerHeight: "2.55rem",
    fontSize: "0.9375rem",
    paddingInline: "0.8rem",
    radius: "var(--ktn-radius-md, 0.5rem)",
    panelPadding: "1rem",
    iconButtonSize: "2.55rem",
    gap: "0.5rem",
    indicatorThickness: "2px",
  },
};

function resolveVariant(
  variant: TabsVariant | undefined,
  varient: TabsVariant | undefined,
): TabsVariant {
  if (variant != null) {
    return variant;
  }

  if (varient != null) {
    return varient;
  }

  return "line";
}

function isItemDisabled(item: TabsItem, disabled: boolean): boolean {
  return disabled || item.disabled === true;
}

function getFirstEnabledValue(
  items: TabsItem[],
  disabled: boolean,
): string | null {
  const firstEnabled = items.find((item) => !isItemDisabled(item, disabled));
  return firstEnabled?.value ?? null;
}

function resolveActiveValue(
  candidateValue: string | undefined,
  items: TabsItem[],
  disabled: boolean,
): string | null {
  if (candidateValue != null) {
    const matchingItem = items.find((item) => item.value === candidateValue);

    if (matchingItem != null && !isItemDisabled(matchingItem, disabled)) {
      return matchingItem.value;
    }
  }

  return getFirstEnabledValue(items, disabled);
}

function getTextLabel(label: ReactNode, fallback: string): string {
  if (typeof label === "string") {
    const trimmed = label.trim();
    return trimmed === "" ? fallback : trimmed;
  }

  if (typeof label === "number") {
    return String(label);
  }

  return fallback;
}

function getLineTrackStyle(
  orientation: TabsOrientation,
  side: TabsSide,
): CSSProperties {
  if (orientation === "horizontal") {
    if (side === "bottom") {
      return {
        borderTop: "1px solid var(--ktn-border-muted)",
      };
    }

    return {
      borderBottom: "1px solid var(--ktn-border-muted)",
    };
  }

  if (side === "right") {
    return {
      borderLeft: "1px solid var(--ktn-border-muted)",
    };
  }

  return {
    borderRight: "1px solid var(--ktn-border-muted)",
  };
}

function getLineIndicatorStyle(
  orientation: TabsOrientation,
  side: TabsSide,
  thickness: string,
  isActive: boolean,
): CSSProperties {
  const color = isActive ? "var(--ktn-action-primary-bg)" : "transparent";

  if (orientation === "horizontal") {
    if (side === "bottom") {
      return {
        borderTop: `${thickness} solid ${color}`,
      };
    }

    return {
      borderBottom: `${thickness} solid ${color}`,
    };
  }

  if (side === "right") {
    return {
      borderLeft: `${thickness} solid ${color}`,
    };
  }

  return {
    borderRight: `${thickness} solid ${color}`,
  };
}

function getRootDirection(side: TabsSide): CSSProperties["flexDirection"] {
  if (side === "bottom") {
    return "column-reverse";
  }

  if (side === "left") {
    return "row";
  }

  if (side === "right") {
    return "row-reverse";
  }

  return "column";
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  onAction,
  variant,
  varient,
  orientation = "horizontal",
  size = "md",
  side = "top",
  disabled = false,
  emptyText = "No tab available.",
  className = "",
  style,
  ...props
}: TabsProps): JSX.Element {
  const baseId = useId();
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isControlled = value !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
    () => resolveActiveValue(defaultValue, items, disabled),
  );

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledValue((current) =>
        resolveActiveValue(current ?? undefined, items, disabled),
      );
    }
  }, [disabled, isControlled, items]);

  const resolvedVariant = resolveVariant(variant, varient);
  const tokens = sizeTokens[size];

  const activeValue = resolveActiveValue(
    isControlled ? value : (uncontrolledValue ?? undefined),
    items,
    disabled,
  );

  const activeItem = items.find((item) => item.value === activeValue) ?? null;
  const activeItemIndex =
    activeItem != null
      ? items.findIndex((item) => item.value === activeItem.value)
      : -1;
  const activePanelId =
    activeItemIndex >= 0 ? `${baseId}-panel-${activeItemIndex}` : undefined;
  const activeTriggerId =
    activeItemIndex >= 0 ? `${baseId}-tab-${activeItemIndex}` : undefined;

  const enabledItems = useMemo(
    () => items.filter((item) => !isItemDisabled(item, disabled)),
    [disabled, items],
  );

  function emitAction(
    source: TabsActionSource,
    options?: {
      value?: string | null;
      previousValue?: string | null;
      triggerValue?: string;
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      value: options?.value ?? activeValue,
      previousValue: options?.previousValue,
      triggerValue: options?.triggerValue,
      orientation,
      side,
      variant: resolvedVariant,
      size,
      disabled,
      event: options?.event,
    });
  }

  function setActiveValue(nextValue: string, event?: unknown): void {
    const previousValue = activeValue;

    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
    emitAction("value-change", {
      value: nextValue,
      previousValue,
      triggerValue: nextValue,
      event,
    });
  }

  function focusAndSelectIndex(nextIndex: number, event?: unknown): void {
    if (enabledItems.length === 0) {
      return;
    }

    const normalizedIndex =
      (nextIndex + enabledItems.length) % enabledItems.length;
    const nextItem = enabledItems[normalizedIndex];

    if (nextItem == null) {
      return;
    }

    setActiveValue(nextItem.value, event);
    triggerRefs.current[nextItem.value]?.focus();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (enabledItems.length === 0) {
      return;
    }

    const currentIndex = enabledItems.findIndex(
      (item) => item.value === activeValue,
    );
    const fallbackIndex = currentIndex >= 0 ? currentIndex : 0;

    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";

    if (event.key === nextKey) {
      event.preventDefault();
      focusAndSelectIndex(fallbackIndex + 1, event);
      return;
    }

    if (event.key === prevKey) {
      event.preventDefault();
      focusAndSelectIndex(fallbackIndex - 1, event);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusAndSelectIndex(0, event);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusAndSelectIndex(enabledItems.length - 1, event);
    }
  }

  const rootStyle: CSSProperties = {
    display: "flex",
    flexDirection: getRootDirection(side),
    alignItems: "stretch",
    gap: resolvedVariant === "line" ? "0.5rem" : "0.75rem",
    width: "100%",
    ...style,
  };

  const listStyle: CSSProperties = {
    display: "inline-flex",
    flexDirection: orientation === "horizontal" ? "row" : "column",
    alignItems: "stretch",
    width: orientation === "horizontal" ? "100%" : "auto",
    flexShrink: 0,
    gap:
      orientation === "vertical"
        ? 0
        : resolvedVariant === "line"
          ? 0
          : tokens.gap,
    ...(resolvedVariant === "line" ? getLineTrackStyle(orientation, side) : {}),
  };

  const panelWrapStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const panelStyle: CSSProperties = {
    minWidth: 0,
  };

  return (
    <div
      className={className.trim() === "" ? undefined : className}
      style={rootStyle}
      {...props}
    >
      <div
        role="tablist"
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        style={listStyle}
      >
        {items.map((item, index) => {
          const itemDisabled = isItemDisabled(item, disabled);
          const isActive = item.value === activeValue;
          const triggerId = `${baseId}-tab-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          const triggerBaseStyle: CSSProperties = {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: tokens.gap,
            border: "1px solid transparent",
            backgroundColor: "transparent",
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
            height:
              resolvedVariant === "only icon"
                ? tokens.iconButtonSize
                : tokens.triggerHeight,
            paddingInline:
              resolvedVariant === "only icon" ? 0 : tokens.paddingInline,
            minWidth:
              resolvedVariant === "only icon"
                ? tokens.iconButtonSize
                : undefined,
            borderRadius: resolvedVariant === "line" ? 0 : tokens.radius,
            fontSize: tokens.fontSize,
            fontWeight: 500,
            lineHeight: 1.2,
            opacity: itemDisabled ? 0.58 : 1,
            cursor: itemDisabled ? "not-allowed" : "pointer",
            transition:
              "background-color 120ms ease, color 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
          };

          const triggerVariantStyle: CSSProperties =
            resolvedVariant === "line"
              ? {
                  color: isActive
                    ? "var(--ktn-action-primary-bg)"
                    : "var(--ktn-text-secondary, var(--ktn-text-primary))",
                  ...getLineIndicatorStyle(
                    orientation,
                    side,
                    tokens.indicatorThickness,
                    isActive,
                  ),
                }
              : resolvedVariant === "button"
                ? {
                    borderColor: isActive
                      ? "var(--ktn-action-primary-bg)"
                      : "var(--ktn-border-muted)",
                    backgroundColor: isActive
                      ? "var(--ktn-action-primary-bg)"
                      : "var(--ktn-bg-surface, #ffffff)",
                    color: isActive
                      ? "var(--ktn-action-primary-fg)"
                      : "var(--ktn-text-primary)",
                  }
                : {
                    borderColor: isActive
                      ? "var(--ktn-border-strong, var(--ktn-border-muted))"
                      : "var(--ktn-border-muted)",
                    backgroundColor: isActive
                      ? "var(--ktn-bg-muted, rgba(100, 116, 139, 0.1))"
                      : "transparent",
                    color: isActive
                      ? "var(--ktn-text-primary)"
                      : "var(--ktn-text-secondary, var(--ktn-text-primary))",
                  };

          const verticalGroupStyle: CSSProperties =
            orientation === "vertical" && resolvedVariant !== "line"
              ? {
                  borderRadius: 0,
                  ...(index === 0
                    ? {
                        borderTopLeftRadius: tokens.radius,
                        borderTopRightRadius: tokens.radius,
                      }
                    : {
                        marginTop: "-1px",
                      }),
                  ...(index === items.length - 1
                    ? {
                        borderBottomLeftRadius: tokens.radius,
                        borderBottomRightRadius: tokens.radius,
                      }
                    : {}),
                }
              : {};

          const iconStyle: CSSProperties = {
            lineHeight: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          };

          const iconFallbackText = getTextLabel(item.label, item.value)
            .slice(0, 1)
            .toUpperCase();

          return (
            <button
              key={item.value}
              id={triggerId}
              ref={(element) => {
                triggerRefs.current[item.value] = element;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              aria-disabled={itemDisabled || undefined}
              aria-label={
                resolvedVariant === "only icon"
                  ? getTextLabel(item.label, item.value)
                  : undefined
              }
              tabIndex={isActive ? 0 : -1}
              disabled={itemDisabled}
              style={{
                ...triggerBaseStyle,
                ...triggerVariantStyle,
                ...verticalGroupStyle,
              }}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                if (!itemDisabled) {
                  setActiveValue(item.value, event);
                }
              }}
              onFocus={(event: FocusEvent<HTMLButtonElement>) => {
                emitAction("tab-focus", {
                  triggerValue: item.value,
                  event,
                });
              }}
              onBlur={(event: FocusEvent<HTMLButtonElement>) => {
                emitAction("tab-blur", {
                  triggerValue: item.value,
                  event,
                });
              }}
              onKeyDown={handleTriggerKeyDown}
            >
              {item.icon != null ? (
                <span style={iconStyle}>{item.icon}</span>
              ) : resolvedVariant === "only icon" ? (
                <span style={iconStyle}>{iconFallbackText}</span>
              ) : null}
              {resolvedVariant !== "only icon" ? (
                <span>{item.label}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div style={panelWrapStyle}>
        {activeItem != null ? (
          <div
            id={activePanelId}
            role="tabpanel"
            aria-labelledby={activeTriggerId}
            style={panelStyle}
          >
            {activeItem.content}
          </div>
        ) : (
          <div style={panelStyle}>{emptyText}</div>
        )}
      </div>
    </div>
  );
}
