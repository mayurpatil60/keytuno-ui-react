import {
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type TextareaHTMLAttributes,
} from 'react';

export type TextareaSize = 'xs' | 'sm' | 'md' | 'lg';
export type TextareaActionSource = 'change' | 'focus' | 'blur';

export interface TextareaActionContext {
  source: TextareaActionSource;
  value: string;
  size: TextareaSize;
  disabled: boolean;
  invalid: boolean;
  event?: unknown;
}

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: TextareaSize;
  invalid?: boolean;
  onAction?: (context: TextareaActionContext) => void;
}

type TextareaSizeTokens = {
  minHeight: string;
  fontSize: string;
  paddingInline: string;
  paddingBlock: string;
  borderRadius: string;
};

const sizeTokens: Record<TextareaSize, TextareaSizeTokens> = {
  xs: {
    minHeight: '4.5rem',
    fontSize: '0.75rem',
    paddingInline: '0.55rem',
    paddingBlock: '0.45rem',
    borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
  },
  sm: {
    minHeight: '5.25rem',
    fontSize: '0.8125rem',
    paddingInline: '0.6rem',
    paddingBlock: '0.5rem',
    borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
  },
  md: {
    minHeight: '6rem',
    fontSize: '0.875rem',
    paddingInline: '0.625rem',
    paddingBlock: '0.55rem',
    borderRadius: 'var(--ktn-radius-md, 0.5rem)',
  },
  lg: {
    minHeight: '6.75rem',
    fontSize: '0.9375rem',
    paddingInline: '0.7rem',
    paddingBlock: '0.6rem',
    borderRadius: 'var(--ktn-radius-md, 0.5rem)',
  },
};

const baseClasses = 'inline-flex w-full';

export function Textarea({
  size = 'md',
  disabled = false,
  invalid = false,
  rows = 4,
  className = '',
  style,
  onChange,
  onFocus,
  onBlur,
  onAction,
  ...props
}: TextareaProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const tokens = sizeTokens[size];

  function emitAction(source: TextareaActionSource, value: string, event: unknown): void {
    onAction?.({
      source,
      value,
      size,
      disabled,
      invalid,
      event,
    });
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    onChange?.(event);

    if (!event.defaultPrevented) {
      emitAction('change', event.currentTarget.value, event);
    }
  }

  function handleFocus(event: FocusEvent<HTMLTextAreaElement>): void {
    setIsFocused(true);
    onFocus?.(event);

    if (!event.defaultPrevented) {
      emitAction('focus', event.currentTarget.value, event);
    }
  }

  function handleBlur(event: FocusEvent<HTMLTextAreaElement>): void {
    setIsFocused(false);
    onBlur?.(event);

    if (!event.defaultPrevented) {
      emitAction('blur', event.currentTarget.value, event);
    }
  }

  const textareaStyle: CSSProperties = {
    width: '100%',
    minHeight: tokens.minHeight,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: invalid ? 'var(--ktn-action-danger-bg, #dc2626)' : 'var(--ktn-border-muted)',
    borderRadius: tokens.borderRadius,
    color: 'var(--ktn-text-primary)',
    paddingInline: tokens.paddingInline,
    paddingBlock: tokens.paddingBlock,
    fontSize: tokens.fontSize,
    lineHeight: 1.4,
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
          resize: 'none',
          backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))',
        }
      : {
          cursor: 'text',
          resize: 'vertical',
          backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
        }),
    ...style,
  };

  return (
    <textarea
      {...props}
      className={`${baseClasses} ${className}`.trim()}
      style={textareaStyle}
      rows={rows}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-invalid={invalid ? true : props['aria-invalid']}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
