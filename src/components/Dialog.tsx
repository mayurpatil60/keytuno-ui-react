import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import { FiX } from "./icons/feather";

import { Button } from "./Button";
import { Scrollbar } from "./Scrollbar";

export type DialogVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

export type DialogSize = "xs" | "sm" | "md" | "lg";
export type DialogActionSource =
  | "trigger"
  | "overlay"
  | "escape"
  | "close-button"
  | "open-change";

export interface DialogActionContext {
  source: DialogActionSource;
  open: boolean;
  event?: unknown;
}

export interface DialogProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (context: DialogActionContext) => void;
  trigger?: ReactNode;
  variant?: DialogVariant;
  size?: DialogSize;
  disabled?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean;
  scrollable?: boolean;
  maxContentHeight?: string;
  closeButtonLabel?: string;
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  sticky?: boolean;
}

type DialogSizeTokens = {
  maxWidth: string;
  titleFontSize: string;
  descriptionFontSize: string;
  bodyFontSize: string;
  sectionPadding: string;
  sectionGap: string;
  footerGap: string;
  closeButtonSize: string;
};

type DialogVariantTokens = {
  borderColor: string;
  backgroundColor: string;
  titleColor: string;
  descriptionColor: string;
};

interface DialogContextValue {
  open: boolean;
  setOpen: (
    open: boolean,
    source?: DialogActionSource,
    event?: unknown,
  ) => void;
  size: DialogSize;
  variant: DialogVariant;
  disabled: boolean;
  contentId: string;
  titleId: string;
  descriptionId: string;
  setContentNode: (node: HTMLDivElement | null) => void;
}

const sizeTokens: Record<DialogSize, DialogSizeTokens> = {
  xs: {
    maxWidth: "21rem",
    titleFontSize: "0.925rem",
    descriptionFontSize: "0.76rem",
    bodyFontSize: "0.76rem",
    sectionPadding: "0.7rem",
    sectionGap: "0.45rem",
    footerGap: "0.35rem",
    closeButtonSize: "1.6rem",
  },
  sm: {
    maxWidth: "25rem",
    titleFontSize: "1rem",
    descriptionFontSize: "0.82rem",
    bodyFontSize: "0.82rem",
    sectionPadding: "0.8rem",
    sectionGap: "0.52rem",
    footerGap: "0.45rem",
    closeButtonSize: "1.72rem",
  },
  md: {
    maxWidth: "30rem",
    titleFontSize: "1.08rem",
    descriptionFontSize: "0.875rem",
    bodyFontSize: "0.875rem",
    sectionPadding: "0.95rem",
    sectionGap: "0.6rem",
    footerGap: "0.5rem",
    closeButtonSize: "1.82rem",
  },
  lg: {
    maxWidth: "37rem",
    titleFontSize: "1.17rem",
    descriptionFontSize: "0.94rem",
    bodyFontSize: "0.94rem",
    sectionPadding: "1.1rem",
    sectionGap: "0.7rem",
    footerGap: "0.6rem",
    closeButtonSize: "1.92rem",
  },
};

const variantTokens: Record<DialogVariant, DialogVariantTokens> = {
  primary: {
    borderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 44%, var(--ktn-border-muted))",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    titleColor: "var(--ktn-text-primary)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
  secondary: {
    borderColor: "var(--ktn-border-muted)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    titleColor: "var(--ktn-text-primary)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
  destructive: {
    borderColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 45%, var(--ktn-border-muted))",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    titleColor: "var(--ktn-action-danger-bg, #dc2626)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
  outline: {
    borderColor: "var(--ktn-border-muted)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    titleColor: "var(--ktn-text-primary)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
  ghost: {
    borderColor: "transparent",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    titleColor: "var(--ktn-text-primary)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
  link: {
    borderColor: "transparent",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    titleColor: "var(--ktn-action-primary-bg)",
    descriptionColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
};

const baseDialogClasses = "relative inline-flex";

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContextValue(): DialogContextValue {
  const contextValue = useContext(DialogContext);

  if (contextValue != null) {
    return contextValue;
  }

  return {
    open: false,
    setOpen: () => {},
    size: "md",
    variant: "primary",
    disabled: false,
    contentId: "",
    titleId: "",
    descriptionId: "",
    setContentNode: () => {},
  };
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelector =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"),
  );
}

function containsComponentType(
  node: ReactNode,
  targetComponent: unknown,
): boolean {
  if (!isValidElement(node)) {
    return false;
  }

  const element = node as ReactElement<{ children?: ReactNode }>;

  if (element.type === targetComponent) {
    return true;
  }

  return Children.toArray(element.props.children).some((child) =>
    containsComponentType(child, targetComponent),
  );
}

function resolveTriggerVariant(
  variant: DialogVariant,
): "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link" {
  if (variant === "secondary") {
    return "secondary";
  }

  if (variant === "destructive") {
    return "destructive";
  }

  if (variant === "outline") {
    return "outline";
  }

  if (variant === "ghost") {
    return "ghost";
  }

  if (variant === "link") {
    return "link";
  }

  return "primary";
}

export function Dialog({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  onAction,
  trigger,
  variant,
  size = "md",
  disabled = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  style,
  ...props
}: DialogProps): JSX.Element {
  const resolvedVariant = variant ?? "primary";
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open === true : uncontrolledOpen;
  const dialogId = useId();
  const contentId = `${dialogId}-content`;
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;
  const [contentNode, setContentNode] = useState<HTMLDivElement | null>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  function setDialogOpen(
    nextOpen: boolean,
    source: DialogActionSource = "open-change",
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
  }

  useEffect(() => {
    if (!(isOpen && closeOnEscape && !disabled)) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        setDialogOpen(false, "escape", event);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEscape, disabled, isOpen, onAction, onOpenChange]);

  useEffect(() => {
    if (!(isOpen && contentNode != null)) {
      return;
    }

    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const frameId = window.requestAnimationFrame(() => {
      const focusableElements = getFocusableElements(contentNode);
      const focusTarget = focusableElements[0] ?? contentNode;
      focusTarget.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [contentNode, isOpen]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    const previousFocusedElement = previousFocusedElementRef.current;

    if (previousFocusedElement != null && previousFocusedElement.isConnected) {
      previousFocusedElement.focus();
    }

    previousFocusedElementRef.current = null;
  }, [isOpen]);

  useEffect(() => {
    if (!(isOpen && contentNode != null)) {
      return;
    }

    const focusTrapNode = contentNode;

    function handleFocusTrap(event: KeyboardEvent): void {
      if (event.key !== "Tab") {
        return;
      }

      const activeElement = document.activeElement;

      if (
        !(activeElement instanceof HTMLElement) ||
        !focusTrapNode.contains(activeElement)
      ) {
        return;
      }

      const focusableElements = getFocusableElements(focusTrapNode);

      if (focusableElements.length === 0) {
        event.preventDefault();
        focusTrapNode.focus();
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (activeElement === firstFocusable || activeElement === contentNode) {
          event.preventDefault();
          lastFocusable.focus();
        }

        return;
      }

      if (activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }

    document.addEventListener("keydown", handleFocusTrap);

    return () => {
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [contentNode, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function renderTrigger(): ReactNode {
    if (trigger == null) {
      return null;
    }

    if (isValidElement(trigger)) {
      const triggerElement = trigger as ReactElement<{
        onClick?: (event: unknown) => void;
        "aria-haspopup"?: "dialog";
        "aria-expanded"?: boolean;
        "aria-controls"?: string;
        "aria-disabled"?: boolean;
      }>;

      return cloneElement(triggerElement, {
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
        "aria-controls": contentId,
        "aria-disabled": disabled,
        onClick: (event: unknown) => {
          triggerElement.props.onClick?.(event);

          const defaultPrevented =
            typeof event === "object" &&
            event != null &&
            "defaultPrevented" in event &&
            (event as { defaultPrevented?: boolean }).defaultPrevented === true;

          if (!defaultPrevented) {
            setDialogOpen(true, "trigger", event);
          }
        },
      });
    }

    return (
      <Button
        type="button"
        variant={resolveTriggerVariant(resolvedVariant)}
        size={size}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onAction={(event) => {
          setDialogOpen(true, "trigger", event);
        }}
      >
        {trigger}
      </Button>
    );
  }

  const rootStyle: CSSProperties = {
    position: "relative",
    ...style,
  };

  const layerStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  };

  const backdropStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(2, 6, 23, 0.58)",
    backdropFilter: "blur(2px)",
  };

  const viewportStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none",
  };

  const contextValue: DialogContextValue = {
    open: isOpen,
    setOpen: setDialogOpen,
    size,
    variant: resolvedVariant,
    disabled,
    contentId,
    titleId,
    descriptionId,
    setContentNode,
  };

  const composedClassName = `${baseDialogClasses} ${className}`.trim();

  return (
    <DialogContext.Provider value={contextValue}>
      <div className={composedClassName} style={rootStyle} {...props}>
        {renderTrigger()}

        {isOpen ? (
          <div style={layerStyle}>
            <div
              aria-hidden
              style={backdropStyle}
              onClick={(event) => {
                if (closeOnOverlayClick) {
                  setDialogOpen(false, "overlay", event);
                }
              }}
            />

            <div style={viewportStyle}>{children}</div>
          </div>
        ) : null}
      </div>
    </DialogContext.Provider>
  );
}

export function DialogContent({
  children,
  showCloseButton = true,
  scrollable = false,
  maxContentHeight = "min(86vh, 40rem)",
  closeButtonLabel = "Close dialog",
  className = "",
  style,
  ...props
}: DialogContentProps): JSX.Element {
  const {
    setOpen,
    size,
    variant,
    disabled,
    contentId,
    titleId,
    descriptionId,
    setContentNode,
  } = useDialogContextValue();
  const sizeToken = sizeTokens[size];
  const variantToken = variantTokens[variant];
  const hasTitle = Children.toArray(children).some((child) =>
    containsComponentType(child, DialogTitle),
  );
  const hasDescription = Children.toArray(children).some((child) =>
    containsComponentType(child, DialogDescription),
  );
  const labelledByFromProps = props["aria-labelledby"];
  const describedByFromProps = props["aria-describedby"];

  const headerChildren: ReactNode[] = [];
  const bodyChildren: ReactNode[] = [];
  const footerChildren: ReactNode[] = [];

  Children.toArray(children).forEach((child) => {
    if (isValidElement(child) && child.type === DialogHeader) {
      headerChildren.push(child);
      return;
    }

    if (isValidElement(child) && child.type === DialogFooter) {
      footerChildren.push(child);
      return;
    }

    bodyChildren.push(child);
  });

  const hasHeaderBodySeparation =
    headerChildren.length > 0 && bodyChildren.length > 0;
  const hasFooterBodySeparation =
    footerChildren.length > 0 && bodyChildren.length > 0;
  const [bodyViewportNode, setBodyViewportNode] =
    useState<HTMLDivElement | null>(null);
  const [bodyContentNode, setBodyContentNode] = useState<HTMLDivElement | null>(
    null,
  );
  const [shouldUseBodyScrollbar, setShouldUseBodyScrollbar] = useState(false);
  const shouldUseMiddleScrollbar = scrollable || shouldUseBodyScrollbar;

  useEffect(() => {
    if (bodyChildren.length === 0) {
      setShouldUseBodyScrollbar(false);
      return;
    }

    if (bodyViewportNode == null || bodyContentNode == null) {
      return;
    }

    let frameId: number | null = null;

    const measureOverflow = (): void => {
      const contentHeight = Math.max(
        bodyContentNode.getBoundingClientRect().height,
        bodyContentNode.scrollHeight,
      );
      const viewportHeight = bodyViewportNode.clientHeight;
      const overflowDelta = contentHeight - viewportHeight;

      setShouldUseBodyScrollbar((previousValue) => {
        // Add a tiny hysteresis band to avoid rapid on/off jitter on
        // sub-pixel layout changes.
        const nextShouldScroll = previousValue
          ? overflowDelta > 0.5
          : overflowDelta > 1.5;

        return previousValue === nextShouldScroll
          ? previousValue
          : nextShouldScroll;
      });
    };

    const scheduleMeasure = (): void => {
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        measureOverflow();
      });
    };

    scheduleMeasure();

    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        scheduleMeasure();
      });
      resizeObserver.observe(bodyViewportNode);
      resizeObserver.observe(bodyContentNode);
    }

    if (typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver(() => {
        scheduleMeasure();
      });

      mutationObserver.observe(bodyContentNode, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    window.addEventListener("resize", scheduleMeasure);

    return () => {
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }

      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [bodyChildren.length, bodyContentNode, bodyViewportNode]);

  function closeDialog(event?: unknown): void {
    if (!disabled) {
      setOpen(false, "close-button", event);
    }
  }

  function renderCloseButton(): ReactNode {
    if (!showCloseButton) {
      return null;
    }

    return (
      <Button
        type="button"
        variant="ghost"
        size="xs"
        disabled={disabled}
        aria-label={closeButtonLabel}
        style={{
          width: sizeToken.closeButtonSize,
          height: sizeToken.closeButtonSize,
          minHeight: sizeToken.closeButtonSize,
          paddingInline: 0,
          paddingBlock: 0,
          borderRadius: "999px",
          color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
          lineHeight: 0,
        }}
        onAction={(event) => {
          closeDialog(event);
        }}
      >
        <span aria-hidden style={{ display: "inline-flex", lineHeight: 0 }}>
          <FiX size={14} />
        </span>
      </Button>
    );
  }

  const resolvedMaxContentHeight = `min(${maxContentHeight}, calc(100vh - 2.5rem))`;
  const sectionSpacing = shouldUseMiddleScrollbar
    ? `calc(${sizeToken.sectionGap} + 0.18rem)`
    : sizeToken.sectionGap;

  const contentStyle: CSSProperties = {
    position: "relative",
    pointerEvents: "auto",
    width: `min(100%, ${sizeToken.maxWidth})`,
    maxHeight: resolvedMaxContentHeight,
    overflow: "visible",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: variantToken.borderColor,
    borderRadius: "var(--ktn-radius-lg, 0.75rem)",
    backgroundColor: variantToken.backgroundColor,
    boxShadow: "0 24px 56px rgba(15, 23, 42, 0.28)",
    color: "var(--ktn-text-primary)",
    display: "flex",
    flexDirection: "column",
    gap: sectionSpacing,
    padding: sizeToken.sectionPadding,
    fontSize: sizeToken.bodyFontSize,
    lineHeight: 1.5,
    opacity: disabled ? 0.72 : 1,
    ["--ktn-dialog-close-space" as string]: showCloseButton
      ? `calc(${sizeToken.closeButtonSize} + 0.5rem)`
      : "0px",
    ["--ktn-dialog-header-divider" as string]: hasHeaderBodySeparation
      ? "1px solid var(--ktn-border-muted)"
      : "none",
    ["--ktn-dialog-header-divider-space" as string]: hasHeaderBodySeparation
      ? "0.5rem"
      : "0px",
    ["--ktn-dialog-footer-divider" as string]: hasFooterBodySeparation
      ? "1px solid var(--ktn-border-muted)"
      : "none",
    ["--ktn-dialog-footer-divider-space" as string]: hasFooterBodySeparation
      ? "0.5rem"
      : "0px",
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

  const composedClassName = className.trim() === "" ? undefined : className;

  const sectionStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: sizeToken.sectionGap,
    flexShrink: 0,
    minWidth: 0,
    width: "100%",
  };

  const bodyViewportStyle: CSSProperties = {
    ...sectionStyle,
    flex: 1,
    minHeight: 0,
    paddingBlock: "0.1rem",
  };

  const bodyScrollbarStyle: CSSProperties = {
    height: "100%",
    boxSizing: "border-box",
    paddingInlineStart: "0.1rem",
    paddingInlineEnd: shouldUseMiddleScrollbar ? "0.4rem" : "0.1rem",
    overflowY: shouldUseMiddleScrollbar ? "auto" : "hidden",
  };

  const bodyContentStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: sizeToken.sectionGap,
    minWidth: 0,
    width: "100%",
  };

  return (
    <div
      {...props}
      id={contentId}
      ref={(node) => {
        setContentNode(node);
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledByFromProps ?? (hasTitle ? titleId : undefined)}
      aria-describedby={
        describedByFromProps ?? (hasDescription ? descriptionId : undefined)
      }
      tabIndex={-1}
      className={composedClassName}
      style={contentStyle}
    >
      {showCloseButton ? (
        <div style={closeWrapStyle}>{renderCloseButton()}</div>
      ) : null}

      {headerChildren.length > 0 ? (
        <div style={sectionStyle}>{headerChildren}</div>
      ) : null}

      {bodyChildren.length > 0 ? (
        <div
          ref={(node) => {
            setBodyViewportNode(node);
          }}
          style={bodyViewportStyle}
        >
          <Scrollbar
            axis="y"
            role="presentation"
            tabIndex={-1}
            style={bodyScrollbarStyle}
          >
            <div
              ref={(node) => {
                setBodyContentNode(node);
              }}
              style={bodyContentStyle}
            >
              {bodyChildren}
            </div>
          </Scrollbar>
        </div>
      ) : null}

      {footerChildren.length > 0 ? (
        <div style={sectionStyle}>{footerChildren}</div>
      ) : null}
    </div>
  );
}

export function DialogHeader({
  children,
  className = "",
  style,
  ...props
}: DialogHeaderProps): JSX.Element {
  const { size } = useDialogContextValue();
  const sizeToken = sizeTokens[size];
  const composedClassName = className.trim() === "" ? undefined : className;

  const headerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    margin: 0,
    paddingInlineEnd: "var(--ktn-dialog-close-space, 0px)",
    paddingBlockEnd: "var(--ktn-dialog-header-divider-space, 0px)",
    borderBottom: "var(--ktn-dialog-header-divider, none)",
    ...style,
  };

  return (
    <div className={composedClassName} style={headerStyle} {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
  className = "",
  style,
  ...props
}: DialogTitleProps): JSX.Element {
  const { size, variant, titleId } = useDialogContextValue();
  const sizeToken = sizeTokens[size];
  const variantToken = variantTokens[variant];
  const composedClassName = className.trim() === "" ? undefined : className;

  const titleStyle: CSSProperties = {
    margin: 0,
    fontWeight: 600,
    fontSize: sizeToken.titleFontSize,
    lineHeight: 1.3,
    color: variantToken.titleColor,
    ...style,
  };

  return (
    <h3
      id={titleId}
      className={composedClassName}
      style={titleStyle}
      {...props}
    >
      {children}
    </h3>
  );
}

export function DialogDescription({
  children,
  className = "",
  style,
  ...props
}: DialogDescriptionProps): JSX.Element {
  const { size, variant, descriptionId } = useDialogContextValue();
  const sizeToken = sizeTokens[size];
  const variantToken = variantTokens[variant];
  const composedClassName = className.trim() === "" ? undefined : className;

  const descriptionStyle: CSSProperties = {
    margin: 0,
    fontWeight: 400,
    fontSize: sizeToken.descriptionFontSize,
    lineHeight: 1.45,
    color: variantToken.descriptionColor,
    ...style,
  };

  return (
    <p
      id={descriptionId}
      className={composedClassName}
      style={descriptionStyle}
      {...props}
    >
      {children}
    </p>
  );
}

export function DialogFooter({
  children,
  sticky = false,
  className = "",
  style,
  ...props
}: DialogFooterProps): JSX.Element {
  const { size, variant } = useDialogContextValue();
  const sizeToken = sizeTokens[size];
  const variantToken = variantTokens[variant];
  const composedClassName = className.trim() === "" ? undefined : className;

  const footerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    width: "100%",
    boxSizing: "border-box",
    gap: sizeToken.footerGap,
    marginTop: "0.15rem",
    paddingBlockStart: "var(--ktn-dialog-footer-divider-space, 0px)",
    borderTop: "var(--ktn-dialog-footer-divider, none)",
    ...(sticky
      ? {
          backgroundColor: variantToken.backgroundColor,
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
