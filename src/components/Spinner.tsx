import { type CSSProperties, type FocusEvent, type HTMLAttributes, type MouseEvent } from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerActionSource = 'click' | 'focus' | 'blur';

export interface SpinnerActionContext {
  source: SpinnerActionSource;
  size: SpinnerSize;
  decorative: boolean;
  event?: unknown;
}

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: SpinnerSize;
  decorative?: boolean;
  onAction?: (context: SpinnerActionContext) => void;
}

const pixelBySize: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

const strokeBySize: Record<SpinnerSize, number> = {
  xs: 2,
  sm: 2,
  md: 2.25,
  lg: 2.5,
};

const wrapperStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
};

export function Spinner({
  size = 'md',
  decorative = false,
  onAction,
  className = '',
  style,
  onClick,
  onFocus,
  onBlur,
  role,
  ['aria-label']: ariaLabel,
  ['aria-live']: ariaLive,
  ...props
}: SpinnerProps): JSX.Element {
  const pixel = pixelBySize[size];
  const stroke = strokeBySize[size];
  const radius = (pixel - stroke) / 2;
  const center = pixel / 2;

  function emitAction(source: SpinnerActionSource, event: unknown): void {
    onAction?.({
      source,
      size,
      decorative,
      event,
    });
  }

  function handleClick(event: MouseEvent<HTMLSpanElement>): void {
    onClick?.(event);

    if (!event.defaultPrevented) {
      emitAction('click', event);
    }
  }

  function handleFocus(event: FocusEvent<HTMLSpanElement>): void {
    onFocus?.(event);

    if (!event.defaultPrevented) {
      emitAction('focus', event);
    }
  }

  function handleBlur(event: FocusEvent<HTMLSpanElement>): void {
    onBlur?.(event);

    if (!event.defaultPrevented) {
      emitAction('blur', event);
    }
  }

  const resolvedRole = decorative ? undefined : (role ?? 'status');
  const resolvedAriaLabel = decorative ? undefined : (ariaLabel ?? 'Loading');
  const resolvedAriaLive = decorative ? undefined : (ariaLive ?? 'polite');

  const composedStyle: CSSProperties = {
    ...wrapperStyle,
    ...style,
  };

  return (
    <span
      aria-hidden={decorative ? true : undefined}
      role={resolvedRole}
      aria-label={resolvedAriaLabel}
      aria-live={resolvedAriaLive}
      className={className.trim() === '' ? undefined : className}
      style={composedStyle}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      <svg width={pixel} height={pixel} viewBox={`0 0 ${pixel} ${pixel}`} aria-hidden>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          opacity="0.2"
        />
        <path
          d={`M ${center} ${stroke / 2} A ${radius} ${radius} 0 0 1 ${pixel - stroke / 2} ${center}`}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${center} ${center}`}
            to={`360 ${center} ${center}`}
            dur="0.8s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </span>
  );
}
