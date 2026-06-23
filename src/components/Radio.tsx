import {
  useId,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

export type RadioOrientation = 'horizontal' | 'vertical';
export type RadioSize = 'xs' | 'sm' | 'md' | 'lg';
export type RadioAlign = 'inline-start' | 'inline-end';
export type RadioActionSource = 'value-change' | 'focus' | 'blur';

export interface RadioActionContext {
  source: RadioActionSource;
  value: string | null;
  previousValue?: string | null;
  optionValue?: string;
  name: string;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  event?: unknown;
}

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange'
> {
  options?: RadioOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  onAction?: (context: RadioActionContext) => void;
  name?: string;
  orientation?: RadioOrientation;
  size?: RadioSize;
  align?: RadioAlign;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  choiceCard?: boolean;
}

type RadioSizeTokens = {
  controlSize: string;
  indicatorSize: string;
  labelFontSize: string;
  descriptionFontSize: string;
  itemGap: string;
  cardPaddingInline: string;
  cardPaddingBlock: string;
};

const sizeTokens: Record<RadioSize, RadioSizeTokens> = {
  xs: {
    controlSize: '0.9rem',
    indicatorSize: '0.38rem',
    labelFontSize: '0.75rem',
    descriptionFontSize: '0.6875rem',
    itemGap: '0.45rem',
    cardPaddingInline: '0.55rem',
    cardPaddingBlock: '0.45rem',
  },
  sm: {
    controlSize: '0.98rem',
    indicatorSize: '0.42rem',
    labelFontSize: '0.8125rem',
    descriptionFontSize: '0.75rem',
    itemGap: '0.5rem',
    cardPaddingInline: '0.6rem',
    cardPaddingBlock: '0.5rem',
  },
  md: {
    controlSize: '1.08rem',
    indicatorSize: '0.46rem',
    labelFontSize: '0.875rem',
    descriptionFontSize: '0.8125rem',
    itemGap: '0.55rem',
    cardPaddingInline: '0.7rem',
    cardPaddingBlock: '0.58rem',
  },
  lg: {
    controlSize: '1.2rem',
    indicatorSize: '0.52rem',
    labelFontSize: '0.9375rem',
    descriptionFontSize: '0.875rem',
    itemGap: '0.6rem',
    cardPaddingInline: '0.8rem',
    cardPaddingBlock: '0.66rem',
  },
};

const baseClasses = 'inline-flex min-w-0 w-full';

const visuallyHiddenInputStyle: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function getResolvedValue(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  return trimmed === '' ? null : trimmed;
}

function hasControlAtEnd(align: RadioAlign): boolean {
  return align === 'inline-end';
}

export function Radio({
  options = [],
  value,
  defaultValue,
  onValueChange,
  onAction,
  name,
  orientation = 'vertical',
  size = 'md',
  align = 'inline-start',
  disabled = false,
  required = false,
  invalid = false,
  choiceCard = false,
  className = '',
  style,
  ...props
}: RadioProps): JSX.Element {
  const generatedId = useId();
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(() =>
    getResolvedValue(defaultValue),
  );

  const isControlled = value !== undefined;
  const resolvedValue = getResolvedValue(isControlled ? value : uncontrolledValue);
  const resolvedName = name ?? `radio-${generatedId}`;
  const tokens = sizeTokens[size];

  function updateValue(nextValue: string, event?: unknown): void {
    const previousValue = resolvedValue;

    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
    onAction?.({
      source: 'value-change',
      value: nextValue,
      previousValue,
      optionValue: nextValue,
      name: resolvedName,
      disabled,
      required,
      invalid,
      event,
    });
  }

  function handleOptionFocus(event: FocusEvent<HTMLInputElement>): void {
    setFocusedValue(event.currentTarget.value);
    onAction?.({
      source: 'focus',
      value: resolvedValue,
      optionValue: event.currentTarget.value,
      name: resolvedName,
      disabled,
      required,
      invalid,
      event,
    });
  }

  function handleOptionBlur(event: FocusEvent<HTMLInputElement>): void {
    setFocusedValue(null);
    onAction?.({
      source: 'blur',
      value: resolvedValue,
      optionValue: event.currentTarget.value,
      name: resolvedName,
      disabled,
      required,
      invalid,
      event,
    });
  }

  const rootStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    alignItems: orientation === 'vertical' ? 'stretch' : 'flex-start',
    gap: orientation === 'vertical' ? '0.55rem' : '0.75rem',
    flexWrap: orientation === 'horizontal' ? 'wrap' : undefined,
    ...style,
  };

  return (
    <div
      role="radiogroup"
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      aria-disabled={disabled || undefined}
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      {...props}
    >
      {options.map((option, index) => {
        const optionId = `${resolvedName}-${option.value}-${index}`;
        const optionDescriptionId =
          option.description != null
            ? `${resolvedName}-${option.value}-${index}-description`
            : undefined;
        const selected = resolvedValue === option.value;
        const optionDisabled = disabled || option.disabled === true;
        const optionFocused = focusedValue === option.value;
        const controlAtEnd = hasControlAtEnd(align);

        const controlStyle: CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          order: controlAtEnd ? 1 : 0,
          width: tokens.controlSize,
          height: tokens.controlSize,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: invalid
            ? 'var(--ktn-action-danger-bg, #dc2626)'
            : selected
              ? 'var(--ktn-action-primary-bg)'
              : 'var(--ktn-border-muted)',
          borderRadius: '999px',
          backgroundColor: selected
            ? invalid
              ? 'var(--ktn-action-danger-bg, #dc2626)'
              : 'var(--ktn-action-primary-bg)'
            : 'var(--ktn-bg-surface, #ffffff)',
          flexShrink: 0,
          marginTop: option.description != null ? '0.08rem' : 0,
          transition: 'border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease',
          boxShadow: optionFocused
            ? invalid
              ? '0 0 0 2px rgba(220, 38, 38, 0.24)'
              : '0 0 0 2px rgba(37, 99, 235, 0.22)'
            : undefined,
        };

        const itemStyle: CSSProperties = {
          position: 'relative',
          display: 'inline-flex',
          alignItems: option.description != null ? 'flex-start' : 'center',
          justifyContent:
            orientation === 'vertical' && align === 'inline-end' ? 'space-between' : 'flex-start',
          flexDirection: 'row',
          gap: tokens.itemGap,
          width: orientation === 'vertical' || choiceCard ? '100%' : undefined,
          minWidth: 0,
          cursor: optionDisabled ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          opacity: optionDisabled ? 0.62 : 1,
          ...(choiceCard
            ? {
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: invalid
                  ? 'var(--ktn-action-danger-bg, #dc2626)'
                  : selected
                    ? 'var(--ktn-action-primary-bg)'
                    : 'var(--ktn-border-muted)',
                borderRadius: 'var(--ktn-radius-md, 0.5rem)',
                backgroundColor: selected
                  ? 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.12))'
                  : 'var(--ktn-bg-surface, #ffffff)',
                paddingInline: tokens.cardPaddingInline,
                paddingBlock: tokens.cardPaddingBlock,
              }
            : {}),
        };

        const textWrapStyle: CSSProperties = {
          order: controlAtEnd ? 0 : 1,
          minWidth: 0,
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: '0.18rem',
          flex: 1,
        };

        const labelStyle: CSSProperties = {
          fontSize: tokens.labelFontSize,
          lineHeight: 1.3,
          color: invalid ? 'var(--ktn-action-danger-bg, #dc2626)' : 'var(--ktn-text-primary)',
        };

        const descriptionStyle: CSSProperties = {
          margin: 0,
          fontSize: tokens.descriptionFontSize,
          lineHeight: 1.35,
          color: invalid
            ? 'var(--ktn-action-danger-bg, #dc2626)'
            : 'var(--ktn-text-secondary, var(--ktn-text-primary))',
        };

        return (
          <label key={`${option.value}-${index}`} htmlFor={optionId} style={itemStyle}>
            <input
              id={optionId}
              type="radio"
              name={resolvedName}
              value={option.value}
              checked={selected}
              disabled={optionDisabled}
              required={required}
              aria-invalid={invalid ? true : undefined}
              aria-describedby={optionDescriptionId}
              style={visuallyHiddenInputStyle}
              onChange={(event) => {
                if (event.currentTarget.checked) {
                  updateValue(option.value, event);
                }
              }}
              onFocus={handleOptionFocus}
              onBlur={handleOptionBlur}
            />

            <span aria-hidden style={controlStyle}>
              {selected ? (
                <span
                  style={{
                    width: tokens.indicatorSize,
                    height: tokens.indicatorSize,
                    borderRadius: '999px',
                    backgroundColor: '#ffffff',
                    display: 'inline-flex',
                    flexShrink: 0,
                  }}
                />
              ) : null}
            </span>

            <span style={textWrapStyle}>
              <span style={labelStyle}>{option.label}</span>
              {option.description != null ? (
                <span id={optionDescriptionId} style={descriptionStyle}>
                  {option.description}
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
