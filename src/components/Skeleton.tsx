import {
  useEffect,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
} from 'react';

export type SkeletonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type SkeletonActionSource = 'click' | 'focus' | 'blur';

export interface SkeletonActionContext {
  source: SkeletonActionSource;
  animated: boolean;
  radius: SkeletonRadius;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  decorative: boolean;
  event?: unknown;
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  radius?: SkeletonRadius;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  decorative?: boolean;
  onAction?: (context: SkeletonActionContext) => void;
}

const SHIMMER_STYLE_ID = 'ktn-skeleton-shimmer-style';
const SHIMMER_KEYFRAME_NAME = 'ktn-skeleton-shimmer';

let shimmerStyleReady = false;

const radiusTokens: Record<SkeletonRadius, string> = {
  none: '0',
  sm: 'var(--ktn-radius-sm, 0.375rem)',
  md: 'var(--ktn-radius-md, 0.5rem)',
  lg: 'var(--ktn-radius-lg, 0.625rem)',
  full: '999px',
};

function ensureShimmerStyles(): void {
  if (shimmerStyleReady) {
    return;
  }

  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById(SHIMMER_STYLE_ID) != null) {
    shimmerStyleReady = true;
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = SHIMMER_STYLE_ID;
  styleElement.textContent = `
@keyframes ${SHIMMER_KEYFRAME_NAME} {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

  document.head.appendChild(styleElement);
  shimmerStyleReady = true;
}

export function Skeleton({
  animated = true,
  radius = 'md',
  width = '100%',
  height = '1rem',
  decorative = true,
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
}: SkeletonProps): JSX.Element {
  useEffect(() => {
    if (animated) {
      ensureShimmerStyles();
    }
  }, [animated]);

  const skeletonStyle: CSSProperties = {
    width,
    height,
    borderRadius: radiusTokens[radius],
    backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.12))',
    backgroundImage: animated
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)'
      : undefined,
    backgroundSize: animated ? '200% 100%' : undefined,
    animation: animated ? `${SHIMMER_KEYFRAME_NAME} 1.25s linear infinite` : undefined,
    display: 'inline-flex',
    flexShrink: 0,
    ...style,
  };

  function emitAction(source: SkeletonActionSource, event: unknown): void {
    onAction?.({
      source,
      animated,
      radius,
      width,
      height,
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

  const resolvedAriaHidden = decorative ? true : undefined;
  const resolvedRole = decorative ? undefined : (role ?? 'status');
  const resolvedAriaLive = decorative ? undefined : (ariaLive ?? 'polite');
  const resolvedAriaLabel = decorative ? undefined : (ariaLabel ?? 'Loading');

  return (
    <div
      aria-hidden={props['aria-hidden'] ?? resolvedAriaHidden}
      role={resolvedRole}
      aria-live={resolvedAriaLive}
      aria-label={resolvedAriaLabel}
      className={className.trim() === '' ? undefined : className}
      style={skeletonStyle}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}
