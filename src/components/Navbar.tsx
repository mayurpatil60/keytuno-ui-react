import {
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { Badge } from "./Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { FiChevronDown, FiMenu } from "./icons/feather";

type NavbarLegacyVariant = "default" | "outline";
type NavbarModernVariant = "dark" | "light" | "brand-dark" | "brand-light";
export type NavbarVariant = NavbarLegacyVariant | NavbarModernVariant;
export type NavbarSize = "xs" | "sm" | "md" | "lg";
export type NavbarActionSource =
  | "item-select"
  | "submenu-select"
  | "hamburger-action";

export type NavbarItemActionEvent = ReactMouseEvent<HTMLElement> | undefined;
export type NavbarHamburgerActionEvent = ReactMouseEvent<HTMLButtonElement>;

export interface NavbarItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  href?: string;
  disabled?: boolean;
  active?: boolean;
  ariaLabel?: string;
  items?: NavbarItem[];
  onAction?: (event: NavbarItemActionEvent) => void;
}

export interface NavbarActionContext {
  source: NavbarActionSource;
  itemId?: string;
  itemLabel?: string;
  parentItemId?: string;
  size: NavbarSize;
  variant: NavbarVariant;
  event?: unknown;
}

export interface NavbarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "onChange"
> {
  brand?: ReactNode;
  defaultBrandName?: ReactNode;
  showBrand?: boolean;
  brandLogo?: ReactNode;
  brandName?: ReactNode;
  brandTagline?: ReactNode;
  showHamburger?: boolean;
  hamburgerAriaLabel?: string;
  hamburgerIcon?: ReactNode;
  hamburgerDisabled?: boolean;
  onHamburgerAction?: (event: NavbarHamburgerActionEvent) => void;
  items?: NavbarItem[];
  actions?: ReactNode;
  size?: NavbarSize;
  variant?: NavbarVariant;
  sticky?: boolean;
  desktopNavigationLabel?: string;
  activeItemId?: string;
  defaultActiveItemId?: string;
  onActiveItemChange?: (itemId: string) => void;
  onItemSelect?: (item: NavbarItem, parentItem?: NavbarItem) => void;
  onAction?: (context: NavbarActionContext) => void;
  emptyText?: ReactNode;
}

type NavbarSizeTokens = {
  minHeight: string;
  paddingInline: string;
  paddingBlock: string;
  navGap: string;
  actionGap: string;
  itemHeight: string;
  itemPaddingInline: string;
  itemFontSize: string;
  brandNameFontSize: string;
  brandTaglineFontSize: string;
  brandLogoSize: string;
  iconSize: number;
};

type NavbarVariantTokens = {
  panelBackgroundColor: string;
  panelBorderColor: string;
  panelShadow: string;
  textColor: string;
  mutedTextColor: string;
  itemActiveBackgroundColor: string;
  itemActiveTextColor: string;
};

interface NavbarItemMatch {
  item: NavbarItem;
  parentItem?: NavbarItem;
}

const baseClasses = "relative block w-full max-w-full";

const sizeTokens: Record<NavbarSize, NavbarSizeTokens> = {
  xs: {
    minHeight: "2.65rem",
    paddingInline: "0.62rem",
    paddingBlock: "0.4rem",
    navGap: "0.26rem",
    actionGap: "0.3rem",
    itemHeight: "1.82rem",
    itemPaddingInline: "0.5rem",
    itemFontSize: "0.74rem",
    brandNameFontSize: "0.79rem",
    brandTaglineFontSize: "0.64rem",
    brandLogoSize: "1.6rem",
    iconSize: 13,
  },
  sm: {
    minHeight: "3rem",
    paddingInline: "0.72rem",
    paddingBlock: "0.46rem",
    navGap: "0.3rem",
    actionGap: "0.35rem",
    itemHeight: "2rem",
    itemPaddingInline: "0.56rem",
    itemFontSize: "0.79rem",
    brandNameFontSize: "0.84rem",
    brandTaglineFontSize: "0.68rem",
    brandLogoSize: "1.78rem",
    iconSize: 14,
  },
  md: {
    minHeight: "3.35rem",
    paddingInline: "0.9rem",
    paddingBlock: "0.5rem",
    navGap: "0.34rem",
    actionGap: "0.42rem",
    itemHeight: "2.2rem",
    itemPaddingInline: "0.66rem",
    itemFontSize: "0.86rem",
    brandNameFontSize: "0.92rem",
    brandTaglineFontSize: "0.72rem",
    brandLogoSize: "1.94rem",
    iconSize: 15,
  },
  lg: {
    minHeight: "3.7rem",
    paddingInline: "1rem",
    paddingBlock: "0.56rem",
    navGap: "0.38rem",
    actionGap: "0.5rem",
    itemHeight: "2.38rem",
    itemPaddingInline: "0.72rem",
    itemFontSize: "0.92rem",
    brandNameFontSize: "0.98rem",
    brandTaglineFontSize: "0.76rem",
    brandLogoSize: "2.08rem",
    iconSize: 16,
  },
};

const variantTokens: Record<NavbarVariant, NavbarVariantTokens> = {
  default: {
    panelBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 96%, var(--ktn-bg-default, #f8fafc) 4%)",
    panelBorderColor: "var(--ktn-border-muted)",
    panelShadow: "0 10px 24px rgba(15, 23, 42, 0.1)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 14%, transparent)",
    itemActiveTextColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 88%, black)",
  },
  light: {
    panelBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 96%, var(--ktn-bg-default, #f8fafc) 4%)",
    panelBorderColor: "var(--ktn-border-muted)",
    panelShadow: "0 10px 24px rgba(15, 23, 42, 0.1)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 14%, transparent)",
    itemActiveTextColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 88%, black)",
  },
  dark: {
    panelBackgroundColor: "color-mix(in srgb, #0f172a 88%, #111827 12%)",
    panelBorderColor: "color-mix(in srgb, #94a3b8 26%, #0f172a 74%)",
    panelShadow: "0 16px 34px rgba(2, 6, 23, 0.55)",
    textColor: "#f8fafc",
    mutedTextColor: "color-mix(in srgb, #e2e8f0 72%, #94a3b8 28%)",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 42%, transparent)",
    itemActiveTextColor: "#ffffff",
  },
  "brand-dark": {
    panelBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 28%, #0f172a 72%)",
    panelBorderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 44%, #0f172a 56%)",
    panelShadow: "0 18px 38px rgba(2, 6, 23, 0.58)",
    textColor: "#eff6ff",
    mutedTextColor: "color-mix(in srgb, #dbeafe 75%, #93c5fd 25%)",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 56%, #ffffff 0%)",
    itemActiveTextColor: "#ffffff",
  },
  "brand-light": {
    panelBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 9%, var(--ktn-bg-surface, #ffffff) 91%)",
    panelBorderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 24%, var(--ktn-border-muted, #e2e8f0) 76%)",
    panelShadow: "0 12px 28px rgba(15, 23, 42, 0.09)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 18%, transparent)",
    itemActiveTextColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 82%, black)",
  },
  outline: {
    panelBackgroundColor: "var(--ktn-bg-surface, #ffffff)",
    panelBorderColor: "var(--ktn-border-strong, var(--ktn-border-muted))",
    panelShadow: "0 10px 26px rgba(15, 23, 42, 0.08)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    itemActiveBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 13%, transparent)",
    itemActiveTextColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 88%, black)",
  },
};

function resolveVariant(variant: NavbarVariant | undefined): NavbarVariant {
  if (variant != null) {
    return variant;
  }

  return "default";
}

function resolveSubmenuVariant(variant: NavbarVariant): "default" | "outline" {
  if (variant === "outline" || variant === "dark" || variant === "brand-dark") {
    return "outline";
  }

  return "default";
}

function hasChildren(item: NavbarItem): boolean {
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

function hasRenderableContent(content: ReactNode | undefined): boolean {
  if (content == null || content === false) {
    return false;
  }

  if (typeof content === "string") {
    return content.trim() !== "";
  }

  return true;
}

function resolveBadge(badge: NavbarItem["badge"], size: NavbarSize): ReactNode {
  if (badge == null) {
    return null;
  }

  if (typeof badge === "string" || typeof badge === "number") {
    return (
      <Badge size={size === "lg" ? "sm" : "xs"} variant="secondary">
        {badge}
      </Badge>
    );
  }

  return badge;
}

function findItemById(
  items: NavbarItem[],
  id: string,
  parentItem?: NavbarItem,
): NavbarItemMatch | null {
  for (const item of items) {
    if (item.id === id) {
      return {
        item,
        parentItem,
      };
    }

    if (hasChildren(item)) {
      const next = findItemById(item.items ?? [], id, item);

      if (next != null) {
        return next;
      }
    }
  }

  return null;
}

function findFirstEnabledItemId(items: NavbarItem[]): string | null {
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

function findExplicitActiveItemId(items: NavbarItem[]): string | null {
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
function resolveInitialActiveItemId(
  items: NavbarItem[],
  defaultActiveItemId: string | undefined,
): string | null {
  if (defaultActiveItemId != null) {
    const defaultItem = findItemById(items, defaultActiveItemId);

    if (defaultItem != null && defaultItem.item.disabled !== true) {
      return defaultItem.item.id;
    }
  }

  const explicitItemId = findExplicitActiveItemId(items);

  if (explicitItemId != null) {
    return explicitItemId;
  }

  return findFirstEnabledItemId(items);
}

function itemContainsActive(
  item: NavbarItem,
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

export function Navbar({
  brand,
  defaultBrandName,
  showBrand = true,
  brandLogo,
  brandName,
  brandTagline,
  showHamburger = false,
  hamburgerAriaLabel = "Toggle navigation action",
  hamburgerIcon,
  hamburgerDisabled = false,
  onHamburgerAction,
  items = [],
  actions,
  size = "md",
  variant,
  sticky = false,
  desktopNavigationLabel = "Navbar",
  activeItemId,
  defaultActiveItemId,
  onActiveItemChange,
  onItemSelect,
  onAction,
  emptyText = "No navigation items.",
  className = "",
  style,
  onKeyDown,
  ...props
}: NavbarProps): JSX.Element {
  const isActiveControlled = activeItemId !== undefined;

  const [uncontrolledActiveItemId, setUncontrolledActiveItemId] = useState<
    string | null
  >(() => resolveInitialActiveItemId(items, defaultActiveItemId));

  useEffect(() => {
    if (isActiveControlled) {
      return;
    }

    setUncontrolledActiveItemId((current) => {
      if (current != null) {
        const currentItem = findItemById(items, current);

        if (currentItem != null && currentItem.item.disabled !== true) {
          return current;
        }
      }

      return resolveInitialActiveItemId(items, defaultActiveItemId);
    });
  }, [defaultActiveItemId, isActiveControlled, items]);

  const resolvedVariant = resolveVariant(variant);
  const tokens = sizeTokens[size];
  const colors = variantTokens[resolvedVariant];
  const hasCustomBrand = hasRenderableContent(brand);
  const hasBrandLogo = hasRenderableContent(brandLogo);
  const hasBrandTagline = hasRenderableContent(brandTagline);
  const hasBrandName = hasRenderableContent(brandName);
  const hasAnyStructuredBrandValue =
    hasBrandLogo || hasBrandName || hasBrandTagline;
  const resolvedBrandName: ReactNode | undefined = hasBrandName
    ? brandName
    : !hasCustomBrand && !hasAnyStructuredBrandValue
      ? defaultBrandName
      : undefined;
  const hasResolvedBrandName = hasRenderableContent(resolvedBrandName);
  const shouldRenderStructuredBrand =
    hasBrandLogo || hasResolvedBrandName || hasBrandTagline;
  const shouldRenderBrand =
    showBrand && (hasCustomBrand || shouldRenderStructuredBrand);
  const resolvedActiveItemId = isActiveControlled
    ? (activeItemId ?? null)
    : uncontrolledActiveItemId;
  const shouldRenderHamburger = showHamburger;
  const shouldRenderDesktopNav = items.length > 0 || emptyText != null;

  function emitAction(
    source: NavbarActionSource,
    options?: {
      item?: NavbarItem;
      parentItem?: NavbarItem;
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      itemId: options?.item?.id,
      itemLabel:
        options?.item != null ? toLabelText(options.item.label) : undefined,
      parentItemId: options?.parentItem?.id,
      size,
      variant: resolvedVariant,
      event: options?.event,
    });
  }

  function setItemActive(
    item: NavbarItem,
    options?: {
      source?: NavbarActionSource;
      parentItem?: NavbarItem;
      event?: NavbarItemActionEvent;
    },
  ): void {
    if (item.disabled === true) {
      return;
    }

    if (!isActiveControlled) {
      setUncontrolledActiveItemId(item.id);
    }

    onActiveItemChange?.(item.id);
    onItemSelect?.(item, options?.parentItem);
    item.onAction?.(options?.event);

    emitAction(options?.source ?? "item-select", {
      item,
      parentItem: options?.parentItem,
      event: options?.event,
    });
  }

  function buildItemStyle(
    highlighted: boolean,
    disabled: boolean,
    block: boolean,
    indentationLevel = 0,
  ): CSSProperties {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "flex-start",
      width: block ? "100%" : "auto",
      minHeight: tokens.itemHeight,
      border: "1px solid transparent",
      borderRadius: "var(--ktn-radius-sm, 0.375rem)",
      backgroundColor: highlighted
        ? colors.itemActiveBackgroundColor
        : "transparent",
      color: highlighted ? colors.itemActiveTextColor : colors.textColor,
      fontSize: tokens.itemFontSize,
      lineHeight: 1.25,
      textDecoration: "none",
      paddingInlineStart: `calc(${tokens.itemPaddingInline} + ${indentationLevel * 0.55}rem)`,
      paddingInlineEnd: tokens.itemPaddingInline,
      transition:
        "background-color 140ms ease, color 140ms ease, opacity 140ms ease",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.55 : 1,
      userSelect: "none",
      whiteSpace: block ? "normal" : "nowrap",
      flexShrink: block ? 1 : 0,
    };
  }

  function renderItemContent(
    item: NavbarItem,
    highlighted: boolean,
    withChevron: boolean,
  ): JSX.Element {
    const badgeNode = resolveBadge(item.badge, size);

    return (
      <>
        {item.icon != null ? (
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: `${tokens.iconSize + 4}px`,
              minWidth: `${tokens.iconSize + 4}px`,
              lineHeight: 0,
              color: highlighted
                ? colors.itemActiveTextColor
                : colors.mutedTextColor,
            }}
          >
            {item.icon}
          </span>
        ) : null}

        <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>
          {item.label}
        </span>

        {badgeNode != null ? (
          <span
            style={{
              marginInlineStart: "0.35rem",
              display: "inline-flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {badgeNode}
          </span>
        ) : null}

        {withChevron ? (
          <span
            aria-hidden
            style={{
              marginInlineStart: "0.28rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.mutedTextColor,
              flexShrink: 0,
            }}
          >
            <FiChevronDown size={tokens.iconSize - 1} />
          </span>
        ) : null}
      </>
    );
  }

  function renderDesktopItem(item: NavbarItem): JSX.Element {
    const itemHasChildren = hasChildren(item);
    const itemDisabled = item.disabled === true;
    const itemIsActive =
      resolvedActiveItemId != null && item.id === resolvedActiveItemId;
    const childIsActive =
      itemHasChildren &&
      (item.items ?? []).some((child) =>
        itemContainsActive(child, resolvedActiveItemId),
      );
    const itemHighlighted = itemIsActive || childIsActive;
    const itemStyle = buildItemStyle(itemHighlighted, itemDisabled, false);
    const labelText = item.ariaLabel ?? toLabelText(item.label) ?? item.id;

    if (itemHasChildren) {
      return (
        <DropdownMenu
          key={item.id}
          size={size === "lg" ? "md" : size === "xs" ? "xs" : "sm"}
          variant={resolveSubmenuVariant(resolvedVariant)}
        >
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={labelText}
              disabled={itemDisabled}
              style={itemStyle}
            >
              {renderItemContent(item, itemHighlighted, true)}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="start">
            {(item.items ?? []).map((child) => (
              <DropdownMenuItem
                key={child.id}
                disabled={child.disabled === true}
                icon={child.icon}
                shortcut={resolveBadge(child.badge, size)}
                onSelect={() => {
                  setItemActive(child, {
                    source: "submenu-select",
                    parentItem: item,
                    event: undefined,
                  });
                }}
              >
                {child.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (item.href != null) {
      return (
        <a
          key={item.id}
          href={item.href}
          aria-label={labelText}
          aria-current={itemIsActive ? "page" : undefined}
          aria-disabled={itemDisabled}
          onClick={(event) => {
            if (itemDisabled) {
              event.preventDefault();
              return;
            }

            setItemActive(item, {
              source: "item-select",
              event,
            });
          }}
          style={itemStyle}
        >
          {renderItemContent(item, itemHighlighted, false)}
        </a>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        aria-label={labelText}
        disabled={itemDisabled}
        onClick={(event) => {
          setItemActive(item, {
            source: "item-select",
            event,
          });
        }}
        style={itemStyle}
      >
        {renderItemContent(item, itemHighlighted, false)}
      </button>
    );
  }

  const composedClassName = `${baseClasses} ${className}`.trim();

  const rootStyle: CSSProperties = {
    ...(sticky
      ? {
          position: "sticky",
          insetBlockStart: 0,
          zIndex: 20,
        }
      : {
          position: "relative",
        }),
    border: `1px solid ${colors.panelBorderColor}`,
    backgroundColor: colors.panelBackgroundColor,
    color: colors.textColor,
    boxShadow: colors.panelShadow,
    width: "100%",
    maxWidth: "100%",
    ...style,
  };

  const barStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    minHeight: tokens.minHeight,
    gap: "0.7rem",
    paddingInline: tokens.paddingInline,
    paddingBlock: tokens.paddingBlock,
  };

  const leadingClusterStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.46rem",
    minWidth: 0,
    flexShrink: 1,
  };

  const hamburgerButtonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: tokens.itemHeight,
    minWidth: tokens.itemHeight,
    height: tokens.itemHeight,
    padding: 0,
    border: "none",
    borderRadius: "var(--ktn-radius-sm, 0.375rem)",
    backgroundColor: "transparent",
    color: colors.textColor,
    transition: "color 140ms ease, opacity 140ms ease",
    lineHeight: 0,
    flexShrink: 0,
    cursor: hamburgerDisabled ? "not-allowed" : "pointer",
    opacity: hamburgerDisabled ? 0.56 : 1,
  };

  const brandStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.56rem",
    minWidth: 0,
    flexShrink: 0,
    color: colors.textColor,
  };

  const brandLogoStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: tokens.brandLogoSize,
    height: tokens.brandLogoSize,
    minWidth: tokens.brandLogoSize,
    lineHeight: 0,
    overflow: "hidden",
    borderRadius: "var(--ktn-radius-sm, 0.375rem)",
    flexShrink: 0,
  };

  const brandTextWrapStyle: CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    minWidth: 0,
    gap: "0.04rem",
  };

  const brandNameStyle: CSSProperties = {
    fontSize: tokens.brandNameFontSize,
    fontWeight: 600,
    lineHeight: 1.15,
    color: colors.textColor,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "16rem",
  };

  const brandTaglineStyle: CSSProperties = {
    fontSize: tokens.brandTaglineFontSize,
    fontWeight: 500,
    lineHeight: 1.15,
    color: colors.mutedTextColor,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "18rem",
  };

  const desktopRightClusterStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: tokens.actionGap,
    marginInlineStart: "auto",
    flex: "1 1 auto",
    minWidth: 0,
  };

  const desktopNavStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: tokens.navGap,
    flex: "0 1 auto",
    minWidth: 0,
    maxWidth: "100%",
    overflowX: "auto",
    paddingBlock: "0.04rem",
  };

  const actionsStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: tokens.actionGap,
    flexShrink: 0,
  };

  function handleRootKeyDown(
    event: Parameters<NonNullable<NavbarProps["onKeyDown"]>>[0],
  ): void {
    onKeyDown?.(event);
  }

  return (
    <header
      className={composedClassName}
      style={rootStyle}
      onKeyDown={handleRootKeyDown}
      {...props}
    >
      <div style={barStyle}>
        {shouldRenderHamburger || shouldRenderBrand ? (
          <div style={leadingClusterStyle}>
            {shouldRenderHamburger ? (
              <button
                type="button"
                aria-label={hamburgerAriaLabel}
                title={hamburgerAriaLabel}
                disabled={hamburgerDisabled}
                onClick={(event) => {
                  onHamburgerAction?.(event);
                  emitAction("hamburger-action", {
                    event,
                  });
                }}
                style={hamburgerButtonStyle}
              >
                <span
                  aria-hidden
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 0,
                  }}
                >
                  {hamburgerIcon ?? <FiMenu size={tokens.iconSize} />}
                </span>
              </button>
            ) : null}

            {shouldRenderBrand ? (
              <div style={brandStyle}>
                {hasCustomBrand ? (
                  brand
                ) : (
                  <>
                    {hasBrandLogo ? (
                      <span style={brandLogoStyle}>{brandLogo}</span>
                    ) : null}

                    {hasResolvedBrandName || hasBrandTagline ? (
                      <span style={brandTextWrapStyle}>
                        {hasResolvedBrandName ? (
                          <span style={brandNameStyle}>
                            {resolvedBrandName}
                          </span>
                        ) : null}

                        {hasBrandTagline ? (
                          <span style={brandTaglineStyle}>{brandTagline}</span>
                        ) : null}
                      </span>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}
          </div>
        ) : null}

        <div style={desktopRightClusterStyle}>
          {shouldRenderDesktopNav ? (
            <nav aria-label={desktopNavigationLabel} style={desktopNavStyle}>
              {items.length > 0 ? (
                items.map((item) => renderDesktopItem(item))
              ) : (
                <span
                  style={{
                    color: colors.mutedTextColor,
                    fontSize: tokens.itemFontSize,
                  }}
                >
                  {emptyText}
                </span>
              )}
            </nav>
          ) : null}

          {actions != null ? <div style={actionsStyle}>{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}
