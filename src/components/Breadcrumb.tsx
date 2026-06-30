import {
  Fragment,
  createContext,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

export type BreadcrumbSize = "xs" | "sm" | "md" | "lg";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  onAction?: (event: ReactMouseEvent<Element>) => void;
}

export interface BreadcrumbActionContext {
  item: BreadcrumbItem;
  index: number;
  isCurrentPage: boolean;
  event: ReactMouseEvent<Element>;
}

export interface BreadcrumbProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> {
  items: BreadcrumbItem[];
  size?: BreadcrumbSize;
  separator?: ReactNode;
  separatorFallback?: ReactNode;
  ellipsisContent?: ReactNode;
  ellipsisAriaLabelFormatter?: (hiddenItemsCount: number) => string;
  itemAriaLabelFormatter?: (context: {
    item: BreadcrumbItem;
    index: number;
    isCurrentPage: boolean;
  }) => string | undefined;
  navigationAriaLabel?: string;
  maxVisibleItems?: number;
  onAction?: (context: BreadcrumbActionContext) => void;
}

export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLLIElement> {
  size?: BreadcrumbSize;
}

export interface BreadcrumbEllipsisProps extends HTMLAttributes<HTMLLIElement> {
  size?: BreadcrumbSize;
}

type BreadcrumbSizeTokens = {
  fontSize: string;
  separatorPaddingInline: string;
  ellipsisMinWidth: string;
};

type BreadcrumbRenderEntry =
  | {
      kind: "item";
      item: BreadcrumbItem;
    }
  | {
      kind: "ellipsis";
      hiddenItemsCount: number;
    };

const sizeTokens: Record<BreadcrumbSize, BreadcrumbSizeTokens> = {
  xs: {
    fontSize: "0.75rem",
    separatorPaddingInline: "0.3rem",
    ellipsisMinWidth: "1.15rem",
  },
  sm: {
    fontSize: "0.8125rem",
    separatorPaddingInline: "0.375rem",
    ellipsisMinWidth: "1.25rem",
  },
  md: {
    fontSize: "0.875rem",
    separatorPaddingInline: "0.45rem",
    ellipsisMinWidth: "1.35rem",
  },
  lg: {
    fontSize: "0.9375rem",
    separatorPaddingInline: "0.5rem",
    ellipsisMinWidth: "1.45rem",
  },
};

const currentPageStyle: CSSProperties = {
  color: "var(--ktn-text-primary)",
  fontWeight: 500,
  lineHeight: 1.25,
};

const textItemStyle: CSSProperties = {
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  fontWeight: 400,
  lineHeight: 1.25,
};

const BreadcrumbSizeContext = createContext<BreadcrumbSize>("md");

function useResolvedSize(size?: BreadcrumbSize): BreadcrumbSize {
  const inheritedSize = useContext(BreadcrumbSizeContext);

  return size ?? inheritedSize;
}

function buildRenderableItems(
  items: BreadcrumbItem[],
  maxVisibleItems: number | undefined,
): BreadcrumbRenderEntry[] {
  const normalizedItems = items.filter((item) => item.label != null);

  if (maxVisibleItems == null || normalizedItems.length <= maxVisibleItems) {
    return normalizedItems.map((item) => ({ kind: "item", item }));
  }

  if (maxVisibleItems <= 2) {
    return normalizedItems
      .slice(Math.max(0, normalizedItems.length - maxVisibleItems))
      .map((item) => ({ kind: "item", item }));
  }

  const trailingItemCount = Math.max(maxVisibleItems - 2, 1);
  const trailingItems = normalizedItems.slice(
    normalizedItems.length - trailingItemCount,
  );
  const hiddenItemsCount = Math.max(
    normalizedItems.length - (1 + trailingItems.length),
    0,
  );

  return [
    {
      kind: "item",
      item: normalizedItems[0],
    },
    {
      kind: "ellipsis",
      hiddenItemsCount,
    },
    ...trailingItems.map<BreadcrumbRenderEntry>((item) => ({
      kind: "item",
      item,
    })),
  ];
}

function getTextLabel(label: ReactNode): string | undefined {
  if (typeof label === "string") {
    const trimmed = label.trim();
    return trimmed === "" ? undefined : trimmed;
  }

  if (typeof label === "number") {
    return String(label);
  }

  if (Array.isArray(label)) {
    const joined = label
      .map((value) => getTextLabel(value) ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return joined === "" ? undefined : joined;
  }

  return undefined;
}

interface BreadcrumbLinkNodeProps {
  href: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  onAction?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
}

function BreadcrumbLinkNode({
  href,
  target,
  rel,
  ariaLabel,
  onAction,
  children,
}: BreadcrumbLinkNodeProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isInteractive = isHovered || isFocused;

  const linkStyle: CSSProperties = {
    color: isInteractive
      ? "var(--ktn-action-primary-bg)"
      : "var(--ktn-text-secondary, var(--ktn-text-primary))",
    textDecoration: isInteractive ? "underline" : "none",
    textUnderlineOffset: "0.14em",
    textDecorationThickness: "1px",
    borderRadius: "0.25rem",
    outline: "none",
    boxShadow: isFocused
      ? "0 0 0 2px color-mix(in srgb, var(--ktn-action-primary-bg) 35%, transparent)"
      : "none",
    lineHeight: 1.25,
    cursor: "pointer",
    transition: "color 120ms ease, text-decoration-color 120ms ease",
  };

  const resolvedRel =
    target === "_blank" ? (rel ?? "noreferrer noopener") : rel;

  return (
    <a
      href={href}
      target={target}
      rel={resolvedRel}
      aria-label={ariaLabel}
      style={linkStyle}
      onClick={onAction}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
    >
      {children}
    </a>
  );
}

interface BreadcrumbActionNodeProps {
  ariaLabel?: string;
  onAction?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

function BreadcrumbActionNode({
  ariaLabel,
  onAction,
  children,
}: BreadcrumbActionNodeProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isInteractive = isHovered || isFocused;

  const actionStyle: CSSProperties = {
    color: isInteractive
      ? "var(--ktn-action-primary-bg)"
      : "var(--ktn-text-secondary, var(--ktn-text-primary))",
    textDecoration: isInteractive ? "underline" : "none",
    textUnderlineOffset: "0.14em",
    textDecorationThickness: "1px",
    borderRadius: "0.25rem",
    outline: "none",
    border: 0,
    backgroundColor: "transparent",
    padding: 0,
    lineHeight: 1.25,
    boxShadow: isFocused
      ? "0 0 0 2px color-mix(in srgb, var(--ktn-action-primary-bg) 35%, transparent)"
      : "none",
    cursor: "pointer",
    transition: "color 120ms ease, text-decoration-color 120ms ease",
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      style={actionStyle}
      onClick={onAction}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
    >
      {children}
    </button>
  );
}

export function BreadcrumbSeparator({
  size,
  children,
  className = "",
  style,
  ...props
}: BreadcrumbSeparatorProps): JSX.Element {
  const resolvedSize = useResolvedSize(size);
  const tokens = sizeTokens[resolvedSize];
  const composedClassName = className.trim() === "" ? undefined : className;

  const separatorStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      "var(--ktn-text-muted, var(--ktn-text-secondary, var(--ktn-text-primary)))",
    lineHeight: 1,
    userSelect: "none",
    fontSize: tokens.fontSize,
    paddingInline: tokens.separatorPaddingInline,
    ...style,
  };

  return (
    <li
      role="presentation"
      aria-hidden
      className={composedClassName}
      style={separatorStyle}
      {...props}
    >
      {children}
    </li>
  );
}

export function BreadcrumbEllipsis({
  size,
  children,
  className = "",
  style,
  ...props
}: BreadcrumbEllipsisProps): JSX.Element {
  const resolvedSize = useResolvedSize(size);
  const tokens = sizeTokens[resolvedSize];
  const composedClassName = className.trim() === "" ? undefined : className;

  const ellipsisStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: tokens.ellipsisMinWidth,
    color:
      "var(--ktn-text-muted, var(--ktn-text-secondary, var(--ktn-text-primary)))",
    letterSpacing: "0.06em",
    lineHeight: 1,
    userSelect: "none",
    ...style,
  };

  return (
    <li className={composedClassName} style={ellipsisStyle} {...props}>
      {children}
    </li>
  );
}

export function Breadcrumb({
  items,
  size = "md",
  separator,
  separatorFallback,
  ellipsisContent,
  ellipsisAriaLabelFormatter,
  itemAriaLabelFormatter,
  navigationAriaLabel,
  maxVisibleItems,
  onAction,
  className = "",
  style,
  ["aria-label"]: ariaLabel,
  ...props
}: BreadcrumbProps): JSX.Element {
  const tokens = sizeTokens[size];
  const composedClassName = className.trim() === "" ? undefined : className;

  const renderableItems = useMemo(
    () => buildRenderableItems(items, maxVisibleItems),
    [items, maxVisibleItems],
  );

  const navStyle: CSSProperties = {
    display: "block",
    width: "100%",
    ...style,
  };

  const resolvedNavigationAriaLabel =
    navigationAriaLabel ??
    ariaLabel ??
    getTextLabel(items[items.length - 1]?.label);

  const listStyle: CSSProperties = {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    color: "var(--ktn-text-primary)",
    fontSize: tokens.fontSize,
  };

  const itemStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minWidth: 0,
  };

  function handleItemAction(
    item: BreadcrumbItem,
    index: number,
    isCurrentPage: boolean,
    event: ReactMouseEvent<Element>,
  ): void {
    item.onAction?.(event);
    onAction?.({
      item,
      index,
      isCurrentPage,
      event,
    });
  }

  return (
    <nav
      aria-label={resolvedNavigationAriaLabel}
      className={composedClassName}
      style={navStyle}
      {...props}
    >
      <BreadcrumbSizeContext.Provider value={size}>
        <ol style={listStyle}>
          {renderableItems.map((entry, index) => {
            const isLast = index === renderableItems.length - 1;
            const resolvedSeparator = separator ?? separatorFallback;

            if (entry.kind === "ellipsis") {
              const resolvedEllipsisAriaLabel = ellipsisAriaLabelFormatter?.(
                entry.hiddenItemsCount,
              );
              const resolvedEllipsisContent =
                ellipsisContent ?? String(entry.hiddenItemsCount);

              return (
                <Fragment key={`breadcrumb-entry-${index}`}>
                  <BreadcrumbEllipsis
                    size={size}
                    aria-label={resolvedEllipsisAriaLabel}
                    aria-hidden={
                      resolvedEllipsisAriaLabel == null ? true : undefined
                    }
                  >
                    {resolvedEllipsisContent}
                  </BreadcrumbEllipsis>

                  {!isLast && resolvedSeparator != null ? (
                    <BreadcrumbSeparator size={size}>
                      {resolvedSeparator}
                    </BreadcrumbSeparator>
                  ) : null}
                </Fragment>
              );
            }

            const resolvedItemAriaLabel =
              itemAriaLabelFormatter?.({
                item: entry.item,
                index,
                isCurrentPage: isLast,
              }) ??
              entry.item.ariaLabel ??
              getTextLabel(entry.item.label);

            const itemNode =
              !isLast &&
              entry.item.href != null &&
              entry.item.href.trim() !== "" ? (
                <BreadcrumbLinkNode
                  href={entry.item.href}
                  target={entry.item.target}
                  rel={entry.item.rel}
                  ariaLabel={resolvedItemAriaLabel}
                  onAction={(event) => {
                    handleItemAction(entry.item, index, isLast, event);
                  }}
                >
                  {entry.item.label}
                </BreadcrumbLinkNode>
              ) : !isLast &&
                (entry.item.onAction != null || onAction != null) ? (
                <BreadcrumbActionNode
                  ariaLabel={resolvedItemAriaLabel}
                  onAction={(event) => {
                    handleItemAction(entry.item, index, isLast, event);
                  }}
                >
                  {entry.item.label}
                </BreadcrumbActionNode>
              ) : isLast ? (
                <span
                  aria-current="page"
                  aria-label={resolvedItemAriaLabel}
                  style={currentPageStyle}
                >
                  {entry.item.label}
                </span>
              ) : (
                <span style={textItemStyle}>{entry.item.label}</span>
              );

            return (
              <Fragment key={`breadcrumb-entry-${index}`}>
                <li style={itemStyle}>{itemNode}</li>

                {!isLast && resolvedSeparator != null ? (
                  <BreadcrumbSeparator size={size}>
                    {resolvedSeparator}
                  </BreadcrumbSeparator>
                ) : null}
              </Fragment>
            );
          })}
        </ol>
      </BreadcrumbSizeContext.Provider>
    </nav>
  );
}
