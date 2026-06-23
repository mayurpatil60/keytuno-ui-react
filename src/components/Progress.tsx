import {
  createContext,
  useEffect,
  useContext,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';
export type ProgressActionSource = 'value-change';

export interface ProgressActionContext {
  source: ProgressActionSource;
  value: number;
  min: number;
  max: number;
  percentage: number;
  previousValue?: number;
}

export interface ProgressProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue'
> {
  value?: number;
  min?: number;
  max?: number;
  size?: ProgressSize;
  children?: ReactNode;
  formatAriaValue?: (value: number, percentage: number) => string;
  onAction?: (context: ProgressActionContext) => void;
}

export interface ProgressLabelProps extends HTMLAttributes<HTMLSpanElement> {}

export interface ProgressValueProps extends HTMLAttributes<HTMLSpanElement> {
  formatter?: (value: number, percentage: number) => ReactNode;
}

interface ProgressSizeTokens {
  trackHeight: string;
  labelFontSize: string;
}

interface ProgressContextValue {
  value: number;
  percentage: number;
  size: ProgressSize;
}

const sizeTokens: Record<ProgressSize, ProgressSizeTokens> = {
  xs: {
    trackHeight: '0.34rem',
    labelFontSize: '0.72rem',
  },
  sm: {
    trackHeight: '0.42rem',
    labelFontSize: '0.76rem',
  },
  md: {
    trackHeight: '0.52rem',
    labelFontSize: '0.8rem',
  },
  lg: {
    trackHeight: '0.62rem',
    labelFontSize: '0.84rem',
  },
};

const baseClasses = 'inline-flex min-w-0';

const ProgressContext = createContext<ProgressContextValue | null>(null);

function toFiniteNumber(value: number | undefined, fallback: number): number {
  if (value == null || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }

  return value;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeBounds(min: number, max: number): { min: number; max: number } {
  if (max >= min) {
    return { min, max };
  }

  return { min: max, max: min };
}

function toPercentage(value: number, min: number, max: number): number {
  const range = max - min;

  if (range <= 0) {
    return 0;
  }

  return ((value - min) / range) * 100;
}

function useProgressContextValue(): ProgressContextValue {
  const contextValue = useContext(ProgressContext);

  if (contextValue != null) {
    return contextValue;
  }

  return {
    value: 0,
    percentage: 0,
    size: 'md',
  };
}

export function Progress({
  value = 0,
  min = 0,
  max = 100,
  size = 'md',
  children,
  formatAriaValue,
  onAction,
  className = '',
  style,
  ['aria-label']: ariaLabel,
  ['aria-labelledby']: ariaLabelledBy,
  ['aria-describedby']: ariaDescribedBy,
  ...props
}: ProgressProps): JSX.Element {
  const safeMin = toFiniteNumber(min, 0);
  const safeMax = toFiniteNumber(max, 100);
  const safeValue = toFiniteNumber(value, 0);
  const bounds = normalizeBounds(safeMin, safeMax);

  const clampedValue = clamp(safeValue, bounds.min, bounds.max);
  const percentage = clamp(toPercentage(clampedValue, bounds.min, bounds.max), 0, 100);

  const tokens = sizeTokens[size];

  const contextValue: ProgressContextValue = {
    value: clampedValue,
    percentage,
    size,
  };

  const previousSnapshotRef = useRef<{
    value: number;
    min: number;
    max: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    const nextSnapshot = {
      value: clampedValue,
      min: bounds.min,
      max: bounds.max,
      percentage,
    };

    const previousSnapshot = previousSnapshotRef.current;
    previousSnapshotRef.current = nextSnapshot;

    if (previousSnapshot == null) {
      return;
    }

    const hasChanged =
      previousSnapshot.value !== nextSnapshot.value ||
      previousSnapshot.min !== nextSnapshot.min ||
      previousSnapshot.max !== nextSnapshot.max ||
      previousSnapshot.percentage !== nextSnapshot.percentage;

    if (!hasChanged) {
      return;
    }

    onAction?.({
      source: 'value-change',
      value: nextSnapshot.value,
      min: nextSnapshot.min,
      max: nextSnapshot.max,
      percentage: nextSnapshot.percentage,
      previousValue: previousSnapshot.value,
    });
  }, [bounds.max, bounds.min, clampedValue, onAction, percentage]);

  const rootStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '0.44rem',
    ...style,
  };

  const headerStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.55rem',
  };

  const trackStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '999px',
    height: tokens.trackHeight,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--ktn-border-muted)',
    backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.14))',
  };

  const indicatorStyle: CSSProperties = {
    height: '100%',
    width: `${percentage}%`,
    minWidth: percentage > 0 ? '2px' : undefined,
    borderRadius: '999px',
    backgroundColor: 'var(--ktn-action-primary-bg, #2563eb)',
    transition: 'width 220ms cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const resolvedAriaValue =
    formatAriaValue?.(clampedValue, percentage) ?? `${Math.round(percentage)}%`;

  const resolvedAriaLabel = ariaLabel ?? (ariaLabelledBy == null ? 'Progress' : undefined);

  return (
    <ProgressContext.Provider value={contextValue}>
      <div className={`${baseClasses} ${className}`.trim()} style={rootStyle} {...props}>
        {children != null ? <div style={headerStyle}>{children}</div> : null}

        <div
          role="progressbar"
          aria-valuemin={bounds.min}
          aria-valuemax={bounds.max}
          aria-valuenow={clampedValue}
          aria-valuetext={resolvedAriaValue}
          aria-label={resolvedAriaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          style={trackStyle}
        >
          <div aria-hidden style={indicatorStyle} />
        </div>
      </div>
    </ProgressContext.Provider>
  );
}

export function ProgressLabel({
  children,
  className = '',
  style,
  ...props
}: ProgressLabelProps): JSX.Element {
  const { size } = useProgressContextValue();
  const tokens = sizeTokens[size];

  const labelStyle: CSSProperties = {
    margin: 0,
    minWidth: 0,
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: tokens.labelFontSize,
    fontWeight: 500,
    lineHeight: 1.3,
    color: 'var(--ktn-text-primary)',
    ...style,
  };

  return (
    <span className={className.trim() === '' ? undefined : className} style={labelStyle} {...props}>
      {children}
    </span>
  );
}

export function ProgressValue({
  formatter,
  className = '',
  style,
  ...props
}: ProgressValueProps): JSX.Element {
  const { value, percentage, size } = useProgressContextValue();
  const tokens = sizeTokens[size];

  const valueStyle: CSSProperties = {
    margin: 0,
    minWidth: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontSize: tokens.labelFontSize,
    fontWeight: 500,
    lineHeight: 1.3,
    color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
    ...style,
  };

  const content = formatter?.(value, percentage) ?? `${Math.round(percentage)}%`;

  return (
    <span className={className.trim() === '' ? undefined : className} style={valueStyle} {...props}>
      {content}
    </span>
  );
}
