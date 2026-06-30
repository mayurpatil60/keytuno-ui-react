import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { FiX } from "./icons/feather";

import { Button } from "./Button";
import { Dialog, type DialogActionContext } from "./Dialog";
import { Scrollbar } from "./Scrollbar";

export type SheetSide = "top" | "bottom" | "left" | "right";
export type SheetActionSource =
  | "trigger"
  | "overlay"
  | "escape"
  | "close-button"
  | "open-change";

export interface SheetActionContext {
  source: SheetActionSource;
  open: boolean;
  side: SheetSide;
  disabled: boolean;
  event?: unknown;
}

export interface SheetProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (context: SheetActionContext) => void;
  trigger?: ReactNode;
  side?: SheetSide;
  showCloseButton?: boolean;
  disabled?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export interface SheetContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: SheetSide;
  showCloseButton?: boolean;
  scrollable?: boolean;
  maxContentHeight?: string;
}

export interface SheetHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface SheetTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export interface SheetDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export interface SheetFooterProps extends HTMLAttributes<HTMLDivElement> {
  sticky?: boolean;
}

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean, source?: SheetActionSource, event?: unknown) => void;
  side: SheetSide;
  disabled: boolean;
  showCloseButton: boolean;
  titleId: string;
  descriptionId: string;
}

const SHEET_ANIMATION_MS = 420;

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContextValue(): SheetContextValue {
  const contextValue = useContext(SheetContext);

  if (contextValue != null) {
    return contextValue;
  }

  return {
    open: false,
    setOpen: () => {},
    side: "right",
    disabled: false,
    showCloseButton: true,
    titleId: "",
    descriptionId: "",
  };
}

function getSheetContainerStyle(side: SheetSide): CSSProperties {
  if (side === "left") {
    return {
      alignItems: "stretch",
      justifyContent: "flex-start",
    };
  }

  if (side === "top") {
    return {
      alignItems: "flex-start",
      justifyContent: "center",
    };
  }

  if (side === "bottom") {
    return {
      alignItems: "flex-end",
      justifyContent: "center",
    };
  }

  return {
    alignItems: "stretch",
    justifyContent: "flex-end",
  };
}

function getSheetPanelStyle(side: SheetSide): CSSProperties {
  if (side === "left" || side === "right") {
    return {
      width: "min(94vw, 30rem)",
      height: "100vh",
      maxHeight: "100vh",
    };
  }

  return {
    width: "100vw",
    maxWidth: "100vw",
    minHeight: "10rem",
    maxHeight: "min(85vh, 32rem)",
  };
}

function getSheetPanelRadiusStyle(side: SheetSide): CSSProperties {
  if (side === "left") {
    return {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    };
  }

  if (side === "right") {
    return {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    };
  }

  if (side === "top") {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    };
  }

  return {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  };
}

function getSheetHiddenTransform(side: SheetSide): string {
  if (side === "left") {
    return "translate3d(-100%, 0, 0)";
  }

  if (side === "right") {
    return "translate3d(100%, 0, 0)";
  }

  if (side === "top") {
    return "translate3d(0, -100%, 0)";
  }

  return "translate3d(0, 100%, 0)";
}

export function Sheet({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  onAction,
  trigger,
  side = "right",
  showCloseButton = true,
  disabled = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  style,
  ...props
}: SheetProps): JSX.Element {
  const generatedId = useId();
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open === true : uncontrolledOpen;
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);

      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => {
        cancelAnimationFrame(frame);
      };
    }

    setIsVisible(false);

    const timeoutId = window.setTimeout(() => {
      setIsMounted(false);
    }, SHEET_ANIMATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  function setSheetOpen(
    nextOpen: boolean,
    source: SheetActionSource = "open-change",
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
      side,
      disabled,
      event,
    });
  }

  function handleDialogAction(context: DialogActionContext): void {
    setSheetOpen(context.open, context.source, context.event);
  }

  const contextValue: SheetContextValue = {
    open: isVisible,
    setOpen: setSheetOpen,
    side,
    disabled,
    showCloseButton,
    titleId,
    descriptionId,
  };

  return (
    <SheetContext.Provider value={contextValue}>
      <Dialog
        className={className}
        style={style}
        open={isMounted}
        onAction={handleDialogAction}
        trigger={trigger}
        variant="ghost"
        size="md"
        disabled={disabled}
        closeOnOverlayClick={closeOnOverlayClick}
        closeOnEscape={closeOnEscape}
        {...props}
      >
        {children}
      </Dialog>
    </SheetContext.Provider>
  );
}

export function SheetContent({
  children,
  side,
  showCloseButton,
  scrollable = false,
  maxContentHeight = "min(85vh, 32rem)",
  className = "",
  style,
  ...props
}: SheetContentProps): JSX.Element {
  const {
    open: isVisible,
    setOpen,
    side: contextSide,
    disabled,
    showCloseButton: contextShowCloseButton,
    titleId,
    descriptionId,
  } = useSheetContextValue();

  const resolvedSide = side ?? contextSide;
  const resolvedShowCloseButton = showCloseButton ?? contextShowCloseButton;

  const headerChildren: ReactNode[] = [];
  const bodyChildren: ReactNode[] = [];
  const footerChildren: ReactNode[] = [];

  Children.toArray(children).forEach((child) => {
    if (isValidElement(child) && child.type === SheetHeader) {
      headerChildren.push(child);
      return;
    }

    if (isValidElement(child) && child.type === SheetFooter) {
      footerChildren.push(child);
      return;
    }

    bodyChildren.push(child);
  });

  const shellStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    display: "flex",
    ...getSheetContainerStyle(resolvedSide),
  };

  const panelStyle: CSSProperties = {
    position: "relative",
    pointerEvents: "auto",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--ktn-border-muted)",
    borderRadius: "var(--ktn-radius-lg, 0.75rem)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    boxShadow: "0 24px 56px rgba(15, 23, 42, 0.28)",
    color: "var(--ktn-text-primary)",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    padding: "0.95rem",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    opacity: isVisible ? (disabled ? 0.72 : 1) : 0.98,
    transform: isVisible
      ? "translate3d(0, 0, 0)"
      : getSheetHiddenTransform(resolvedSide),
    willChange: "transform, opacity",
    transition: `transform ${SHEET_ANIMATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms cubic-bezier(0.22, 1, 0.36, 1)`,
    ["--ktn-sheet-close-space" as string]: resolvedShowCloseButton
      ? "calc(1.82rem + 0.5rem)"
      : "0px",
    ...getSheetPanelStyle(resolvedSide),
    ...getSheetPanelRadiusStyle(resolvedSide),
    ...(resolvedSide === "top" || resolvedSide === "bottom"
      ? {
          ...(scrollable
            ? { overflow: "hidden", maxHeight: maxContentHeight }
            : {}),
        }
      : {
          ...(scrollable ? { overflow: "hidden" } : {}),
        }),
    ...style,
  };

  const closeWrapStyle: CSSProperties = {
    position: "absolute",
    insetInlineEnd: "0.55rem",
    insetBlockStart: "0.55rem",
    zIndex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const sectionStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    minWidth: 0,
    width: "100%",
  };

  const bodySectionStyle: CSSProperties = {
    ...sectionStyle,
    ...(scrollable
      ? {
          flex: 1,
          minHeight: 0,
          paddingInlineEnd: "0.2rem",
        }
      : {}),
  };

  const composedClassName = className.trim() === "" ? undefined : className;

  return (
    <div style={shellStyle}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headerChildren.length > 0 ? titleId : undefined}
        aria-describedby={headerChildren.length > 0 ? descriptionId : undefined}
        aria-disabled={disabled || undefined}
        className={composedClassName}
        style={panelStyle}
        {...props}
      >
        {resolvedShowCloseButton ? (
          <div style={closeWrapStyle}>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={disabled}
              aria-label="Close sheet"
              style={{
                width: "1.82rem",
                height: "1.82rem",
                minHeight: "1.82rem",
                paddingInline: 0,
                paddingBlock: 0,
                borderRadius: "999px",
                color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
                lineHeight: 0,
              }}
              onClick={(event) => {
                if (!disabled) {
                  setOpen(false, "close-button", event);
                }
              }}
            >
              <span
                aria-hidden
                style={{ display: "inline-flex", lineHeight: 0 }}
              >
                <FiX size={14} />
              </span>
            </Button>
          </div>
        ) : null}

        {headerChildren.length > 0 ? (
          <div style={sectionStyle}>{headerChildren}</div>
        ) : null}

        {bodyChildren.length > 0 ? (
          scrollable ? (
            <Scrollbar axis="y" style={bodySectionStyle}>
              {bodyChildren}
            </Scrollbar>
          ) : (
            <div style={bodySectionStyle}>{bodyChildren}</div>
          )
        ) : null}

        {footerChildren.length > 0 ? (
          <div style={sectionStyle}>{footerChildren}</div>
        ) : null}
      </div>
    </div>
  );
}

export function SheetHeader({
  children,
  className = "",
  style,
  ...props
}: SheetHeaderProps): JSX.Element {
  const composedClassName = className.trim() === "" ? undefined : className;

  const headerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    margin: 0,
    paddingInlineEnd: "var(--ktn-sheet-close-space, 0px)",
    ...style,
  };

  return (
    <div className={composedClassName} style={headerStyle} {...props}>
      {children}
    </div>
  );
}

export function SheetTitle({
  children,
  className = "",
  style,
  id,
  ...props
}: SheetTitleProps): JSX.Element {
  const { titleId } = useSheetContextValue();
  const composedClassName = className.trim() === "" ? undefined : className;
  const resolvedId = id ?? (titleId === "" ? undefined : titleId);

  const titleStyle: CSSProperties = {
    margin: 0,
    fontWeight: 600,
    fontSize: "1.08rem",
    lineHeight: 1.3,
    color: "var(--ktn-text-primary)",
    ...style,
  };

  return (
    <h3
      id={resolvedId}
      className={composedClassName}
      style={titleStyle}
      {...props}
    >
      {children}
    </h3>
  );
}

export function SheetDescription({
  children,
  className = "",
  style,
  id,
  ...props
}: SheetDescriptionProps): JSX.Element {
  const { descriptionId } = useSheetContextValue();
  const composedClassName = className.trim() === "" ? undefined : className;
  const resolvedId = id ?? (descriptionId === "" ? undefined : descriptionId);

  const descriptionStyle: CSSProperties = {
    margin: 0,
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: 1.45,
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    ...style,
  };

  return (
    <p
      id={resolvedId}
      className={composedClassName}
      style={descriptionStyle}
      {...props}
    >
      {children}
    </p>
  );
}

export function SheetFooter({
  children,
  sticky = false,
  className = "",
  style,
  ...props
}: SheetFooterProps): JSX.Element {
  const composedClassName = className.trim() === "" ? undefined : className;

  const footerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    width: "100%",
    boxSizing: "border-box",
    gap: "0.5rem",
    marginTop: "0.15rem",
    ...(sticky
      ? {
          backgroundColor: "var(--ktn-bg-surface, #ffffff)",
          paddingBlockStart: "0.65rem",
          borderTop: "1px solid var(--ktn-border-muted)",
        }
      : {}),
    ...style,
  };

  return (
    <div className={composedClassName} style={footerStyle} {...props}>
      {children}
    </div>
  );
}
