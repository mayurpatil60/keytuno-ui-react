import {
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export type CheckboxSize = "xs" | "sm" | "md" | "lg";

export interface CheckboxActionContext {
  checked: boolean;
  required: boolean;
  event: ChangeEvent<HTMLInputElement>;
}

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  size?: CheckboxSize;
  invalid?: boolean;
  description?: ReactNode;
  children?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  onAction?: (context: CheckboxActionContext) => void;
}

type CheckboxSizeTokens = {
  controlSize: string;
  iconSize: string;
  labelFontSize: string;
  descriptionFontSize: string;
  gap: string;
};

const sizeTokens: Record<CheckboxSize, CheckboxSizeTokens> = {
  xs: {
    controlSize: "0.85rem",
    iconSize: "0.6rem",
    labelFontSize: "0.75rem",
    descriptionFontSize: "0.6875rem",
    gap: "0.4rem",
  },
  sm: {
    controlSize: "0.95rem",
    iconSize: "0.68rem",
    labelFontSize: "0.8125rem",
    descriptionFontSize: "0.75rem",
    gap: "0.45rem",
  },
  md: {
    controlSize: "1.05rem",
    iconSize: "0.72rem",
    labelFontSize: "0.875rem",
    descriptionFontSize: "0.8125rem",
    gap: "0.5rem",
  },
  lg: {
    controlSize: "1.2rem",
    iconSize: "0.82rem",
    labelFontSize: "0.9375rem",
    descriptionFontSize: "0.875rem",
    gap: "0.55rem",
  },
};

const baseClasses = "inline-flex items-start select-none";

const visuallyHiddenInputStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const visuallyHiddenTextStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

function mergeAriaIds(...ids: Array<string | undefined>): string | undefined {
  const normalizedIds = ids
    .filter((id): id is string => typeof id === "string" && id.trim() !== "")
    .join(" ")
    .trim();

  return normalizedIds === "" ? undefined : normalizedIds;
}

export function Checkbox({
  size = "md",
  invalid = false,
  description,
  children,
  required = false,
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  onFocus,
  onBlur,
  onCheckedChange,
  onAction,
  className = "",
  style,
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  ...props
}: CheckboxProps): JSX.Element {
  const descriptionId = useId();
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    defaultChecked === true,
  );
  const [isFocused, setIsFocused] = useState(false);

  const tokens = sizeTokens[size];
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked === true : uncontrolledChecked;
  const isDisabled = disabled === true;
  const hasDescription = description != null;
  const resolvedAriaDescribedBy = hasDescription
    ? mergeAriaIds(ariaDescribedBy, descriptionId)
    : ariaDescribedBy;
  const hasLabelContent = children != null || hasDescription;
  const resolvedAriaLabel =
    ariaLabel ?? (!hasLabelContent ? "Checkbox" : undefined);

  const composedClassName = `${baseClasses} ${className}`.trim();

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextValue = event.currentTarget.checked;

    if (!isControlled) {
      setUncontrolledChecked(nextValue);
    }

    onCheckedChange?.(nextValue);
    onAction?.({
      checked: nextValue,
      required,
      event,
    });
    onChange?.(event);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    setIsFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>): void {
    setIsFocused(false);
    onBlur?.(event);
  }

  const rootStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: description != null ? "flex-start" : "center",
    gap: tokens.gap,
    cursor: isDisabled ? "not-allowed" : "pointer",
    userSelect: "none",
    opacity: isDisabled ? 0.62 : 1,
    ...style,
  };

  const controlBorderColor = invalid
    ? "var(--ktn-action-danger-bg, #dc2626)"
    : isChecked
      ? "var(--ktn-action-primary-bg)"
      : "var(--ktn-border-muted)";

  const controlBackgroundColor = isChecked
    ? invalid
      ? "var(--ktn-action-danger-bg, #dc2626)"
      : "var(--ktn-action-primary-bg)"
    : "var(--ktn-bg-surface, #ffffff)";

  const controlStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: tokens.controlSize,
    height: tokens.controlSize,
    marginTop: description != null ? "0.1rem" : 0,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: controlBorderColor,
    borderRadius: "0.25rem",
    backgroundColor: controlBackgroundColor,
    color: "#ffffff",
    flexShrink: 0,
    transition:
      "background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
    boxShadow: isFocused
      ? invalid
        ? "0 0 0 2px rgba(220, 38, 38, 0.24)"
        : "0 0 0 2px rgba(37, 99, 235, 0.24)"
      : undefined,
  };

  const textWrapStyle: CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    gap: "0.2rem",
    minWidth: 0,
  };

  const labelTextStyle: CSSProperties = {
    fontSize: tokens.labelFontSize,
    lineHeight: 1.3,
    color: "var(--ktn-text-primary)",
  };

  const requiredMarkerStyle: CSSProperties = {
    color: "var(--ktn-action-danger-bg, #dc2626)",
    marginInlineStart: "0.22rem",
    fontSize: "0.95em",
    lineHeight: 1,
  };

  const descriptionStyle: CSSProperties = {
    margin: 0,
    fontSize: tokens.descriptionFontSize,
    lineHeight: 1.35,
    color: invalid
      ? "var(--ktn-action-danger-bg, #dc2626)"
      : "var(--ktn-text-secondary, var(--ktn-text-primary))",
  };

  return (
    <label className={composedClassName} style={rootStyle}>
      <input
        {...props}
        type="checkbox"
        disabled={isDisabled}
        checked={isControlled ? isChecked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        required={required}
        aria-invalid={invalid ? true : props["aria-invalid"]}
        aria-required={required || undefined}
        aria-label={resolvedAriaLabel}
        aria-describedby={resolvedAriaDescribedBy}
        style={visuallyHiddenInputStyle}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      <span aria-hidden style={controlStyle}>
        {isChecked ? (
          <svg
            width={tokens.iconSize}
            height={tokens.iconSize}
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3.5 8.2l2.8 2.8 6.2-6.2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>

      {children != null || description != null ? (
        <span style={textWrapStyle}>
          {children != null ? (
            <span style={labelTextStyle}>
              {children}
              {required ? (
                <>
                  <span aria-hidden style={requiredMarkerStyle}>
                    *
                  </span>
                  <span style={visuallyHiddenTextStyle}>required</span>
                </>
              ) : null}
            </span>
          ) : null}
          {description != null ? (
            <span id={descriptionId} style={descriptionStyle}>
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
