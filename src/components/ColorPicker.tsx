import {
  useEffect,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { Button } from "./Button";
import { Input } from "./Input";

export type ColorPickerSize = "xs" | "sm" | "md" | "lg";
export type ColorPickerVariant = "compact" | "detailed";
export type ColorPickerActionSource =
  | "picker-change"
  | "hex-input"
  | "swatch-select"
  | "clear"
  | "focus"
  | "blur";

export interface ColorPickerActionContext {
  source: ColorPickerActionSource;
  value: string | null;
  previousValue?: string | null;
  variant: ColorPickerVariant;
  size: ColorPickerSize;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  swatch?: string;
  event?: unknown;
}

export interface ColorPickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
> {
  size?: ColorPickerSize;
  variant?: ColorPickerVariant;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  showClear?: boolean;
  showSwatches?: boolean;
  placeholder?: string;
  colorInputAriaLabel?: string;
  hexInputAriaLabel?: string;
  emptyValueLabel?: ReactNode;
  clearButtonLabel?: ReactNode;
  clearButtonAriaLabel?: string;
  chooseColorAriaFormatter?: (hexColor: string) => string;
  swatches?: string[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  onAction?: (context: ColorPickerActionContext) => void;
}

type ColorPickerSizeTokens = {
  pickerSize: string;
  swatchSize: string;
  gap: string;
  textFontSize: string;
  clearButtonSize: "xs" | "sm" | "md" | "lg";
};

const sizeTokens: Record<ColorPickerSize, ColorPickerSizeTokens> = {
  xs: {
    pickerSize: "1.9rem",
    swatchSize: "1.2rem",
    gap: "0.4rem",
    textFontSize: "0.75rem",
    clearButtonSize: "xs",
  },
  sm: {
    pickerSize: "2.1rem",
    swatchSize: "1.35rem",
    gap: "0.45rem",
    textFontSize: "0.8125rem",
    clearButtonSize: "xs",
  },
  md: {
    pickerSize: "2.35rem",
    swatchSize: "1.5rem",
    gap: "0.5rem",
    textFontSize: "0.875rem",
    clearButtonSize: "sm",
  },
  lg: {
    pickerSize: "2.6rem",
    swatchSize: "1.7rem",
    gap: "0.55rem",
    textFontSize: "0.9375rem",
    clearButtonSize: "sm",
  },
};

const baseClasses = "inline-flex w-full";

const DEFAULT_SWATCHES = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#111827",
  "#ffffff",
];

function normalizeHexValue(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().toLowerCase();

  if (trimmed === "") {
    return null;
  }

  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  if (/^#[\da-f]{3}$/i.test(prefixed)) {
    const r = prefixed[1];
    const g = prefixed[2];
    const b = prefixed[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  if (/^#[\da-f]{6}$/i.test(prefixed)) {
    return prefixed;
  }

  return null;
}

function isCompleteHexValue(value: string): boolean {
  const trimmed = value.trim().toLowerCase();

  if (trimmed === "") {
    return false;
  }

  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  return /^#[\da-f]{6}$/i.test(prefixed);
}

function normalizeSwatches(values: string[]): string[] {
  const unique = new Set<string>();

  values.forEach((value) => {
    const normalized = normalizeHexValue(value);

    if (normalized != null) {
      unique.add(normalized);
    }
  });

  return Array.from(unique);
}

function toDisplayHex(value: string | null): string {
  return value == null ? "" : value.toUpperCase();
}

export function ColorPicker({
  size = "md",
  variant,
  disabled = false,
  required = false,
  invalid = false,
  showClear = true,
  showSwatches = true,
  placeholder = "#2563EB",
  colorInputAriaLabel = "Color value",
  hexInputAriaLabel = "Hex color value",
  emptyValueLabel = "No color selected",
  clearButtonLabel = "Clear",
  clearButtonAriaLabel = "Clear color",
  chooseColorAriaFormatter = (hexColor) =>
    `Choose color ${hexColor.toUpperCase()}`,
  swatches = DEFAULT_SWATCHES,
  value,
  defaultValue,
  onValueChange,
  onAction,
  className = "",
  style,
  role,
  id,
  ["aria-label"]: ariaLabel,
  ["aria-labelledby"]: ariaLabelledBy,
  ["aria-describedby"]: ariaDescribedBy,
  ...props
}: ColorPickerProps): JSX.Element {
  const resolvedVariant = variant ?? "detailed";
  const tokens = sizeTokens[size];
  const normalizedSwatches = useMemo(
    () => normalizeSwatches(swatches),
    [swatches],
  );
  const fallbackColor = normalizedSwatches[0] ?? "#2563eb";
  const generatedId = useId();
  const generatedInputId = id == null ? `${generatedId}-input` : `${id}-input`;
  const isControlled = value !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
    () => normalizeHexValue(defaultValue),
  );

  const resolvedValue = normalizeHexValue(
    isControlled ? value : uncontrolledValue,
  );

  const [hexDraft, setHexDraft] = useState<string>(() =>
    toDisplayHex(resolvedValue),
  );

  useEffect(() => {
    setHexDraft(toDisplayHex(resolvedValue));
  }, [resolvedValue]);

  function emitAction(
    source: ColorPickerActionSource,
    options?: {
      value?: string | null;
      previousValue?: string | null;
      swatch?: string;
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      value: options?.value ?? resolvedValue,
      previousValue: options?.previousValue,
      variant: resolvedVariant,
      size,
      disabled,
      required,
      invalid,
      swatch: options?.swatch,
      event: options?.event,
    });
  }

  function setValue(
    nextValue: string | null,
    source: Extract<
      ColorPickerActionSource,
      "picker-change" | "hex-input" | "swatch-select" | "clear"
    >,
    event?: unknown,
    swatch?: string,
  ): void {
    const normalizedValue = normalizeHexValue(nextValue);
    const previousValue = resolvedValue;

    if (!isControlled) {
      setUncontrolledValue(normalizedValue);
    }

    onValueChange?.(normalizedValue);
    emitAction(source, {
      value: normalizedValue,
      previousValue,
      swatch,
      event,
    });
  }

  function handlePickerChange(event: ChangeEvent<HTMLInputElement>): void {
    setValue(event.currentTarget.value, "picker-change", event);
  }

  function handleHexInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextDraft = event.currentTarget.value;
    setHexDraft(nextDraft);

    if (nextDraft.trim() === "") {
      if (!required) {
        setValue(null, "hex-input", event);
      }

      return;
    }

    const normalized = normalizeHexValue(nextDraft);

    if (normalized != null && isCompleteHexValue(nextDraft)) {
      setValue(normalized, "hex-input", event);
    }
  }

  function handleFocus(event: FocusEvent<HTMLElement>): void {
    emitAction("focus", {
      event,
    });
  }

  function handleBlur(event: FocusEvent<HTMLElement>): void {
    const normalized = normalizeHexValue(hexDraft);

    if (normalized == null) {
      setHexDraft(toDisplayHex(resolvedValue));
    } else {
      if (normalized !== resolvedValue) {
        setValue(normalized, "hex-input", event);
      }

      setHexDraft(normalized.toUpperCase());
    }

    emitAction("blur", {
      event,
    });
  }

  const colorInputValue = resolvedValue ?? fallbackColor;
  const shouldShowSwatches = showSwatches && normalizedSwatches.length > 0;
  const showClearButton =
    showClear &&
    !disabled &&
    (resolvedValue != null ||
      (resolvedVariant === "detailed" && hexDraft.trim() !== ""));

  const rootStyle: CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: tokens.gap,
    opacity: disabled ? 0.72 : 1,
    ...style,
  };

  const rowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: tokens.gap,
    width: "100%",
    minWidth: 0,
  };

  const colorInputStyle: CSSProperties = {
    width: tokens.pickerSize,
    height: tokens.pickerSize,
    padding: 0,
    borderRadius: "var(--ktn-radius-sm, 0.375rem)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: invalid
      ? "var(--ktn-action-danger-bg, #dc2626)"
      : "var(--ktn-border-muted)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    overflow: "hidden",
    cursor: disabled ? "not-allowed" : "pointer",
  };

  const compactValueStyle: CSSProperties = {
    minWidth: 0,
    fontSize: tokens.textFontSize,
    color: "var(--ktn-text-primary)",
    lineHeight: 1.2,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  };

  const swatchRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.35rem",
    width: "100%",
  };

  return (
    <div
      {...props}
      id={id}
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      role={role ?? "group"}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || undefined}
      aria-invalid={invalid || undefined}
      aria-required={required || undefined}
    >
      <div style={rowStyle}>
        <input
          id={generatedInputId}
          type="color"
          value={colorInputValue}
          disabled={disabled}
          required={required}
          aria-label={
            ariaLabel ??
            (ariaLabelledBy == null ? colorInputAriaLabel : undefined)
          }
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={invalid || undefined}
          onChange={handlePickerChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={colorInputStyle}
        />

        {resolvedVariant === "detailed" ? (
          <Input
            size={size}
            type="text"
            value={hexDraft}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            invalid={invalid}
            inputMode="text"
            spellCheck={false}
            autoComplete="off"
            aria-label={ariaLabelledBy == null ? hexInputAriaLabel : undefined}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            onChange={handleHexInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              flex: 1,
              minWidth: 0,
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
          />
        ) : (
          <span style={compactValueStyle}>
            {resolvedValue == null
              ? emptyValueLabel
              : resolvedValue.toUpperCase()}
          </span>
        )}

        {showClearButton ? (
          <Button
            variant="ghost"
            size={tokens.clearButtonSize}
            onAction={(event) => {
              setHexDraft("");
              setValue(null, "clear", event);
            }}
            disabled={disabled}
            aria-label={clearButtonAriaLabel}
          >
            {clearButtonLabel}
          </Button>
        ) : null}
      </div>

      {shouldShowSwatches ? (
        <div style={swatchRowStyle}>
          {normalizedSwatches.map((swatch) => {
            const selected = resolvedValue === swatch;

            return (
              <Button
                key={swatch}
                variant="ghost"
                size="xs"
                iconOnly
                disabled={disabled}
                onAction={(event) => {
                  setValue(swatch, "swatch-select", event, swatch);
                }}
                aria-label={chooseColorAriaFormatter(swatch)}
                aria-pressed={selected}
                style={{
                  width: tokens.swatchSize,
                  height: tokens.swatchSize,
                  minWidth: tokens.swatchSize,
                  borderRadius: "999px",
                  borderWidth: selected ? "2px" : "1px",
                  borderStyle: "solid",
                  borderColor: selected
                    ? "var(--ktn-action-primary-bg)"
                    : "var(--ktn-border-muted)",
                  backgroundColor: swatch,
                  boxShadow:
                    swatch === "#ffffff"
                      ? "inset 0 0 0 1px var(--ktn-border-muted)"
                      : undefined,
                  paddingInline: 0,
                }}
              >
                {selected ? (
                  <span
                    aria-hidden
                    style={{
                      display: "inline-block",
                      width: "0.42rem",
                      height: "0.42rem",
                      borderRadius: "999px",
                      backgroundColor:
                        swatch === "#ffffff"
                          ? "var(--ktn-text-primary)"
                          : "color-mix(in srgb, #ffffff 88%, transparent)",
                    }}
                  />
                ) : null}
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
