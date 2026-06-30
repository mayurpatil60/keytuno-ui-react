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
import { Separator } from "./Separator";
import {
  FiChevronDown,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiMenu,
} from "./icons/feather";

export type SidebarVariant = "default" | "outline" | "soft";
export type SidebarSize = "xs" | "sm" | "md" | "lg";
export type SidebarActionSource =
  | "item-select"
  | "submenu-toggle"
  | "collapse-toggle"
  | "mobile-toggle"
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
  defaultExpanded?: boolean;
  expanded?: boolean;
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
  mobileOpen: boolean;
  nextMobileOpen?: boolean;
  isMobileViewport: boolean;
  size: SidebarSize;
  variant: SidebarVariant;
  event?: unknown;
}

export interface SidebarSectionSeparatorContext {
  index: number;
  sectionId?: string;
  collapsed: boolean;
  mobileViewport: boolean;
}

export interface SidebarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  sections?: SidebarSection[];
  header?: ReactNode;
  footer?: ReactNode;
  size?: SidebarSize;
  variant?: SidebarVariant;
  varient?: SidebarVariant;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  responsive?: boolean;
  collapseBreakpoint?: number;
  iconOnly?: boolean;
  showCollapseToggle?: boolean;
  showMobileToggle?: boolean;
  closeMobileOnSelect?: boolean;
  activeItemId?: string;
  defaultActiveItemId?: string;
  onActiveItemChange?: (itemId: string) => void;
  onItemSelect?: (item: SidebarItem) => void;
  sectionSpacing?: CSSProperties["rowGap"];
  sectionPaddingTop?: CSSProperties["paddingTop"];
  sectionPaddingBottom?: CSSProperties["paddingBottom"];
  showSectionSeparators?: boolean;
  sectionSeparatorInset?: CSSProperties["paddingInline"];
  sectionSeparatorSize?: "xs" | "sm" | "md" | "lg";
  sectionSeparatorStyle?: CSSProperties;
  renderSectionSeparator?: (
    context: SidebarSectionSeparatorContext,
  ) => ReactNode;
  onAction?: (context: SidebarActionContext) => void;
  emptyText?: ReactNode;
}

type SidebarSizeTokens = {
  expandedWidth: string;
  collapsedWidth: string;
  mobileWidth: string;
  panelPadding: string;
  sectionGap: string;
  itemHeight: string;
  itemPaddingInline: string;
  itemFontSize: string;
  iconSize: number;
  sectionTitleFontSize: string;
};

type SidebarVariantTokens = {
  panelBackgroundColor: string;
  panelBorderColor: string;
  panelShadow: string;
  textColor: string;
  mutedTextColor: string;
  itemHoverBackgroundColor: string;
  itemActiveBackgroundColor: string;
  itemActiveTextColor: string;
  indicatorColor: string;
};

const baseClasses = "relative inline-flex min-w-0 max-w-full";

const sizeTokens: Record<SidebarSize, SidebarSizeTokens> = {
  xs: {
    expandedWidth: "14rem",
    collapsedWidth: "3.6rem",
    mobileWidth: "min(92vw, 15rem)",
    panelPadding: "0.48rem",
    sectionGap: "0.38rem",
    itemHeight: "1.82rem",
    itemPaddingInline: "0.5rem",
    itemFontSize: "0.74rem",
    iconSize: 13,
    sectionTitleFontSize: "0.62rem",
  },
  sm: {
    expandedWidth: "15.5rem",
    collapsedWidth: "4rem",
    mobileWidth: "min(92vw, 16.5rem)",
    panelPadding: "0.55rem",
    sectionGap: "0.45rem",
    itemHeight: "2rem",
    itemPaddingInline: "0.56rem",
    itemFontSize: "0.79rem",
    iconSize: 14,
    sectionTitleFontSize: "0.66rem",
  },
  md: {
    expandedWidth: "17rem",
    collapsedWidth: "4.2rem",
    mobileWidth: "min(92vw, 18rem)",
    panelPadding: "0.62rem",
    sectionGap: "0.52rem",
    itemHeight: "2.25rem",
    itemPaddingInline: "0.64rem",
    itemFontSize: "0.86rem",
    iconSize: 15,
    sectionTitleFontSize: "0.7rem",
  },
  lg: {
    expandedWidth: "19rem",
    collapsedWidth: "4.4rem",
    mobileWidth: "min(92vw, 20rem)",
    panelPadding: "0.72rem",
    sectionGap: "0.6rem",
    itemHeight: "2.45rem",
    itemPaddingInline: "0.72rem",
    itemFontSize: "0.92rem",
    iconSize: 16,
    sectionTitleFontSize: "0.74rem",
  },
};

const variantTokens: Record<SidebarVariant, SidebarVariantTokens> = {
  default: {
    panelBackgroundColor: "var(--ktn-bg-surface, #ffffff)",
    panelBorderColor: "var(--ktn-border-muted)",
    panelShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemHoverBackgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.14))",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 16%, transparent)",
    itemActiveTextColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 90%, black)",
    indicatorColor: "var(--ktn-action-primary-bg)",
  },
  outline: {
    panelBackgroundColor: "var(--ktn-bg-surface, #ffffff)",
    panelBorderColor: "var(--ktn-border-strong, var(--ktn-border-muted))",
    panelShadow: "0 10px 24px rgba(15, 23, 42, 0.1)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemHoverBackgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.12))",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 13%, transparent)",
    itemActiveTextColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 88%, black)",
    indicatorColor: "var(--ktn-action-primary-bg)",
  },
  soft: {
    panelBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 90%, var(--ktn-bg-muted, #f1f5f9))",
    panelBorderColor: "var(--ktn-border-muted)",
    panelShadow: "0 10px 24px rgba(15, 23, 42, 0.1)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemHoverBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-muted, rgba(100, 116, 139, 0.14)) 88%, transparent)",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 16%, transparent)",
    itemActiveTextColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 90%, black)",
    indicatorColor: "var(--ktn-action-primary-bg)",
  },
};

function resolveVariant(
  variant: SidebarVariant | undefined,
  varient: SidebarVariant | undefined,
): SidebarVariant {
  if (variant != null) {
    return variant;
  }

  if (varient != null) {
    return varient;
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
  const badge = item.badge;

  if (badge == null) {
    return null;
  }

  if (typeof badge === "string" || typeof badge === "number") {
    const badgeSize = size === "lg" ? "sm" : "xs";

    return (
      <Badge size={badgeSize} variant="secondary">
        {badge}
      </Badge>
    );
  }

  return badge;
}

export function Sidebar({
  sections = [],
  header,
  footer,
  size = "md",
  variant,
  varient,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  mobileOpen,
  defaultMobileOpen = false,
  onMobileOpenChange,
  responsive = true,
  collapseBreakpoint = 992,
  iconOnly = false,
  showCollapseToggle = true,
  showMobileToggle = true,
  closeMobileOnSelect = true,
  activeItemId,
  defaultActiveItemId,
  onActiveItemChange,
  onItemSelect,
  sectionSpacing,
  sectionPaddingTop,
  sectionPaddingBottom,
  showSectionSeparators = false,
  sectionSeparatorInset = "0.45rem",
  sectionSeparatorSize = "sm",
  sectionSeparatorStyle,
  renderSectionSeparator,
  onAction,
  emptyText = "No navigation items.",
  className = "",
  style,
  onKeyDown,
  ...props
}: SidebarProps): JSX.Element {
  const isCollapsedControlled = collapsed !== undefined;
  const isMobileOpenControlled = mobileOpen !== undefined;
  const isActiveControlled = activeItemId !== undefined;

  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    useState<boolean>(defaultCollapsed);

  const [uncontrolledMobileOpen, setUncontrolledMobileOpen] =
    useState<boolean>(defaultMobileOpen);

  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
    if (!responsive || typeof window === "undefined") {
      return false;
    }

    return window.innerWidth <= collapseBreakpoint;
  });

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
    if (!responsive) {
      setIsMobileViewport(false);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    function handleResize(): void {
      setIsMobileViewport(window.innerWidth <= collapseBreakpoint);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [collapseBreakpoint, responsive]);

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

  useEffect(() => {
    if (!isMobileViewport && !isMobileOpenControlled) {
      setUncontrolledMobileOpen(false);
    }
  }, [isMobileOpenControlled, isMobileViewport]);

  const resolvedVariant = resolveVariant(variant, varient);
  const tokens = sizeTokens[size];
  const colors = variantTokens[resolvedVariant];

  const resolvedCollapsed = isCollapsedControlled
    ? (collapsed ?? false)
    : uncontrolledCollapsed;

  const resolvedMobileOpen = isMobileOpenControlled
    ? (mobileOpen ?? false)
    : uncontrolledMobileOpen;

  const resolvedActiveItemId = isActiveControlled
    ? (activeItemId ?? null)
    : uncontrolledActiveItemId;

  const collapseToggleLocked = iconOnly === true;
  const resolvedIconOnly = iconOnly || resolvedCollapsed;
  const shouldRenderPanel =
    !isMobileViewport || !showMobileToggle || resolvedMobileOpen;

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
      nextMobileOpen?: boolean;
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      itemId: options?.item?.id,
      itemLabel:
        options?.item != null ? toLabelText(options.item.label) : undefined,
      collapsed: resolvedIconOnly,
      nextCollapsed: options?.nextCollapsed,
      mobileOpen: resolvedMobileOpen,
      nextMobileOpen: options?.nextMobileOpen,
      isMobileViewport,
      size,
      variant: resolvedVariant,
      event: options?.event,
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

  function setMobileOpenState(
    nextOpen: boolean,
    source: SidebarActionSource,
    event?: unknown,
  ): void {
    if (!isMobileOpenControlled) {
      setUncontrolledMobileOpen(nextOpen);
    }

    onMobileOpenChange?.(nextOpen);
    emitAction(source, {
      nextMobileOpen: nextOpen,
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

    if (closeMobileOnSelect && isMobileViewport) {
      setMobileOpenState(false, "mobile-toggle", event);
    }
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

    if (event.key === "Escape" && isMobileViewport && resolvedMobileOpen) {
      setMobileOpenState(false, "escape-close", event);
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
          const indentation = Math.max(depth - 1, 0) * 0.8;
          const badgeNode = resolveBadge(item, size);
          const labelText =
            item.ariaLabel ?? toLabelText(item.label) ?? item.id;

          const rowStyle: CSSProperties = {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: resolvedIconOnly ? "center" : "flex-start",
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
            paddingInlineStart: resolvedIconOnly
              ? "0.36rem"
              : `calc(${tokens.itemPaddingInline} + ${indentation}rem)`,
            paddingInlineEnd: resolvedIconOnly
              ? "0.36rem"
              : tokens.itemPaddingInline,
            transition:
              "background-color 140ms ease, color 140ms ease, opacity 140ms ease",
            cursor: itemDisabled ? "not-allowed" : "pointer",
            opacity: itemDisabled ? 0.55 : 1,
            userSelect: "none",
          };

          const iconStyle: CSSProperties = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: `${tokens.iconSize + 4}px`,
            minWidth: `${tokens.iconSize + 4}px`,
            color: itemHighlighted
              ? colors.itemActiveTextColor
              : colors.mutedTextColor,
            lineHeight: 0,
          };

          const labelStyle: CSSProperties = {
            display: resolvedIconOnly ? "none" : "inline-flex",
            alignItems: "center",
            minWidth: 0,
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          };

          const tailStyle: CSSProperties = {
            display: resolvedIconOnly ? "none" : "inline-flex",
            alignItems: "center",
            gap: "0.32rem",
            marginInlineStart: "0.35rem",
            color: colors.mutedTextColor,
            flexShrink: 0,
          };

          const baseRowProps = {
            "aria-label": labelText,
            title: resolvedIconOnly ? labelText : undefined,
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
                      borderRadius: "var(--ktn-radius-sm, 0.375rem)",
                      backgroundColor: "transparent",
                      color: colors.mutedTextColor,
                      padding: 0,
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

              {itemHighlighted && !resolvedIconOnly ? (
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
            itemHasChildren && itemExpanded && !resolvedIconOnly ? (
              <div
                style={{
                  marginTop: "0.16rem",
                  paddingInlineStart: "0.42rem",
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

  const composedClassName = `${baseClasses} ${className}`.trim();

  const panelStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: tokens.sectionGap,
    width: resolvedIconOnly
      ? tokens.collapsedWidth
      : isMobileViewport
        ? tokens.mobileWidth
        : tokens.expandedWidth,
    minWidth: resolvedIconOnly
      ? tokens.collapsedWidth
      : isMobileViewport
        ? tokens.mobileWidth
        : tokens.expandedWidth,
    maxWidth: resolvedIconOnly
      ? tokens.collapsedWidth
      : isMobileViewport
        ? tokens.mobileWidth
        : tokens.expandedWidth,
    border: `1px solid ${colors.panelBorderColor}`,
    borderRadius: "var(--ktn-radius-lg, 0.75rem)",
    backgroundColor: colors.panelBackgroundColor,
    color: colors.textColor,
    padding: tokens.panelPadding,
    boxShadow: colors.panelShadow,
    transition: "width 180ms ease, min-width 180ms ease, max-width 180ms ease",
  };

  const rootStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    flexDirection: "column",
    gap: isMobileViewport ? "0.5rem" : 0,
    ...style,
  };

  return (
    <div
      className={composedClassName}
      style={rootStyle}
      onKeyDown={handleRootKeyDown}
      {...props}
    >
      {isMobileViewport && showMobileToggle ? (
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <Button
            variant="outline"
            size={size === "lg" ? "md" : size === "xs" ? "xs" : "sm"}
            onAction={(event) => {
              setMobileOpenState(!resolvedMobileOpen, "mobile-toggle", event);
            }}
            iconOnly={false}
          >
            <FiMenu size={tokens.iconSize} aria-hidden />
            {resolvedMobileOpen ? "Hide menu" : "Open menu"}
          </Button>
        </div>
      ) : null}

      {shouldRenderPanel ? (
        <aside style={panelStyle} aria-label="Sidebar">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: resolvedIconOnly ? "center" : "space-between",
              gap: "0.5rem",
            }}
          >
            {!resolvedIconOnly ? (
              <div
                style={{
                  minWidth: 0,
                  flex: 1,
                  color: colors.textColor,
                }}
              >
                {header}
              </div>
            ) : null}

            {showCollapseToggle ? (
              <Button
                variant="ghost"
                size={size === "lg" ? "md" : size === "xs" ? "xs" : "sm"}
                iconOnly
                iconOnlyTone
                tooltip={
                  collapseToggleLocked
                    ? "Icon-only mode is controlled by prop"
                    : resolvedIconOnly
                      ? "Expand sidebar"
                      : "Collapse sidebar"
                }
                disabled={collapseToggleLocked}
                onAction={(event) => {
                  if (collapseToggleLocked) {
                    return;
                  }

                  setCollapsedState(!resolvedCollapsed, event);
                }}
              >
                {resolvedIconOnly ? (
                  <FiChevronsRight size={tokens.iconSize} aria-hidden />
                ) : (
                  <FiChevronsLeft size={tokens.iconSize} aria-hidden />
                )}
              </Button>
            ) : null}
          </div>

          <nav
            aria-label="Sidebar navigation"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: sectionSpacing ?? tokens.sectionGap,
              minHeight: 0,
            }}
          >
            {sections.length === 0 ? (
              <div
                style={{
                  minHeight: "4rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: resolvedIconOnly ? "center" : "flex-start",
                  paddingInline: resolvedIconOnly ? 0 : "0.45rem",
                  fontSize: tokens.itemFontSize,
                  color: colors.mutedTextColor,
                }}
              >
                {!resolvedIconOnly ? emptyText : null}
              </div>
            ) : (
              sections.map((section, sectionIndex) => (
                <section
                  key={section.id ?? `section-${sectionIndex}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.24rem",
                    paddingTop:
                      sectionPaddingTop ??
                      (sectionIndex === 0 ? "0.18rem" : "0.48rem"),
                    paddingBottom: sectionPaddingBottom,
                  }}
                >
                  {showSectionSeparators && sectionIndex > 0 ? (
                    <div
                      style={{
                        paddingInline: sectionSeparatorInset,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {renderSectionSeparator?.({
                        index: sectionIndex,
                        sectionId: section.id,
                        collapsed: resolvedIconOnly,
                        mobileViewport: isMobileViewport,
                      }) ?? (
                        <Separator
                          size={sectionSeparatorSize}
                          style={sectionSeparatorStyle}
                        />
                      )}
                    </div>
                  ) : null}

                  {!resolvedIconOnly && section.title != null ? (
                    <div
                      style={{
                        fontSize: tokens.sectionTitleFontSize,
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

          {!resolvedIconOnly && footer != null ? (
            <div
              style={{
                marginTop: "auto",
                paddingTop: "0.45rem",
                borderTop: `1px solid ${colors.panelBorderColor}`,
                color: colors.mutedTextColor,
              }}
            >
              {footer}
            </div>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}
