import {
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { Badge } from "./Badge";
import { Button } from "./Button";
import { Scrollbar } from "./Scrollbar";
import { Separator } from "./Separator";
import {
  FiChevronDown,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "./icons/feather";

export type SidebarVariant =
  | "default"
  | "dark"
  | "light"
  | "brand-dark"
  | "brand-light";
export type SidebarSize = "xs" | "sm" | "md" | "lg";
export type SidebarActionSource =
  | "item-select"
  | "submenu-toggle"
  | "collapse-toggle"
  | "escape-close";

export type SidebarItemActionEvent = ReactMouseEvent<HTMLElement>;

export interface SidebarItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  href?: string;
  disabled?: boolean;
  active?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  items?: SidebarItem[];
  ariaLabel?: string;
  onAction?: (event: SidebarItemActionEvent) => void;
}

export interface SidebarSection {
  id?: string;
  title?: ReactNode;
  items: SidebarItem[];
}

export interface SidebarActionContext {
  source: SidebarActionSource;
  itemId?: string;
  itemLabel?: string;
  collapsed: boolean;
  nextCollapsed?: boolean;
  open: boolean;
  nextOpen?: boolean;
  size: SidebarSize;
  variant: SidebarVariant;
  event?: unknown;
}

export interface SidebarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  sections?: SidebarSection[];
  size?: SidebarSize;
  variant?: SidebarVariant;
  brandLogo?: ReactNode;
  brandName?: ReactNode;
  brandTagline?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  showItemIcons?: boolean;
  activeItemId?: string;
  defaultActiveItemId?: string;
  onActiveItemChange?: (itemId: string) => void;
  onItemSelect?: (item: SidebarItem) => void;
  onAction?: (context: SidebarActionContext) => void;
  panelAriaLabel?: string;
  navigationAriaLabel?: string;
  emptyText?: ReactNode;
}

type SidebarSizeTokens = {
  expandedWidth: string;
  collapsedWidth: string;
  panelPadding: string;
  sectionGap: string;
  itemHeight: string;
  itemPaddingInline: string;
  itemFontSize: string;
  iconSize: number;
  titleFontSize: string;
  brandNameFontSize: string;
  brandTaglineFontSize: string;
};

type SidebarVariantTokens = {
  panelBackgroundColor: string;
  panelBorderColor: string;
  panelShadow: string;
  textColor: string;
  mutedTextColor: string;
  itemIconColor: string;
  itemHoverBackgroundColor: string;
  itemActiveBackgroundColor: string;
  itemActiveTextColor: string;
  indicatorColor: string;
  collapseBorderColor: string;
};

const baseClasses = "relative inline-flex min-w-0 max-w-full";

const sizeTokens: Record<SidebarSize, SidebarSizeTokens> = {
  xs: {
    expandedWidth: "14.5rem",
    collapsedWidth: "3.75rem",
    panelPadding: "0.55rem",
    sectionGap: "0.42rem",
    itemHeight: "1.9rem",
    itemPaddingInline: "0.52rem",
    itemFontSize: "0.74rem",
    iconSize: 13,
    titleFontSize: "0.62rem",
    brandNameFontSize: "0.8rem",
    brandTaglineFontSize: "0.66rem",
  },
  sm: {
    expandedWidth: "16rem",
    collapsedWidth: "4.05rem",
    panelPadding: "0.62rem",
    sectionGap: "0.48rem",
    itemHeight: "2.05rem",
    itemPaddingInline: "0.58rem",
    itemFontSize: "0.8rem",
    iconSize: 14,
    titleFontSize: "0.67rem",
    brandNameFontSize: "0.86rem",
    brandTaglineFontSize: "0.7rem",
  },
  md: {
    expandedWidth: "17.5rem",
    collapsedWidth: "4.3rem",
    panelPadding: "0.68rem",
    sectionGap: "0.56rem",
    itemHeight: "2.25rem",
    itemPaddingInline: "0.66rem",
    itemFontSize: "0.86rem",
    iconSize: 15,
    titleFontSize: "0.71rem",
    brandNameFontSize: "0.92rem",
    brandTaglineFontSize: "0.74rem",
  },
  lg: {
    expandedWidth: "19.25rem",
    collapsedWidth: "4.55rem",
    panelPadding: "0.76rem",
    sectionGap: "0.62rem",
    itemHeight: "2.46rem",
    itemPaddingInline: "0.74rem",
    itemFontSize: "0.92rem",
    iconSize: 16,
    titleFontSize: "0.75rem",
    brandNameFontSize: "0.98rem",
    brandTaglineFontSize: "0.78rem",
  },
};

const variantTokens: Record<SidebarVariant, SidebarVariantTokens> = {
  default: {
    panelBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 95%, var(--ktn-bg-default, #f8fafc) 5%)",
    panelBorderColor: "var(--ktn-border-muted)",
    panelShadow: "0 14px 30px rgba(15, 23, 42, 0.12)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemIconColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemHoverBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #e2e8f0) 75%, transparent)",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 16%, transparent)",
    itemActiveTextColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 82%, black)",
    indicatorColor: "var(--ktn-action-primary-bg, #2563eb)",
    collapseBorderColor: "var(--ktn-border-muted)",
  },
  light: {
    panelBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 96%, #dbeafe 4%)",
    panelBorderColor:
      "color-mix(in srgb, var(--ktn-border-muted, #e2e8f0) 88%, #bfdbfe 12%)",
    panelShadow: "0 14px 30px rgba(15, 23, 42, 0.11)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemIconColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemHoverBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #e2e8f0) 72%, transparent)",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 16%, transparent)",
    itemActiveTextColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 82%, black)",
    indicatorColor: "var(--ktn-action-primary-bg, #2563eb)",
    collapseBorderColor:
      "color-mix(in srgb, var(--ktn-border-muted, #e2e8f0) 84%, #bfdbfe 16%)",
  },
  dark: {
    panelBackgroundColor: "color-mix(in srgb, #0f172a 88%, #111827 12%)",
    panelBorderColor: "color-mix(in srgb, #94a3b8 26%, #0f172a 74%)",
    panelShadow: "0 20px 42px rgba(2, 6, 23, 0.58)",
    textColor: "#f8fafc",
    mutedTextColor: "color-mix(in srgb, #e2e8f0 76%, #94a3b8 24%)",
    itemIconColor: "color-mix(in srgb, #f8fafc 92%, #cbd5e1 8%)",
    itemHoverBackgroundColor: "color-mix(in srgb, #334155 38%, transparent)",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 42%, transparent)",
    itemActiveTextColor: "#ffffff",
    indicatorColor: "#93c5fd",
    collapseBorderColor: "color-mix(in srgb, #94a3b8 22%, #0f172a 78%)",
  },
  "brand-dark": {
    panelBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 27%, #0f172a 73%)",
    panelBorderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 40%, #0f172a 60%)",
    panelShadow: "0 22px 44px rgba(2, 6, 23, 0.6)",
    textColor: "#eff6ff",
    mutedTextColor: "color-mix(in srgb, #dbeafe 78%, #93c5fd 22%)",
    itemIconColor: "color-mix(in srgb, #eff6ff 92%, #bfdbfe 8%)",
    itemHoverBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 26%, transparent)",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 52%, transparent)",
    itemActiveTextColor: "#ffffff",
    indicatorColor: "#bfdbfe",
    collapseBorderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 32%, #0f172a 68%)",
  },
  "brand-light": {
    panelBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 10%, var(--ktn-bg-surface, #ffffff) 90%)",
    panelBorderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 24%, var(--ktn-border-muted, #e2e8f0) 76%)",
    panelShadow: "0 16px 34px rgba(15, 23, 42, 0.11)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemIconColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemHoverBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 9%, transparent)",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 18%, transparent)",
    itemActiveTextColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 85%, black)",
    indicatorColor: "var(--ktn-action-primary-bg, #2563eb)",
    collapseBorderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 20%, var(--ktn-border-muted, #e2e8f0) 80%)",
  },
};

function resolveVariant(variant: SidebarVariant | undefined): SidebarVariant {
  if (variant != null) {
    return variant;
  }

  return "default";
}

function hasChildren(item: SidebarItem): boolean {
  return item.items != null && item.items.length > 0;
}

function toLabelText(label: ReactNode): string | undefined {
  if (typeof label === "string") {
    const trimmed = label.trim();
    return trimmed === "" ? undefined : trimmed;
  }

  if (typeof label === "number") {
    return String(label);
  }

  if (Array.isArray(label)) {
    const joined = label
      .map((value) => toLabelText(value) ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return joined === "" ? undefined : joined;
  }

  return undefined;
}

function findFirstEnabledItemId(items: SidebarItem[]): string | null {
  for (const item of items) {
    if (item.disabled !== true) {
      return item.id;
    }

    if (hasChildren(item)) {
      const next = findFirstEnabledItemId(item.items ?? []);

      if (next != null) {
        return next;
      }
    }
  }

  return null;
}

function findFirstEnabledItemIdFromSections(
  sections: SidebarSection[],
): string | null {
  for (const section of sections) {
    const next = findFirstEnabledItemId(section.items);

    if (next != null) {
      return next;
    }
  }

  return null;
}

function findExplicitActiveItemId(items: SidebarItem[]): string | null {
  for (const item of items) {
    if (item.active === true && item.disabled !== true) {
      return item.id;
    }

    if (hasChildren(item)) {
      const next = findExplicitActiveItemId(item.items ?? []);

      if (next != null) {
        return next;
      }
    }
  }

  return null;
}

function findExplicitActiveItemIdFromSections(
  sections: SidebarSection[],
): string | null {
  for (const section of sections) {
    const next = findExplicitActiveItemId(section.items);

    if (next != null) {
      return next;
    }
  }

  return null;
}

function findItemById(items: SidebarItem[], id: string): SidebarItem | null {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }

    if (hasChildren(item)) {
      const next = findItemById(item.items ?? [], id);

      if (next != null) {
        return next;
      }
    }
  }

  return null;
}

function findItemByIdFromSections(
  sections: SidebarSection[],
  id: string,
): SidebarItem | null {
  for (const section of sections) {
    const next = findItemById(section.items, id);

    if (next != null) {
      return next;
    }
  }

  return null;
}

function resolveInitialActiveItemId(
  sections: SidebarSection[],
  defaultActiveItemId: string | undefined,
): string | null {
  if (defaultActiveItemId != null) {
    const defaultItem = findItemByIdFromSections(sections, defaultActiveItemId);

    if (defaultItem != null && defaultItem.disabled !== true) {
      return defaultItem.id;
    }
  }

  const explicitActiveItemId = findExplicitActiveItemIdFromSections(sections);

  if (explicitActiveItemId != null) {
    return explicitActiveItemId;
  }

  return findFirstEnabledItemIdFromSections(sections);
}

function mergeExpandedState(
  sections: SidebarSection[],
  previous: Record<string, boolean>,
  activeItemId: string | null,
): Record<string, boolean> {
  const next: Record<string, boolean> = {};

  function walk(items: SidebarItem[]): boolean {
    let branchHasActive = false;

    for (const item of items) {
      const itemIsActive = activeItemId != null && item.id === activeItemId;
      const children = item.items ?? [];
      const childHasActive = children.length > 0 ? walk(children) : false;

      if (children.length > 0) {
        if (item.expanded != null) {
          next[item.id] = item.expanded;
        } else {
          const previousValue =
            previous[item.id] ?? item.defaultExpanded ?? false;
          next[item.id] = itemIsActive || childHasActive || previousValue;
        }
      }

      if (itemIsActive || childHasActive) {
        branchHasActive = true;
      }
    }

    return branchHasActive;
  }

  sections.forEach((section) => {
    walk(section.items);
  });

  return next;
}

function itemContainsActive(
  item: SidebarItem,
  activeItemId: string | null,
): boolean {
  if (activeItemId == null) {
    return false;
  }

  if (item.id === activeItemId) {
    return true;
  }

  return (item.items ?? []).some((child) =>
    itemContainsActive(child, activeItemId),
  );
}

function resolveBadge(item: SidebarItem, size: SidebarSize): ReactNode {
  if (item.badge == null) {
    return null;
  }

  if (typeof item.badge === "string" || typeof item.badge === "number") {
    return (
      <Badge size={size === "lg" ? "sm" : "xs"} variant="secondary">
        {item.badge}
      </Badge>
    );
  }

  return item.badge;
}

function resolveControlButtonSize(size: SidebarSize): "xs" | "sm" | "md" {
  if (size === "xs") {
    return "xs";
  }

  if (size === "lg") {
    return "md";
  }

  return "sm";
}

function resolveDefaultBrandBadgeVariant(
  variant: SidebarVariant,
): "primary" | "secondary" {
  if (variant === "dark" || variant === "brand-dark") {
    return "secondary";
  }

  return "primary";
}

export function Sidebar({
  sections = [],
  size = "md",
  variant,
  brandLogo,
  brandName = "Keytuno",
  brandTagline = "Workspace",
  footer,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  open,
  defaultOpen = true,
  onOpenChange,
  closeOnEscape = true,
  showItemIcons = true,
  activeItemId,
  defaultActiveItemId,
  onActiveItemChange,
  onItemSelect,
  onAction,
  panelAriaLabel = "Sidebar",
  navigationAriaLabel = "Sidebar navigation",
  emptyText = "No navigation items.",
  className = "",
  style,
  onKeyDown,
  ...props
}: SidebarProps): JSX.Element | null {
  const isCollapsedControlled = collapsed !== undefined;
  const isOpenControlled = open !== undefined;
  const isActiveControlled = activeItemId !== undefined;

  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    useState<boolean>(defaultCollapsed);
  const [uncontrolledOpen, setUncontrolledOpen] =
    useState<boolean>(defaultOpen);
  const [uncontrolledActiveItemId, setUncontrolledActiveItemId] = useState<
    string | null
  >(() => resolveInitialActiveItemId(sections, defaultActiveItemId));
  const [expandedById, setExpandedById] = useState<Record<string, boolean>>(
    () =>
      mergeExpandedState(
        sections,
        {},
        resolveInitialActiveItemId(sections, defaultActiveItemId),
      ),
  );

  useEffect(() => {
    if (isActiveControlled) {
      return;
    }

    setUncontrolledActiveItemId((current) => {
      if (current != null) {
        const currentItem = findItemByIdFromSections(sections, current);

        if (currentItem != null && currentItem.disabled !== true) {
          return current;
        }
      }

      return resolveInitialActiveItemId(sections, defaultActiveItemId);
    });
  }, [defaultActiveItemId, isActiveControlled, sections]);

  const resolvedVariant = resolveVariant(variant);
  const tokens = sizeTokens[size];
  const colors = variantTokens[resolvedVariant];
  const resolvedCollapsed = isCollapsedControlled
    ? (collapsed ?? false)
    : uncontrolledCollapsed;
  const resolvedOpen = isOpenControlled ? (open ?? true) : uncontrolledOpen;
  const resolvedActiveItemId = isActiveControlled
    ? (activeItemId ?? null)
    : uncontrolledActiveItemId;

  useEffect(() => {
    setExpandedById((current) =>
      mergeExpandedState(sections, current, resolvedActiveItemId),
    );
  }, [resolvedActiveItemId, sections]);

  function emitAction(
    source: SidebarActionSource,
    options?: {
      item?: SidebarItem;
      nextCollapsed?: boolean;
      nextOpen?: boolean;
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      itemId: options?.item?.id,
      itemLabel:
        options?.item != null ? toLabelText(options.item.label) : undefined,
      collapsed: resolvedCollapsed,
      nextCollapsed: options?.nextCollapsed,
      open: resolvedOpen,
      nextOpen: options?.nextOpen,
      size,
      variant: resolvedVariant,
      event: options?.event,
    });
  }

  function setOpenState(
    nextOpen: boolean,
    source: SidebarActionSource,
    event?: unknown,
  ): void {
    if (!isOpenControlled) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
    emitAction(source, {
      nextOpen,
      event,
    });
  }

  function setCollapsedState(nextCollapsed: boolean, event?: unknown): void {
    if (!isCollapsedControlled) {
      setUncontrolledCollapsed(nextCollapsed);
    }

    onCollapsedChange?.(nextCollapsed);
    emitAction("collapse-toggle", {
      nextCollapsed,
      event,
    });
  }

  function setItemActive(
    item: SidebarItem,
    event: SidebarItemActionEvent,
  ): void {
    if (item.disabled === true) {
      return;
    }

    if (!isActiveControlled) {
      setUncontrolledActiveItemId(item.id);
    }

    onActiveItemChange?.(item.id);
    onItemSelect?.(item);
    emitAction("item-select", {
      item,
      event,
    });
  }

  function toggleSubmenu(item: SidebarItem, event: unknown): void {
    if (!hasChildren(item)) {
      return;
    }

    const currentExpanded = item.expanded ?? expandedById[item.id] ?? false;

    if (item.expanded == null) {
      setExpandedById((current) => ({
        ...current,
        [item.id]: !currentExpanded,
      }));
    }

    emitAction("submenu-toggle", {
      item,
      event,
    });
  }

  function handleRootKeyDown(event: ReactKeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Escape" && closeOnEscape && resolvedOpen) {
      setOpenState(false, "escape-close", event);
    }
  }

  function renderItems(items: SidebarItem[], depth: number): JSX.Element {
    return (
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.22rem",
        }}
      >
        {items.map((item) => {
          const itemHasChildren = hasChildren(item);
          const itemExpanded = itemHasChildren
            ? (item.expanded ??
              expandedById[item.id] ??
              item.defaultExpanded ??
              false)
            : false;
          const itemDisabled = item.disabled === true;
          const itemIsActive =
            resolvedActiveItemId != null && item.id === resolvedActiveItemId;
          const itemHasActiveChild =
            itemHasChildren &&
            (item.items ?? []).some((child) =>
              itemContainsActive(child, resolvedActiveItemId),
            );
          const itemHighlighted = itemIsActive || itemHasActiveChild;
          const indentation = Math.max(depth - 1, 0) * 0.9;
          const badgeNode = resolveBadge(item, size);
          const labelText =
            item.ariaLabel ?? toLabelText(item.label) ?? item.id;
          const shouldRenderItemIcon = showItemIcons || resolvedCollapsed;

          const rowStyle: CSSProperties = {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: resolvedCollapsed ? "center" : "flex-start",
            width: "100%",
            minHeight: tokens.itemHeight,
            border: "none",
            borderRadius: "var(--ktn-radius-sm, 0.375rem)",
            backgroundColor: itemHighlighted
              ? colors.itemActiveBackgroundColor
              : "transparent",
            color: itemHighlighted
              ? colors.itemActiveTextColor
              : colors.textColor,
            fontSize: tokens.itemFontSize,
            lineHeight: 1.25,
            textDecoration: "none",
            paddingInlineStart: resolvedCollapsed
              ? "0.4rem"
              : `calc(${tokens.itemPaddingInline} + ${indentation}rem)`,
            paddingInlineEnd: resolvedCollapsed
              ? "0.4rem"
              : tokens.itemPaddingInline,
            transition:
              "background-color 140ms ease, color 140ms ease, opacity 140ms ease",
            cursor: itemDisabled ? "not-allowed" : "pointer",
            opacity: itemDisabled ? 0.55 : 1,
            userSelect: "none",
          };

          const iconStyle: CSSProperties = {
            display: shouldRenderItemIcon ? "inline-flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            width: `${tokens.iconSize + 6}px`,
            minWidth: `${tokens.iconSize + 6}px`,
            color: itemHighlighted
              ? colors.itemActiveTextColor
              : colors.itemIconColor,
            lineHeight: 0,
          };

          const labelStyle: CSSProperties = {
            display: resolvedCollapsed ? "none" : "inline-flex",
            alignItems: "center",
            minWidth: 0,
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          };

          const tailStyle: CSSProperties = {
            display: resolvedCollapsed ? "none" : "inline-flex",
            alignItems: "center",
            gap: "0.34rem",
            marginInlineStart: "0.36rem",
            color: colors.itemIconColor,
            flexShrink: 0,
          };

          const baseRowProps = {
            "aria-label": labelText,
            title: resolvedCollapsed ? labelText : undefined,
            style: rowStyle,
          };

          const rowContent = (
            <>
              <span aria-hidden style={iconStyle}>
                {item.icon ?? <FiChevronRight size={tokens.iconSize} />}
              </span>

              <span style={labelStyle}>{item.label}</span>

              <span style={tailStyle}>
                {badgeNode}

                {itemHasChildren ? (
                  <span
                    aria-hidden
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: `${tokens.iconSize + 6}px`,
                      height: `${tokens.iconSize + 6}px`,
                      color: itemHighlighted
                        ? colors.itemActiveTextColor
                        : colors.itemIconColor,
                    }}
                  >
                    {itemExpanded ? (
                      <FiChevronDown size={tokens.iconSize - 1} aria-hidden />
                    ) : (
                      <FiChevronRight size={tokens.iconSize - 1} aria-hidden />
                    )}
                  </span>
                ) : null}
              </span>

              {itemHighlighted && !resolvedCollapsed ? (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    insetInlineStart: "0.2rem",
                    insetBlock: "0.3rem",
                    width: "3px",
                    borderRadius: "999px",
                    backgroundColor: colors.indicatorColor,
                  }}
                />
              ) : null}
            </>
          );

          const nestedContent =
            itemHasChildren && itemExpanded && !resolvedCollapsed ? (
              <div
                style={{
                  marginTop: "0.16rem",
                  paddingInlineStart: "0.45rem",
                  borderInlineStart: `1px solid ${colors.panelBorderColor}`,
                }}
              >
                {renderItems(item.items ?? [], depth + 1)}
              </div>
            ) : null;

          if (item.href != null) {
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(event) => {
                    if (itemDisabled) {
                      event.preventDefault();
                      return;
                    }

                    item.onAction?.(event);

                    if (itemHasChildren) {
                      event.preventDefault();
                      toggleSubmenu(item, event);
                      return;
                    }

                    setItemActive(item, event);
                  }}
                  onMouseEnter={(event) => {
                    if (itemDisabled || itemHighlighted) {
                      return;
                    }

                    event.currentTarget.style.backgroundColor =
                      colors.itemHoverBackgroundColor;
                  }}
                  onMouseLeave={(event) => {
                    if (itemDisabled || itemHighlighted) {
                      return;
                    }

                    event.currentTarget.style.backgroundColor = "transparent";
                  }}
                  aria-disabled={itemDisabled}
                  aria-current={itemIsActive ? "page" : undefined}
                  tabIndex={itemDisabled ? -1 : undefined}
                  {...baseRowProps}
                >
                  {rowContent}
                </a>

                {nestedContent}
              </li>
            );
          }

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={(event) => {
                  if (itemDisabled) {
                    return;
                  }

                  item.onAction?.(event);

                  if (itemHasChildren) {
                    toggleSubmenu(item, event);
                    return;
                  }

                  setItemActive(item, event);
                }}
                onMouseEnter={(event) => {
                  if (itemDisabled || itemHighlighted) {
                    return;
                  }

                  event.currentTarget.style.backgroundColor =
                    colors.itemHoverBackgroundColor;
                }}
                onMouseLeave={(event) => {
                  if (itemDisabled || itemHighlighted) {
                    return;
                  }

                  event.currentTarget.style.backgroundColor = "transparent";
                }}
                disabled={itemDisabled}
                aria-pressed={itemIsActive}
                aria-expanded={itemHasChildren ? itemExpanded : undefined}
                {...baseRowProps}
              >
                {rowContent}
              </button>

              {nestedContent}
            </li>
          );
        })}
      </ul>
    );
  }

  if (!resolvedOpen) {
    return null;
  }

  const controlButtonSize = resolveControlButtonSize(size);
  const resolvedPanelWidth = resolvedCollapsed
    ? tokens.collapsedWidth
    : tokens.expandedWidth;
  const allowCollapseToggle = showItemIcons;

  const panelStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: resolvedPanelWidth,
    minWidth: resolvedPanelWidth,
    maxWidth: resolvedPanelWidth,
    height: "100vh",
    minHeight: "100vh",
    maxHeight: "100vh",
    border: `1px solid ${colors.panelBorderColor}`,
    borderRadius: 0,
    backgroundColor: colors.panelBackgroundColor,
    color: colors.textColor,
    boxShadow: colors.panelShadow,
    padding: tokens.panelPadding,
    gap: tokens.sectionGap,
    overflow: "hidden",
    flexShrink: 0,
    transition: "width 180ms ease, min-width 180ms ease, max-width 180ms ease",
  };

  const composedClassName = `${baseClasses} ${className}`.trim();

  return (
    <div
      className={composedClassName}
      style={style}
      onKeyDown={handleRootKeyDown}
      {...props}
    >
      <aside style={panelStyle} aria-label={panelAriaLabel}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: resolvedCollapsed ? "center" : "flex-start",
            gap: "0.56rem",
            minHeight: tokens.itemHeight,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {brandLogo ?? (
              <Badge
                variant={resolveDefaultBrandBadgeVariant(resolvedVariant)}
                size="sm"
              >
                KT
              </Badge>
            )}
          </span>

          {!resolvedCollapsed ? (
            <span
              style={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.02rem",
              }}
            >
              <strong
                style={{
                  fontSize: tokens.brandNameFontSize,
                  lineHeight: 1.12,
                  color: colors.textColor,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {brandName}
              </strong>

              <span
                style={{
                  fontSize: tokens.brandTaglineFontSize,
                  lineHeight: 1.12,
                  color: colors.mutedTextColor,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {brandTagline}
              </span>
            </span>
          ) : null}
        </div>

        <Separator
          size={size === "xs" ? "xs" : "sm"}
          variant={resolvedVariant}
        />

        <Scrollbar
          axis="y"
          role="presentation"
          style={{
            flex: 1,
            minHeight: 0,
            marginInlineEnd: `calc(${tokens.panelPadding} * -1)`,
            paddingInlineEnd: 0,
          }}
        >
          <nav
            aria-label={navigationAriaLabel}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: tokens.sectionGap,
              minHeight: 0,
              paddingInlineEnd: tokens.panelPadding,
            }}
          >
            {sections.length === 0 ? (
              <div
                style={{
                  minHeight: "4.2rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: resolvedCollapsed ? "center" : "flex-start",
                  paddingInline: resolvedCollapsed ? "0.3rem" : "0.45rem",
                  fontSize: tokens.itemFontSize,
                  color: colors.mutedTextColor,
                }}
              >
                {!resolvedCollapsed ? emptyText : null}
              </div>
            ) : (
              sections.map((section, sectionIndex) => (
                <section
                  key={section.id ?? `section-${sectionIndex}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.24rem",
                  }}
                >
                  {sectionIndex > 0 ? (
                    <div style={{ paddingBlock: "0.22rem" }}>
                      <Separator
                        size={size === "xs" ? "xs" : "sm"}
                        variant={resolvedVariant}
                      />
                    </div>
                  ) : null}

                  {!resolvedCollapsed && section.title != null ? (
                    <div
                      style={{
                        fontSize: tokens.titleFontSize,
                        color: colors.mutedTextColor,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        fontWeight: 600,
                        paddingInline: "0.45rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {section.title}
                    </div>
                  ) : null}

                  {renderItems(section.items, 1)}
                </section>
              ))
            )}
          </nav>
        </Scrollbar>

        {footer != null && !resolvedCollapsed ? (
          <div
            style={{
              borderTop: `1px solid ${colors.panelBorderColor}`,
              paddingTop: "0.46rem",
            }}
          >
            {footer}
          </div>
        ) : null}

        {allowCollapseToggle ? (
          <div
            style={{
              marginTop: "auto",
              borderTop: `1px solid ${colors.collapseBorderColor}`,
              paddingTop: "0.46rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="ghost"
              size={controlButtonSize}
              iconOnly
              iconOnlyTone
              iconColor={colors.itemIconColor}
              onAction={(event) => {
                setCollapsedState(!resolvedCollapsed, event);
              }}
            >
              {resolvedCollapsed ? (
                <FiChevronsRight size={tokens.iconSize} aria-hidden />
              ) : (
                <FiChevronsLeft size={tokens.iconSize} aria-hidden />
              )}
            </Button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
