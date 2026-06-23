import { type CSSProperties, type FocusEvent, type HTMLAttributes, type MouseEvent } from 'react';

export type SeparatorSize = 'xs' | 'sm' | 'md' | 'lg';
export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorActionSource = 'click' | 'focus' | 'blur';

export interface SeparatorActionContext {
  source: SeparatorActionSource;
  orientation: SeparatorOrientation;
  size: SeparatorSize;
  decorative: boolean;
  event?: unknown;
}

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  size?: SeparatorSize;
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  onAction?: (context: SeparatorActionContext) => void;
}

type SeparatorSizeTokens = {
  thickness: string;
  minLength: string;
};

const sizeTokens: Record<SeparatorSize, SeparatorSizeTokens> = {
  xs: {
    thickness: '1px',
    minLength: '0.9rem',
  },
  sm: {
    thickness: '1.5px',
    minLength: '1.1rem',
  },
  md: {
    thickness: '2px',
    minLength: '1.35rem',
  },
  lg: {
    thickness: '3px',
    minLength: '1.7rem',
  },
};

const baseClasses = 'shrink-0';

export function Separator({
  size = 'md',
  orientation = 'horizontal',
  decorative = true,
  onAction,
  className = '',
  style,
  onClick,
  onFocus,
  onBlur,
  ...props
}: SeparatorProps): JSX.Element {
  const tokens = sizeTokens[size];

  const separatorStyle: CSSProperties = {
    borderRadius: '999px',
    backgroundColor: 'var(--ktn-border-muted)',
    flexShrink: 0,
    ...(orientation === 'vertical'
      ? {
          width: tokens.thickness,
          minWidth: tokens.thickness,
          height: '100%',
          minHeight: tokens.minLength,
          alignSelf: 'stretch',
        }
      : {
          width: '100%',
          height: tokens.thickness,
          minHeight: tokens.thickness,
        }),
    ...style,
  };

  function emitAction(source: SeparatorActionSource, event: unknown): void {
    onAction?.({
      source,
      orientation,
      size,
      decorative,
      event,
    });
  }

  function handleClick(event: MouseEvent<HTMLDivElement>): void {
    onClick?.(event);

    if (!event.defaultPrevented) {
      emitAction('click', event);
    }
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>): void {
    onFocus?.(event);

    if (!event.defaultPrevented) {
      emitAction('focus', event);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    onBlur?.(event);

    if (!event.defaultPrevented) {
      emitAction('blur', event);
    }
  }

  return (
    <div
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      aria-hidden={decorative ? true : undefined}
      className={`${baseClasses} ${className}`.trim()}
      style={separatorStyle}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}

export type SeperatorSize = SeparatorSize;
export type SeperatorOrientation = SeparatorOrientation;
export type SeperatorProps = SeparatorProps;
export type SeperatorActionSource = SeparatorActionSource;
export type SeperatorActionContext = SeparatorActionContext;

export const Seperator = Separator;
