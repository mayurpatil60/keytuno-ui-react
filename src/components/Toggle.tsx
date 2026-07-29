import {
  cloneElement,
  isValidElement,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { Button, type ButtonProps } from "./Button";

export type ToggleActionSource = "click" | "pressed-change" | "focus" | "blur";

export interface ToggleActionContext {
  source: ToggleActionSource;
  pressed: boolean;
  previousPressed?: boolean;
  variant: ToggleVariant;
  disabled: boolean;
  event?: unknown;
}

export interface ToggleProps extends Omit<
  ButtonProps,
  "aria-pressed" | "onAction"
> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  fillIconOnPressed?: boolean;
  onAction?: (context: ToggleActionContext) => void;
}

type ToggleVariant = NonNullable<ButtonProps["variant"]>;

const pressedStyles: Record<ToggleVariant, CSSProperties> = {
  primary: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 90%, black)",
    borderColor: "color-mix(in srgb, var(--ktn-action-primary-bg) 90%, black)",
  },
  outline: {
    backgroundColor: "var(--ktn-bg-muted, rgba(127, 127, 127, 0.1))",
    borderColor: "var(--ktn-border-strong, var(--ktn-border-muted))",
  },
  secondary: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-bg-surface) 88%, var(--ktn-text-primary))",
    borderColor: "var(--ktn-border-strong, var(--ktn-border-muted))",
  },
  success: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-success-bg, #15803d) 90%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-success-bg, #15803d) 90%, black)",
  },
  warning: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #ca8a04) 90%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-warning-bg, #ca8a04) 90%, black)",
  },
  accent: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-accent-bg, #7c3aed) 90%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-accent-bg, #7c3aed) 90%, black)",
  },
  ghost: {
    backgroundColor: "var(--ktn-bg-muted, rgba(127, 127, 127, 0.1))",
    borderColor: "transparent",
  },
  destructive: {
    backgroundColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 90%, black)",
    borderColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 90%, black)",
  },
  link: {
    color: "color-mix(in srgb, var(--ktn-action-primary-bg) 85%, black)",
  },
};

function resolveVariant(variant?: ButtonProps["variant"]): ToggleVariant {
  if (variant != null) {
    return variant;
  }

  return "primary";
}

function isIconLikeElement(element: ReactElement): boolean {
  if (typeof element.type === "string") {
    return element.type === "svg";
  }

  const componentType = element.type as { displayName?: string; name?: string };
  const componentName =
    `${componentType.displayName ?? componentType.name ?? ""}`.toLowerCase();

  return (
    componentName.includes("icon") ||
    componentName.startsWith("fi") ||
    componentName.startsWith("fa") ||
    componentName.startsWith("md") ||
    componentName.startsWith("ri")
  );
}

function applyPressedIconFill(node: ReactNode): ReactNode {
  if (Array.isArray(node)) {
    return node.map((item) => applyPressedIconFill(item));
  }

  if (!isValidElement(node)) {
    return node;
  }

  const element = node as ReactElement<{
    children?: ReactNode;
    style?: CSSProperties;
    fill?: string;
  }>;

  const currentChildren = element.props.children;
  const nextChildren =
    currentChildren !== undefined
      ? applyPressedIconFill(currentChildren)
      : currentChildren;

  const nextProps: {
    children?: ReactNode;
    style?: CSSProperties;
    fill?: string;
  } = {};

  if (nextChildren !== currentChildren) {
    nextProps.children = nextChildren;
  }

  if (isIconLikeElement(element)) {
    nextProps.style = {
      ...element.props.style,
      fill: "currentColor",
    };
    nextProps.fill = "currentColor";
  }

  if (Object.keys(nextProps).length === 0) {
    return element;
  }

  return cloneElement(element as ReactElement<any>, nextProps);
}

export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  fillIconOnPressed = true,
  onAction,
  variant,
  disabled = false,
  onClick,
  onFocus,
  onBlur,
  children,
  style,
  ...props
}: ToggleProps): JSX.Element {
  const [uncontrolledPressed, setUncontrolledPressed] = useState(
    defaultPressed === true,
  );
  const isControlled = pressed !== undefined;
  const isPressed = isControlled ? pressed === true : uncontrolledPressed;
  const resolvedVariant = resolveVariant(variant);

  function emitAction(
    source: ToggleActionSource,
    options?: {
      pressed?: boolean;
      previousPressed?: boolean;
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      pressed: options?.pressed ?? isPressed,
      previousPressed: options?.previousPressed,
      variant: resolvedVariant,
      disabled,
      event: options?.event,
    });
  }

  function setPressed(nextPressed: boolean, event?: unknown): void {
    const previousPressed = isPressed;

    if (!isControlled) {
      setUncontrolledPressed(nextPressed);
    }

    onPressedChange?.(nextPressed);
    emitAction("pressed-change", {
      pressed: nextPressed,
      previousPressed,
      event,
    });
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);

    if (!event.defaultPrevented) {
      emitAction("click", {
        event,
      });
    }

    if (event.defaultPrevented || disabled) {
      return;
    }

    setPressed(!isPressed, event);
  }

  function handleFocus(event: FocusEvent<HTMLButtonElement>): void {
    onFocus?.(event);

    if (!event.defaultPrevented) {
      emitAction("focus", {
        event,
      });
    }
  }

  function handleBlur(event: FocusEvent<HTMLButtonElement>): void {
    onBlur?.(event);

    if (!event.defaultPrevented) {
      emitAction("blur", {
        event,
      });
    }
  }

  const toggleStyle: CSSProperties = {
    ...(isPressed && !disabled ? pressedStyles[resolvedVariant] : {}),
    ...style,
  };

  const renderedChildren =
    isPressed && fillIconOnPressed ? applyPressedIconFill(children) : children;

  return (
    <Button
      {...props}
      variant={variant}
      disabled={disabled}
      style={toggleStyle}
      aria-pressed={isPressed}
      data-state={isPressed ? "on" : "off"}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {renderedChildren}
    </Button>
  );
}
