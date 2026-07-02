import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { Button, type ButtonProps } from "./Button";
import { Input, type InputProps, type InputSize } from "./Input";

export type InputGroupVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

export type InputGroupSize = "xs" | "sm" | "md" | "lg";

export type InputGroupAlign =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end";
export type InputGroupActionSource =
  | "focus-within"
  | "blur-within"
  | "control-change"
  | "button-action";

export interface InputGroupActionContext {
  source: InputGroupActionSource;
  variant: InputGroupVariant;
  size: InputGroupSize;
  align: InputGroupAlign;
  disabled: boolean;
  required: boolean;
  value?: string;
  event?: unknown;
}

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  variant?: InputGroupVariant;
  size?: InputGroupSize;
  align?: InputGroupAlign;
  disabled?: boolean;
  required?: boolean;
  onAction?: (context: InputGroupActionContext) => void;
}

export interface InputGroupAddonProps extends HTMLAttributes<HTMLDivElement> {
  align?: InputGroupAlign;
}

export interface InputGroupButtonProps extends Omit<
  ButtonProps,
  "size" | "variant" | "disabled"
> {
  variant?: InputGroupVariant;
  size?: InputGroupSize;
  disabled?: boolean;
}

export interface InputGroupInputProps extends Omit<
  InputProps,
  "size" | "disabled" | "required"
> {
  size?: InputGroupSize;
  disabled?: boolean;
  required?: boolean;
}

export interface InputGroupTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "disabled" | "required"
> {
  size?: InputGroupSize;
  disabled?: boolean;
  required?: boolean;
}

type InputGroupSizeTokens = {
  controlHeight: string;
  fontSize: string;
  controlPaddingInline: string;
  addonPaddingInline: string;
  addonPaddingBlock: string;
  textareaMinHeight: string;
  buttonHeight: string;
  buttonPaddingInline: string;
  buttonSize: InputSize;
};

interface InputGroupContextValue {
  variant: InputGroupVariant;
  size: InputGroupSize;
  align: InputGroupAlign;
  disabled: boolean;
  required: boolean;
  isFocused: boolean;
  onControlFocus: (event?: unknown) => void;
  onControlBlur: (event?: unknown) => void;
  emitAction: (
    source: InputGroupActionSource,
    details?: { value?: string; event?: unknown },
  ) => void;
}

const sizeTokens: Record<InputGroupSize, InputGroupSizeTokens> = {
  xs: {
    controlHeight: "1.9rem",
    fontSize: "0.75rem",
    controlPaddingInline: "0.55rem",
    addonPaddingInline: "0.5rem",
    addonPaddingBlock: "0.3rem",
    textareaMinHeight: "4.5rem",
    buttonHeight: "1.45rem",
    buttonPaddingInline: "0.5rem",
    buttonSize: "xs",
  },
  sm: {
    controlHeight: "2.1rem",
    fontSize: "0.8125rem",
    controlPaddingInline: "0.6rem",
    addonPaddingInline: "0.55rem",
    addonPaddingBlock: "0.325rem",
    textareaMinHeight: "5.25rem",
    buttonHeight: "1.65rem",
    buttonPaddingInline: "0.6rem",
    buttonSize: "sm",
  },
  md: {
    controlHeight: "2.35rem",
    fontSize: "0.875rem",
    controlPaddingInline: "0.625rem",
    addonPaddingInline: "0.625rem",
    addonPaddingBlock: "0.35rem",
    textareaMinHeight: "6rem",
    buttonHeight: "1.85rem",
    buttonPaddingInline: "0.75rem",
    buttonSize: "sm",
  },
  lg: {
    controlHeight: "2.6rem",
    fontSize: "0.9375rem",
    controlPaddingInline: "0.7rem",
    addonPaddingInline: "0.7rem",
    addonPaddingBlock: "0.4rem",
    textareaMinHeight: "6.75rem",
    buttonHeight: "2.1rem",
    buttonPaddingInline: "0.85rem",
    buttonSize: "md",
  },
};

const groupVariantStyles: Record<InputGroupVariant, CSSProperties> = {
  primary: {
    borderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 42%, var(--ktn-border-muted))",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
  },
  secondary: {
    borderColor: "var(--ktn-border-muted)",
    backgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))",
    color: "var(--ktn-text-primary)",
  },
  destructive: {
    borderColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 42%, var(--ktn-border-muted))",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
  },
  outline: {
    borderColor: "var(--ktn-border-muted)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
  },
  ghost: {
    borderColor: "transparent",
    backgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.1))",
    color: "var(--ktn-text-primary)",
  },
  link: {
    borderColor: "var(--ktn-action-primary-bg)",
    borderWidth: "0 0 1px 0",
    borderRadius: 0,
    backgroundColor: "transparent",
    color: "var(--ktn-action-primary-bg)",
  },
};

const focusStyles: Record<InputGroupVariant, CSSProperties> = {
  primary: {
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.24)",
  },
  secondary: {
    boxShadow: "0 0 0 2px rgba(100, 116, 139, 0.2)",
  },
  destructive: {
    boxShadow: "0 0 0 2px rgba(220, 38, 38, 0.24)",
  },
  outline: {
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
  },
  ghost: {
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.16)",
  },
  link: {
    boxShadow: "0 1px 0 0 rgba(37, 99, 235, 0.35)",
  },
};

const baseGroupClasses = "relative min-w-0 w-full";
const InputGroupContext = createContext<InputGroupContextValue | null>(null);

function resolveVariant(
  variant: InputGroupVariant | undefined,
): InputGroupVariant {
  return variant ?? "primary";
}

function isBlockAlign(align: InputGroupAlign): boolean {
  return align === "block-start" || align === "block-end";
}

function normalizeAddonAlign(
  groupAlign: InputGroupAlign,
  addonAlign: InputGroupAlign | undefined,
): InputGroupAlign {
  const resolvedAlign = addonAlign ?? groupAlign;

  if (isBlockAlign(groupAlign)) {
    return resolvedAlign === "block-start" || resolvedAlign === "block-end"
      ? resolvedAlign
      : "block-start";
  }

  return resolvedAlign === "inline-start" || resolvedAlign === "inline-end"
    ? resolvedAlign
    : "inline-start";
}

function getAddonSeparatorStyle(align: InputGroupAlign): CSSProperties {
  if (align === "inline-start") {
    return {
      borderInlineEnd: "1px solid var(--ktn-border-muted)",
    };
  }

  if (align === "inline-end") {
    return {
      borderInlineStart: "1px solid var(--ktn-border-muted)",
    };
  }

  if (align === "block-start") {
    return {
      borderBlockEnd: "1px solid var(--ktn-border-muted)",
    };
  }

  return {
    borderBlockStart: "1px solid var(--ktn-border-muted)",
  };
}

function useInputGroupContextValue(): InputGroupContextValue {
  const contextValue = useContext(InputGroupContext);

  if (contextValue != null) {
    return contextValue;
  }

  return {
    variant: "primary",
    size: "md",
    align: "inline-start",
    disabled: false,
    required: false,
    isFocused: false,
    onControlFocus: () => {
      // no-op fallback for standalone subcomponent usage
    },
    onControlBlur: () => {
      // no-op fallback for standalone subcomponent usage
    },
    emitAction: () => {
      // no-op fallback for standalone subcomponent usage
    },
  };
}

export function InputGroup({
  children,
  variant,
  size = "md",
  align = "inline-start",
  disabled = false,
  required = false,
  onAction,
  className = "",
  style,
  ...props
}: InputGroupProps): JSX.Element {
  const { role, ...restProps } = props;
  const [focusedControlCount, setFocusedControlCount] = useState(0);
  const resolvedVariant = resolveVariant(variant);
  const contextValue = useMemo<InputGroupContextValue>(
    () => ({
      variant: resolvedVariant,
      size,
      align,
      disabled,
      required,
      isFocused: focusedControlCount > 0,
      emitAction: (source, details) => {
        onAction?.({
          source,
          variant: resolvedVariant,
          size,
          align,
          disabled,
          required,
          value: details?.value,
          event: details?.event,
        });
      },
      onControlFocus: (event) => {
        if (disabled) {
          return;
        }

        setFocusedControlCount((currentCount) => {
          if (currentCount === 0) {
            onAction?.({
              source: "focus-within",
              variant: resolvedVariant,
              size,
              align,
              disabled,
              required,
              event,
            });
          }

          return currentCount + 1;
        });
      },
      onControlBlur: (event) => {
        if (disabled) {
          return;
        }

        setFocusedControlCount((currentCount) => {
          const nextCount = Math.max(0, currentCount - 1);

          if (currentCount > 0 && nextCount === 0) {
            onAction?.({
              source: "blur-within",
              variant: resolvedVariant,
              size,
              align,
              disabled,
              required,
              event,
            });
          }

          return nextCount;
        });
      },
    }),
    [
      align,
      disabled,
      focusedControlCount,
      onAction,
      required,
      resolvedVariant,
      size,
    ],
  );

  const rootStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: isBlockAlign(align) ? "column" : "row",
    alignItems: "stretch",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "var(--ktn-radius-md, 0.5rem)",
    overflow: "hidden",
    transition:
      "border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease",
    ...groupVariantStyles[resolvedVariant],
    ...(contextValue.isFocused && !disabled
      ? focusStyles[resolvedVariant]
      : {}),
    ...(disabled
      ? {
          cursor: "not-allowed",
        }
      : {}),
    ...style,
  };

  return (
    <InputGroupContext.Provider value={contextValue}>
      <div
        role={role ?? "group"}
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        className={`${baseGroupClasses} ${className}`.trim()}
        style={rootStyle}
        {...restProps}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
}

export function InputGroupAddon({
  children,
  align,
  className = "",
  style,
  ...props
}: InputGroupAddonProps): JSX.Element {
  const contextValue = useInputGroupContextValue();
  const tokens = sizeTokens[contextValue.size];
  const resolvedAlign = normalizeAddonAlign(contextValue.align, align);
  const blockAlign = isBlockAlign(resolvedAlign);

  const addonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: blockAlign ? "space-between" : "center",
    gap: "0.4rem",
    flexShrink: 0,
    minHeight: tokens.controlHeight,
    fontSize: tokens.fontSize,
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    paddingInline: tokens.addonPaddingInline,
    ...(blockAlign
      ? {
          width: "100%",
          paddingBlock: tokens.addonPaddingBlock,
        }
      : {
          paddingBlock: 0,
        }),
    ...getAddonSeparatorStyle(resolvedAlign),
    ...(resolvedAlign === "inline-start" || resolvedAlign === "block-start"
      ? {
          order: -1,
        }
      : {
          order: 1,
        }),
    ...(contextValue.disabled
      ? {
          opacity: 0.72,
          cursor: "not-allowed",
        }
      : {}),
    ...style,
  };

  return (
    <div
      className={className.trim() === "" ? undefined : className}
      style={addonStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export function InputGroupButton({
  children,
  variant,
  size,
  disabled,
  onAction,
  style,
  ...props
}: InputGroupButtonProps): JSX.Element {
  const contextValue = useInputGroupContextValue();
  const resolvedVariant = variant ?? contextValue.variant;
  const resolvedSize = size ?? contextValue.size;
  const tokens = sizeTokens[resolvedSize];
  const resolvedDisabled = contextValue.disabled || disabled === true;

  const buttonStyle: CSSProperties = {
    height: tokens.buttonHeight,
    minHeight: tokens.buttonHeight,
    paddingInline: tokens.buttonPaddingInline,
    fontSize: tokens.fontSize,
    borderRadius: "var(--ktn-radius-sm, 0.375rem)",
    ...style,
  };

  return (
    <Button
      {...props}
      variant={resolvedVariant}
      size={tokens.buttonSize}
      disabled={resolvedDisabled}
      onAction={(event) => {
        onAction?.(event);
        contextValue.emitAction("button-action", { event });
      }}
      style={buttonStyle}
    >
      {children}
    </Button>
  );
}

export function InputGroupInput({
  size,
  disabled,
  required,
  onFocus,
  onBlur,
  onChange,
  style,
  ...props
}: InputGroupInputProps): JSX.Element {
  const contextValue = useInputGroupContextValue();
  const resolvedSize = size ?? contextValue.size;
  const tokens = sizeTokens[resolvedSize];
  const resolvedDisabled = contextValue.disabled || disabled === true;
  const resolvedRequired = contextValue.required || required === true;

  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    contextValue.onControlFocus(event);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>): void {
    contextValue.onControlBlur(event);
    onBlur?.(event);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange?.(event);

    if (!event.defaultPrevented) {
      contextValue.emitAction("control-change", {
        value: event.currentTarget.value,
        event,
      });
    }
  }

  const inputStyle: CSSProperties = {
    height: tokens.controlHeight,
    minHeight: tokens.controlHeight,
    fontSize: tokens.fontSize,
    paddingInline: tokens.controlPaddingInline,
    borderWidth: 0,
    borderStyle: "none",
    borderRadius: 0,
    boxShadow: "none",
    backgroundColor: "transparent",
    minWidth: 0,
    flex: 1,
    ...style,
  };

  return (
    <Input
      {...props}
      data-slot="input-group-control"
      size={resolvedSize}
      disabled={resolvedDisabled}
      required={resolvedRequired}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      style={inputStyle}
    />
  );
}

export function InputGroupTextarea({
  size,
  disabled,
  required,
  rows = 3,
  onFocus,
  onBlur,
  onChange,
  className = "",
  style,
  ...props
}: InputGroupTextareaProps): JSX.Element {
  const contextValue = useInputGroupContextValue();
  const resolvedSize = size ?? contextValue.size;
  const tokens = sizeTokens[resolvedSize];
  const resolvedDisabled = contextValue.disabled || disabled === true;
  const resolvedRequired = contextValue.required || required === true;

  function handleFocus(event: FocusEvent<HTMLTextAreaElement>): void {
    contextValue.onControlFocus(event);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLTextAreaElement>): void {
    contextValue.onControlBlur(event);
    onBlur?.(event);
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    onChange?.(event);

    if (!event.defaultPrevented) {
      contextValue.emitAction("control-change", {
        value: event.currentTarget.value,
        event,
      });
    }
  }

  const textareaStyle: CSSProperties = {
    width: "100%",
    minHeight: tokens.textareaMinHeight,
    borderWidth: 0,
    borderStyle: "none",
    borderRadius: 0,
    outline: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    color: "var(--ktn-text-primary)",
    paddingInline: tokens.controlPaddingInline,
    paddingBlock: "0.55rem",
    fontSize: tokens.fontSize,
    lineHeight: 1.4,
    ...(resolvedDisabled
      ? {
          cursor: "not-allowed",
          opacity: 0.72,
          resize: "none",
        }
      : {
          cursor: "text",
          resize: "vertical",
        }),
    ...style,
  };

  return (
    <textarea
      {...props}
      data-slot="input-group-control"
      className={`${baseGroupClasses} ${className}`.trim()}
      rows={rows}
      disabled={resolvedDisabled}
      required={resolvedRequired}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      style={textareaStyle}
    />
  );
}
