import {
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type MouseEvent,
} from 'react';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg';
export type InputActionSource = 'focus' | 'blur' | 'change' | 'click';

export interface InputActionContext {
  source: InputActionSource;
  value: string;
  inputType: string;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  event?: unknown;
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  invalid?: boolean;
  onAction?: (context: InputActionContext) => void;
}

type InputSizeTokens = {
  height: string;
  fontSize: string;
  paddingInline: string;
  borderRadius: string;
};

const sizeTokens: Record<InputSize, InputSizeTokens> = {
  xs: {
    height: '1.9rem',
    fontSize: '0.75rem',
    paddingInline: '0.55rem',
    borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
  },
  sm: {
    height: '2.1rem',
    fontSize: '0.8125rem',
    paddingInline: '0.6rem',
    borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
  },
  md: {
    height: '2.35rem',
    fontSize: '0.875rem',
    paddingInline: '0.625rem',
    borderRadius: 'var(--ktn-radius-md, 0.5rem)',
  },
  lg: {
    height: '2.6rem',
    fontSize: '0.9375rem',
    paddingInline: '0.7rem',
    borderRadius: 'var(--ktn-radius-md, 0.5rem)',
  },
};

const baseClasses = 'inline-flex w-full';

export function Input({
  size = 'md',
  type = 'text',
  disabled = false,
  required = false,
  invalid = false,
  className = '',
  style,
  onFocus,
  onBlur,
  onChange,
  onClick,
  onAction,
  ...props
}: InputProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const tokens = sizeTokens[size];

  function emitAction(source: InputActionSource, value: string, event?: unknown): void {
    onAction?.({
      source,
      value,
      inputType: type,
      disabled,
      required,
      invalid,
      event,
    });
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    setIsFocused(true);
    onFocus?.(event);

    if (!event.defaultPrevented) {
      emitAction('focus', event.currentTarget.value, event);
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>): void {
    setIsFocused(false);
    onBlur?.(event);

    if (!event.defaultPrevented) {
      emitAction('blur', event.currentTarget.value, event);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange?.(event);

    if (!event.defaultPrevented) {
      emitAction('change', event.currentTarget.value, event);
    }
  }

  function handleClick(event: MouseEvent<HTMLInputElement>): void {
    onClick?.(event);

    if (!event.defaultPrevented) {
      emitAction('click', event.currentTarget.value, event);
    }
  }

  const composedClassName = `${baseClasses} ${className}`.trim();

  const inputStyle: CSSProperties = {
    width: '100%',
    height: tokens.height,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: invalid ? 'var(--ktn-action-danger-bg, #dc2626)' : 'var(--ktn-border-muted)',
    borderRadius: tokens.borderRadius,
    color: 'var(--ktn-text-primary)',
    paddingInline: tokens.paddingInline,
    fontSize: tokens.fontSize,
    lineHeight: 1.2,
    outline: 'none',
    transition: 'border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease',
    boxShadow: isFocused
      ? invalid
        ? '0 0 0 2px rgba(220, 38, 38, 0.24)'
        : '0 0 0 2px rgba(37, 99, 235, 0.22)'
      : undefined,
    ...(disabled
      ? {
          opacity: 0.62,
          cursor: 'not-allowed',
          backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))',
        }
      : {
          cursor: 'text',
          backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
        }),
    ...style,
  };

  return (
    <input
      {...props}
      type={type}
      className={composedClassName}
      style={inputStyle}
      disabled={disabled}
      required={required}
      aria-invalid={invalid ? true : props['aria-invalid']}
      aria-required={required || undefined}
      aria-disabled={disabled || undefined}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      onClick={handleClick}
    />
  );
}
