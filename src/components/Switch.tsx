import {
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export type SwitchOrientation = 'horizontal' | 'vertical';
export type SwitchSize = 'xs' | 'sm' | 'md' | 'lg';
export type SwitchActionSource = 'checked-change' | 'focus' | 'blur';

export interface SwitchActionContext {
  source: SwitchActionSource;
  checked: boolean;
  previousChecked?: boolean;
  orientation: SwitchOrientation;
  size: SwitchSize;
  disabled: boolean;
  invalid: boolean;
  event?: unknown;
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  orientation?: SwitchOrientation;
  size?: SwitchSize;
  invalid?: boolean;
  description?: ReactNode;
  children?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  onAction?: (context: SwitchActionContext) => void;
}

type SwitchSizeTokens = {
  trackWidth: string;
  trackHeight: string;
  thumbSize: string;
  thumbTranslate: string;
  labelFontSize: string;
  descriptionFontSize: string;
  gap: string;
};

const sizeTokens: Record<SwitchSize, SwitchSizeTokens> = {
  xs: {
    trackWidth: '1.6rem',
    trackHeight: '0.9rem',
    thumbSize: '0.7rem',
    thumbTranslate: '0.65rem',
    labelFontSize: '0.75rem',
    descriptionFontSize: '0.6875rem',
    gap: '0.4rem',
  },
  sm: {
    trackWidth: '1.85rem',
    trackHeight: '1.02rem',
    thumbSize: '0.8rem',
    thumbTranslate: '0.8rem',
    labelFontSize: '0.8125rem',
    descriptionFontSize: '0.75rem',
    gap: '0.45rem',
  },
  md: {
    trackWidth: '2.1rem',
    trackHeight: '1.15rem',
    thumbSize: '0.9rem',
    thumbTranslate: '0.95rem',
    labelFontSize: '0.875rem',
    descriptionFontSize: '0.8125rem',
    gap: '0.5rem',
  },
  lg: {
    trackWidth: '2.35rem',
    trackHeight: '1.3rem',
    thumbSize: '1.05rem',
    thumbTranslate: '1.05rem',
    labelFontSize: '0.9375rem',
    descriptionFontSize: '0.875rem',
    gap: '0.55rem',
  },
};

const baseClasses = 'inline-flex min-w-0';

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

export function Switch({
  orientation = 'horizontal',
  size = 'md',
  invalid = false,
  description,
  children,
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  onFocus,
  onBlur,
  onCheckedChange,
  onAction,
  className = '',
  style,
  ['aria-describedby']: ariaDescribedBy,
  ...props
}: SwitchProps): JSX.Element {
  const generatedId = useId();
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked === true);
  const [isFocused, setIsFocused] = useState(false);

  const tokens = sizeTokens[size];
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked === true : uncontrolledChecked;
  const isDisabled = disabled === true;
  const descriptionId = description != null ? `${generatedId}-description` : undefined;
  const resolvedAriaDescribedBy =
    descriptionId == null
      ? ariaDescribedBy
      : ariaDescribedBy == null || ariaDescribedBy.trim() === ''
        ? descriptionId
        : `${ariaDescribedBy} ${descriptionId}`;

  function emitAction(
    source: SwitchActionSource,
    options?: {
      checked?: boolean;
      previousChecked?: boolean;
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      checked: options?.checked ?? isChecked,
      previousChecked: options?.previousChecked,
      orientation,
      size,
      disabled: isDisabled,
      invalid,
      event: options?.event,
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextValue = event.currentTarget.checked;
    const previousChecked = isChecked;

    if (!isControlled) {
      setUncontrolledChecked(nextValue);
    }

    onCheckedChange?.(nextValue);
    onChange?.(event);

    if (!event.defaultPrevented) {
      emitAction('checked-change', {
        checked: nextValue,
        previousChecked,
        event,
      });
    }
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    setIsFocused(true);
    onFocus?.(event);

    if (!event.defaultPrevented) {
      emitAction('focus', {
        event,
      });
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>): void {
    setIsFocused(false);
    onBlur?.(event);

    if (!event.defaultPrevented) {
      emitAction('blur', {
        event,
      });
    }
  }

  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    alignItems:
      orientation === 'vertical' ? 'flex-start' : description != null ? 'flex-start' : 'center',
    gap: tokens.gap,
    width: orientation === 'vertical' ? 'fit-content' : undefined,
    minWidth: 0,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    opacity: isDisabled ? 0.62 : 1,
    ...style,
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: tokens.trackWidth,
    height: tokens.trackHeight,
    padding: '2px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: invalid
      ? 'var(--ktn-action-danger-bg, #dc2626)'
      : isChecked
        ? 'var(--ktn-action-primary-bg)'
        : 'var(--ktn-border-muted)',
    borderRadius: '999px',
    backgroundColor: isChecked
      ? invalid
        ? 'var(--ktn-action-danger-bg, #dc2626)'
        : 'var(--ktn-action-primary-bg)'
      : 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.1))',
    boxSizing: 'border-box',
    transition: 'background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
    boxShadow: isFocused
      ? invalid
        ? '0 0 0 2px rgba(220, 38, 38, 0.24)'
        : '0 0 0 2px rgba(37, 99, 235, 0.22)'
      : undefined,
    flexShrink: 0,
  };

  const thumbStyle: CSSProperties = {
    width: tokens.thumbSize,
    height: tokens.thumbSize,
    borderRadius: '999px',
    backgroundColor: '#ffffff',
    display: 'inline-flex',
    flexShrink: 0,
    transform: isChecked ? `translateX(${tokens.thumbTranslate})` : 'translateX(0)',
    transition: 'transform 150ms ease',
    boxShadow: '0 1px 2px rgba(2, 6, 23, 0.24)',
  };

  const textWrapStyle: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '0.2rem',
    minWidth: 0,
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
    <label className={`${baseClasses} ${className}`.trim()} style={rootStyle}>
      <input
        {...props}
        type="checkbox"
        role="switch"
        disabled={isDisabled}
        checked={isControlled ? isChecked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        aria-checked={isChecked}
        aria-disabled={isDisabled || undefined}
        aria-invalid={invalid ? true : props['aria-invalid']}
        aria-describedby={resolvedAriaDescribedBy}
        style={visuallyHiddenInputStyle}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      <span aria-hidden style={trackStyle}>
        <span style={thumbStyle} />
      </span>

      {children != null || description != null ? (
        <span style={textWrapStyle}>
          {children != null ? <span style={labelStyle}>{children}</span> : null}
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
