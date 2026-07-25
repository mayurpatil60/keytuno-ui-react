import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { Button } from "./Button";

export type CardSize = "xs" | "sm" | "md" | "lg";
export type CardSpacing = "xs" | "sm" | "md" | "lg";
export type CardActionSource = "card" | "collapse-toggle";

export interface CardActionContext {
  source: CardActionSource;
  collapsed: boolean;
  event: ReactMouseEvent<Element>;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  size?: CardSize;
  spacing?: CardSpacing;
  collapse?: boolean;
  defaultCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  onAction?: (context: CardActionContext) => void;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  collapseTrigger?: boolean;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  collapseTrigger?: boolean;
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  collapseTrigger?: boolean;
}

export interface CardActionProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

type CardSizeTokens = {
  titleFontSize: string;
  descriptionFontSize: string;
  contentFontSize: string;
  footerFontSize: string;
  iconSize: string;
};

type CardSpacingTokens = {
  sectionPaddingBlock: string;
  sectionPaddingInline: string;
  sectionGap: string;
  actionGap: string;
};

const sizeTokens: Record<CardSize, CardSizeTokens> = {
  xs: {
    titleFontSize: "0.875rem",
    descriptionFontSize: "0.75rem",
    contentFontSize: "0.75rem",
    footerFontSize: "0.75rem",
    iconSize: "0.85rem",
  },
  sm: {
    titleFontSize: "0.9375rem",
    descriptionFontSize: "0.8125rem",
    contentFontSize: "0.8125rem",
    footerFontSize: "0.8125rem",
    iconSize: "0.9rem",
  },
  md: {
    titleFontSize: "1rem",
    descriptionFontSize: "0.875rem",
    contentFontSize: "0.875rem",
    footerFontSize: "0.875rem",
    iconSize: "0.95rem",
  },
  lg: {
    titleFontSize: "1.125rem",
    descriptionFontSize: "0.9375rem",
    contentFontSize: "0.9375rem",
    footerFontSize: "0.9375rem",
    iconSize: "1rem",
  },
};

const spacingTokens: Record<CardSpacing, CardSpacingTokens> = {
  xs: {
    sectionPaddingBlock: "0.5rem",
    sectionPaddingInline: "0.625rem",
    sectionGap: "0.25rem",
    actionGap: "0.35rem",
  },
  sm: {
    sectionPaddingBlock: "0.625rem",
    sectionPaddingInline: "0.75rem",
    sectionGap: "0.375rem",
    actionGap: "0.45rem",
  },
  md: {
    sectionPaddingBlock: "0.75rem",
    sectionPaddingInline: "0.875rem",
    sectionGap: "0.5rem",
    actionGap: "0.5rem",
  },
  lg: {
    sectionPaddingBlock: "0.95rem",
    sectionPaddingInline: "1.05rem",
    sectionGap: "0.625rem",
    actionGap: "0.625rem",
  },
};

interface CardContextValue {
  size: CardSize;
  spacing: CardSpacing;
  collapse: boolean;
  collapsed: boolean;
  contentRegionId: string;
  toggleCollapse: () => void;
  emitAction: (
    source: CardActionSource,
    event: ReactMouseEvent<Element>,
    collapsedOverride?: boolean,
  ) => void;
}

const CardContext = createContext<CardContextValue | null>(null);

function useCardContextValue(): CardContextValue {
  const contextValue = useContext(CardContext);

  if (contextValue != null) {
    return contextValue;
  }

  return {
    size: "md",
    spacing: "md",
    collapse: false,
    collapsed: false,
    contentRegionId: "",
    toggleCollapse: () => {},
    emitAction: () => {},
  };
}

const baseCardClasses =
  "relative flex flex-col border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export function Card({
  children,
  size = "md",
  spacing = "md",
  collapse = false,
  defaultCollapsed = false,
  onCollapseChange,
  onAction,
  className = "",
  style,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: CardProps): JSX.Element {
  const [collapsedState, setCollapsedState] = useState(() =>
    collapse ? defaultCollapsed : false,
  );
  const isCollapsible = collapse === true;
  const contentRegionId = useId();
  const resolvedCollapsed = isCollapsible ? collapsedState : false;
  const isActionable = onAction != null || onClick != null;
  const resolvedRole = role ?? (isActionable ? "button" : undefined);
  const resolvedTabIndex = tabIndex ?? (isActionable ? 0 : undefined);
  const resolvedAriaLabel =
    ariaLabel ?? (ariaLabelledBy == null && isActionable ? "Card" : undefined);

  function emitAction(
    source: CardActionSource,
    event: ReactMouseEvent<Element>,
    collapsedOverride?: boolean,
  ): void {
    onAction?.({
      source,
      collapsed: collapsedOverride ?? resolvedCollapsed,
      event,
    });
  }

  function handleCardClick(event: ReactMouseEvent<HTMLDivElement>): void {
    emitAction("card", event);
    onClick?.(event);
  }

  function handleCardKeyDown(event: ReactKeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || !isActionable) {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  const contextValue: CardContextValue = {
    size,
    spacing,
    collapse: isCollapsible,
    collapsed: resolvedCollapsed,
    contentRegionId,
    toggleCollapse: () => {
      if (isCollapsible) {
        setCollapsedState((current) => {
          const nextCollapsed = !current;
          onCollapseChange?.(nextCollapsed);
          return nextCollapsed;
        });
      }
    },
    emitAction,
  };

  const composedClassName = `${baseCardClasses} ${className}`.trim();

  const cardStyle: CSSProperties = {
    width: "100%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--ktn-border-muted)",
    borderRadius: "var(--ktn-radius-lg, 0.75rem)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
    overflow: "hidden",
    ...(isActionable ? { cursor: "pointer" } : {}),
    transition: "border-color 140ms ease, box-shadow 140ms ease",
    ...style,
  };

  return (
    <CardContext.Provider value={contextValue}>
      <div
        className={composedClassName}
        style={cardStyle}
        role={resolvedRole}
        tabIndex={resolvedTabIndex}
        aria-label={resolvedAriaLabel}
        aria-labelledby={ariaLabelledBy}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

export function CardHeader({
  children,
  collapseTrigger = false,
  className = "",
  style,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}: CardHeaderProps): JSX.Element {
  const {
    size,
    spacing,
    collapse,
    collapsed,
    contentRegionId,
    toggleCollapse,
    emitAction,
  } = useCardContextValue();
  const spacingToken = spacingTokens[spacing];
  const sizeToken = sizeTokens[size];
  const isCollapseTrigger = collapse === true && collapseTrigger === true;

  const contentChildren: ReactNode[] = [];
  const actionChildren: ReactNode[] = [];

  Children.toArray(children).forEach((child) => {
    if (isValidElement(child) && child.type === CardAction) {
      actionChildren.push(child);
      return;
    }

    contentChildren.push(child);
  });

  const composedClassName = className.trim() === "" ? undefined : className;
  const resolvedRole = role ?? (isCollapseTrigger ? "button" : undefined);
  const resolvedTabIndex = tabIndex ?? (isCollapseTrigger ? 0 : undefined);

  function handleHeaderClick(event: ReactMouseEvent<HTMLDivElement>): void {
    onClick?.(event);

    if (!isCollapseTrigger || event.defaultPrevented) {
      return;
    }

    const targetElement = event.target as HTMLElement | null;

    if (targetElement?.closest("[data-card-action='true']") != null) {
      return;
    }

    event.stopPropagation();
    const nextCollapsed = !collapsed;
    toggleCollapse();
    emitAction("collapse-toggle", event, nextCollapsed);
  }

  function handleHeaderKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>,
  ): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || !isCollapseTrigger) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacingToken.sectionGap,
    paddingBlock: spacingToken.sectionPaddingBlock,
    paddingInline: spacingToken.sectionPaddingInline,
    ...style,
  };

  const contentStyle: CSSProperties = {
    minWidth: 0,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    fontSize: sizeToken.contentFontSize,
    ...(isCollapseTrigger ? { cursor: "pointer" } : {}),
  };

  const controlsStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacingToken.actionGap,
    flexShrink: 0,
  };

  const chevronButtonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1.875rem",
    height: "1.875rem",
    paddingInline: 0,
    paddingBlock: 0,
    borderRadius: "var(--ktn-radius-sm, 0.375rem)",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    lineHeight: 0,
  };

  return (
    <div
      className={composedClassName}
      style={headerStyle}
      role={resolvedRole}
      tabIndex={resolvedTabIndex}
      aria-expanded={isCollapseTrigger ? !collapsed : undefined}
      aria-controls={isCollapseTrigger ? contentRegionId : undefined}
      onClick={handleHeaderClick}
      onKeyDown={handleHeaderKeyDown}
      {...props}
    >
      <div style={contentStyle}>{contentChildren}</div>

      {actionChildren.length > 0 || collapse ? (
        <div style={controlsStyle}>
          {actionChildren}

          {collapse ? (
            <Button
              variant="ghost"
              size="xs"
              type="button"
              aria-label={collapsed ? "Expand card" : "Collapse card"}
              aria-expanded={!collapsed}
              aria-controls={contentRegionId}
              style={chevronButtonStyle}
              onAction={(event) => {
                event.stopPropagation();
                const nextCollapsed = !collapsed;
                toggleCollapse();
                emitAction("collapse-toggle", event, nextCollapsed);
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: sizeToken.iconSize,
                  height: sizeToken.iconSize,
                  transition: "transform 180ms ease",
                  transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function CardTitle({
  children,
  collapseTrigger = false,
  className = "",
  style,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}: CardTitleProps): JSX.Element {
  const {
    size,
    collapse,
    collapsed,
    contentRegionId,
    toggleCollapse,
    emitAction,
  } = useCardContextValue();
  const sizeToken = sizeTokens[size];
  const composedClassName = className.trim() === "" ? undefined : className;
  const isCollapseTrigger = collapse === true && collapseTrigger === true;
  const resolvedRole = role ?? (isCollapseTrigger ? "button" : undefined);
  const resolvedTabIndex = tabIndex ?? (isCollapseTrigger ? 0 : undefined);

  function handleTitleClick(event: ReactMouseEvent<HTMLHeadingElement>): void {
    if (isCollapseTrigger) {
      event.stopPropagation();
    }

    onClick?.(event);

    if (!isCollapseTrigger || event.defaultPrevented) {
      return;
    }

    const nextCollapsed = !collapsed;
    toggleCollapse();
    emitAction("collapse-toggle", event, nextCollapsed);
  }

  function handleTitleKeyDown(
    event: ReactKeyboardEvent<HTMLHeadingElement>,
  ): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || !isCollapseTrigger) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  const titleStyle: CSSProperties = {
    margin: 0,
    fontWeight: 600,
    fontSize: sizeToken.titleFontSize,
    lineHeight: 1.25,
    color: "var(--ktn-text-primary)",
    ...(isCollapseTrigger ? { cursor: "pointer" } : {}),
    ...style,
  };

  return (
    <h3
      className={composedClassName}
      style={titleStyle}
      role={resolvedRole}
      tabIndex={resolvedTabIndex}
      aria-expanded={isCollapseTrigger ? !collapsed : undefined}
      aria-controls={isCollapseTrigger ? contentRegionId : undefined}
      onClick={handleTitleClick}
      onKeyDown={handleTitleKeyDown}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  collapseTrigger = false,
  className = "",
  style,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}: CardDescriptionProps): JSX.Element {
  const {
    size,
    collapse,
    collapsed,
    contentRegionId,
    toggleCollapse,
    emitAction,
  } = useCardContextValue();
  const sizeToken = sizeTokens[size];
  const composedClassName = className.trim() === "" ? undefined : className;
  const isCollapseTrigger = collapse === true && collapseTrigger === true;
  const resolvedRole = role ?? (isCollapseTrigger ? "button" : undefined);
  const resolvedTabIndex = tabIndex ?? (isCollapseTrigger ? 0 : undefined);

  function handleDescriptionClick(
    event: ReactMouseEvent<HTMLParagraphElement>,
  ): void {
    if (isCollapseTrigger) {
      event.stopPropagation();
    }

    onClick?.(event);

    if (!isCollapseTrigger || event.defaultPrevented) {
      return;
    }

    const nextCollapsed = !collapsed;
    toggleCollapse();
    emitAction("collapse-toggle", event, nextCollapsed);
  }

  function handleDescriptionKeyDown(
    event: ReactKeyboardEvent<HTMLParagraphElement>,
  ): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || !isCollapseTrigger) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  const descriptionStyle: CSSProperties = {
    margin: 0,
    fontSize: sizeToken.descriptionFontSize,
    fontWeight: 400,
    lineHeight: 1.4,
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    ...(isCollapseTrigger ? { cursor: "pointer" } : {}),
    ...style,
  };

  return (
    <p
      className={composedClassName}
      style={descriptionStyle}
      role={resolvedRole}
      tabIndex={resolvedTabIndex}
      aria-expanded={isCollapseTrigger ? !collapsed : undefined}
      aria-controls={isCollapseTrigger ? contentRegionId : undefined}
      onClick={handleDescriptionClick}
      onKeyDown={handleDescriptionKeyDown}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardAction({
  children,
  className = "",
  style,
  ...props
}: CardActionProps): JSX.Element {
  const { spacing } = useCardContextValue();
  const spacingToken = spacingTokens[spacing];
  const composedClassName = className.trim() === "" ? undefined : className;

  const actionStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacingToken.actionGap,
    ...style,
  };

  return (
    <div
      data-card-action="true"
      className={composedClassName}
      style={actionStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  children,
  divider = false,
  className = "",
  style,
  id,
  role,
  ...props
}: CardContentProps): JSX.Element {
  const { size, spacing, collapse, collapsed, contentRegionId } =
    useCardContextValue();
  const sizeToken = sizeTokens[size];
  const spacingToken = spacingTokens[spacing];
  const composedClassName = className.trim() === "" ? undefined : className;
  const resolvedId = id ?? (collapse ? contentRegionId : undefined);
  const resolvedRole = role ?? (collapse ? "region" : undefined);

  const contentStyle: CSSProperties = {
    display: collapse && collapsed ? "none" : "block",
    paddingBlock: spacingToken.sectionPaddingBlock,
    paddingInline: spacingToken.sectionPaddingInline,
    borderTop: divider ? "1px solid var(--ktn-border-muted)" : undefined,
    fontSize: sizeToken.contentFontSize,
    lineHeight: 1.45,
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    ...style,
  };

  return (
    <div
      id={resolvedId}
      role={resolvedRole}
      aria-hidden={collapse ? collapsed : undefined}
      className={composedClassName}
      style={contentStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  divider = false,
  className = "",
  style,
  ...props
}: CardFooterProps): JSX.Element {
  const { size, spacing, collapse, collapsed } = useCardContextValue();
  const sizeToken = sizeTokens[size];
  const spacingToken = spacingTokens[spacing];
  const composedClassName = className.trim() === "" ? undefined : className;

  const footerStyle: CSSProperties = {
    display: collapse && collapsed ? "none" : "flex",
    alignItems: "center",
    gap: spacingToken.actionGap,
    paddingBlock: spacingToken.sectionPaddingBlock,
    paddingInline: spacingToken.sectionPaddingInline,
    borderTop: divider ? "1px solid var(--ktn-border-muted)" : undefined,
    fontSize: sizeToken.footerFontSize,
    color: "var(--ktn-text-primary)",
    ...style,
  };

  return (
    <div
      aria-hidden={collapse ? collapsed : undefined}
      className={composedClassName}
      style={footerStyle}
      {...props}
    >
      {children}
    </div>
  );
}
