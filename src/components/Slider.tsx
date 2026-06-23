import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderSize = 'xs' | 'sm' | 'md' | 'lg';
export type SliderActionSource =
  | 'value-change'
  | 'thumb-focus'
  | 'thumb-blur'
  | 'drag-start'
  | 'drag-end';

export interface SliderActionContext {
  source: SliderActionSource;
  values: number[];
  previousValues?: number[];
  activeThumbIndex: number;
  orientation: SliderOrientation;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  event?: unknown;
}

export interface SliderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange'
> {
  orientation?: SliderOrientation;
  size?: SliderSize;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onAction?: (context: SliderActionContext) => void;
  min?: number;
  max?: number;
  step?: number;
  minStepsBetweenThumbs?: number;
  disabled?: boolean;
  showLabels?: boolean;
  minLabel?: ReactNode;
  maxLabel?: ReactNode;
  showValueLabel?: boolean;
  formatValueLabel?: (value: number[]) => ReactNode;
}

type SliderSizeTokens = {
  trackThickness: string;
  verticalTrackThickness: string;
  thumbSize: string;
  focusRing: string;
  gap: string;
  verticalLength: string;
};

const sizeTokens: Record<SliderSize, SliderSizeTokens> = {
  xs: {
    trackThickness: '0.3rem',
    verticalTrackThickness: '0.35rem',
    thumbSize: '0.78rem',
    focusRing: '2px',
    gap: '0.45rem',
    verticalLength: '8.4rem',
  },
  sm: {
    trackThickness: '0.36rem',
    verticalTrackThickness: '0.42rem',
    thumbSize: '0.9rem',
    focusRing: '2px',
    gap: '0.5rem',
    verticalLength: '9.2rem',
  },
  md: {
    trackThickness: '0.44rem',
    verticalTrackThickness: '0.54rem',
    thumbSize: '1.02rem',
    focusRing: '2px',
    gap: '0.55rem',
    verticalLength: '10.5rem',
  },
  lg: {
    trackThickness: '0.52rem',
    verticalTrackThickness: '0.66rem',
    thumbSize: '1.16rem',
    focusRing: '2px',
    gap: '0.6rem',
    verticalLength: '11.6rem',
  },
};

const baseClasses = 'inline-flex min-w-0';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function decimalPlaces(value: number): number {
  const asText = `${value}`;

  if (!asText.includes('.')) {
    return 0;
  }

  return asText.split('.')[1]?.length ?? 0;
}

function roundToStep(value: number, min: number, step: number, max: number): number {
  if (!(step > 0)) {
    return clamp(value, min, max);
  }

  const steps = Math.round((value - min) / step);
  const rounded = min + steps * step;
  const precision = Math.max(decimalPlaces(step), decimalPlaces(min), decimalPlaces(max));

  return clamp(Number(rounded.toFixed(precision)), min, max);
}

function normalizeValues(
  values: number[] | undefined,
  min: number,
  max: number,
  step: number,
  minGap: number,
): number[] {
  const inputValues = values != null && values.length > 0 ? values : [min];
  const roundedValues = inputValues
    .map((currentValue) => roundToStep(currentValue, min, step, max))
    .sort((left, right) => left - right);

  if (roundedValues.length <= 1) {
    return roundedValues;
  }

  const availableSpan = Math.max(max - min, 0);
  const maxGapByCount = roundedValues.length > 1 ? availableSpan / (roundedValues.length - 1) : 0;
  const maxGapByStep = step > 0 ? Math.floor(maxGapByCount / step) * step : maxGapByCount;
  const constrainedMinGap = clamp(minGap, 0, Math.max(maxGapByStep, 0));

  const normalized = [...roundedValues];

  normalized[0] = clamp(normalized[0], min, max);

  for (let index = 1; index < normalized.length; index += 1) {
    const current = clamp(normalized[index], min, max);
    normalized[index] = Math.max(current, normalized[index - 1] + constrainedMinGap);
  }

  if (normalized[normalized.length - 1] > max) {
    normalized[normalized.length - 1] = max;

    for (let index = normalized.length - 2; index >= 0; index -= 1) {
      normalized[index] = Math.min(normalized[index], normalized[index + 1] - constrainedMinGap);
    }
  }

  if (normalized[0] < min) {
    normalized[0] = min;

    for (let index = 1; index < normalized.length; index += 1) {
      normalized[index] = Math.max(normalized[index], normalized[index - 1] + constrainedMinGap);
    }
  }

  return normalized;
}

function valueToPercent(value: number, min: number, max: number): number {
  if (max <= min) {
    return 0;
  }

  return ((value - min) / (max - min)) * 100;
}

function defaultValueLabel(values: number[]): string {
  if (values.length === 0) {
    return '';
  }

  if (values.length === 1) {
    return `${values[0]}`;
  }

  return `${values[0]} - ${values[values.length - 1]}`;
}

function resolveEndpointLabel(label: ReactNode | undefined, fallback: string): ReactNode {
  if (label == null) {
    return fallback;
  }

  if (typeof label === 'string' && label.trim() === '') {
    return fallback;
  }

  return label;
}

export function Slider({
  orientation = 'horizontal',
  size = 'md',
  value,
  defaultValue,
  onValueChange,
  onAction,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  disabled = false,
  showLabels = true,
  minLabel,
  maxLabel,
  showValueLabel,
  formatValueLabel,
  className = '',
  style,
  ...props
}: SliderProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const isControlled = value !== undefined;
  const resolvedStep = step > 0 ? step : 1;
  const minGap = Math.max(minStepsBetweenThumbs, 0) * resolvedStep;

  const [uncontrolledValues, setUncontrolledValues] = useState<number[]>(() =>
    normalizeValues(defaultValue, min, max, resolvedStep, minGap),
  );
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [focusedThumbIndex, setFocusedThumbIndex] = useState<number | null>(null);
  const [draggingThumbIndex, setDraggingThumbIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledValues((current) => normalizeValues(current, min, max, resolvedStep, minGap));
    }
  }, [isControlled, max, min, minGap, resolvedStep]);

  const resolvedValues = useMemo(
    () =>
      normalizeValues(isControlled ? value : uncontrolledValues, min, max, resolvedStep, minGap),
    [isControlled, max, min, minGap, resolvedStep, uncontrolledValues, value],
  );

  useEffect(() => {
    if (activeThumbIndex > resolvedValues.length - 1) {
      setActiveThumbIndex(Math.max(resolvedValues.length - 1, 0));
    }
  }, [activeThumbIndex, resolvedValues.length]);

  const tokens = sizeTokens[size];

  function emitAction(
    source: SliderActionSource,
    options?: {
      values?: number[];
      previousValues?: number[];
      activeThumbIndex?: number;
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      values: options?.values ?? resolvedValues,
      previousValues: options?.previousValues,
      activeThumbIndex: options?.activeThumbIndex ?? activeThumbIndex,
      orientation,
      min,
      max,
      step: resolvedStep,
      disabled,
      event: options?.event,
    });
  }

  function emitValues(nextValues: number[], index: number, event?: unknown): void {
    const normalized = normalizeValues(nextValues, min, max, resolvedStep, minGap);
    const previousValues = resolvedValues;

    if (!isControlled) {
      setUncontrolledValues(normalized);
    }

    onValueChange?.(normalized);
    emitAction('value-change', {
      values: normalized,
      previousValues,
      activeThumbIndex: index,
      event,
    });
  }

  function getThumbMin(index: number, values: number[]): number {
    if (index === 0) {
      return min;
    }

    return values[index - 1] + minGap;
  }

  function getThumbMax(index: number, values: number[]): number {
    if (index === values.length - 1) {
      return max;
    }

    return values[index + 1] - minGap;
  }

  function resolveThumbValue(index: number, candidate: number, values: number[]): number {
    const thumbMin = getThumbMin(index, values);
    const thumbMax = getThumbMax(index, values);

    if (thumbMin > thumbMax) {
      return values[index] ?? min;
    }

    const rounded = roundToStep(candidate, min, resolvedStep, max);
    return clamp(rounded, thumbMin, thumbMax);
  }

  function updateThumbValue(
    index: number,
    candidate: number,
    focusThumb: boolean,
    event?: unknown,
  ): void {
    if (disabled) {
      return;
    }

    const nextValues = [...resolvedValues];
    nextValues[index] = resolveThumbValue(index, candidate, resolvedValues);
    emitValues(nextValues, index, event);

    if (focusThumb) {
      thumbRefs.current[index]?.focus();
    }
  }

  function getPointerValue(clientX: number, clientY: number): number {
    if (trackRef.current == null) {
      return min;
    }

    const rect = trackRef.current.getBoundingClientRect();

    if (orientation === 'horizontal') {
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return min + ratio * (max - min);
    }

    const ratio = clamp((clientY - rect.top) / rect.height, 0, 1);
    return min + (1 - ratio) * (max - min);
  }

  function getClosestThumbIndex(candidateValue: number): number {
    let closestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    resolvedValues.forEach((thumbValue, index) => {
      const distance = Math.abs(thumbValue - candidateValue);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function handleTrackPointerDown(event: PointerEvent<HTMLDivElement>): void {
    if (disabled) {
      return;
    }

    const targetElement = event.target as HTMLElement;

    if (targetElement.closest('[data-slider-thumb="true"]') != null) {
      return;
    }

    event.preventDefault();

    const pointerValue = getPointerValue(event.clientX, event.clientY);
    const closestIndex = getClosestThumbIndex(pointerValue);

    setActiveThumbIndex(closestIndex);
    updateThumbValue(closestIndex, pointerValue, true, event);
    setDraggingThumbIndex(closestIndex);
    emitAction('drag-start', {
      activeThumbIndex: closestIndex,
      event,
    });
  }

  useEffect(() => {
    if (draggingThumbIndex == null || disabled) {
      return;
    }

    function handlePointerMove(event: globalThis.PointerEvent): void {
      event.preventDefault();
      const dragIndex = draggingThumbIndex;

      if (dragIndex == null) {
        return;
      }

      const pointerValue = getPointerValue(event.clientX, event.clientY);
      updateThumbValue(dragIndex, pointerValue, false, event);
    }

    function stopDragging(event?: globalThis.PointerEvent): void {
      const dragIndex = draggingThumbIndex;

      if (dragIndex != null) {
        emitAction('drag-end', {
          activeThumbIndex: dragIndex,
          event,
        });
      }

      setDraggingThumbIndex(null);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, [disabled, draggingThumbIndex, max, min, minGap, orientation, resolvedValues, resolvedStep]);

  function handleThumbKeyDown(index: number, event: KeyboardEvent<HTMLButtonElement>): void {
    if (disabled) {
      return;
    }

    const current = resolvedValues[index] ?? min;
    let nextValue: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      nextValue = current + resolvedStep;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      nextValue = current - resolvedStep;
    } else if (event.key === 'PageUp') {
      nextValue = current + resolvedStep * 10;
    } else if (event.key === 'PageDown') {
      nextValue = current - resolvedStep * 10;
    } else if (event.key === 'Home') {
      nextValue = getThumbMin(index, resolvedValues);
    } else if (event.key === 'End') {
      nextValue = getThumbMax(index, resolvedValues);
    }

    if (nextValue != null) {
      event.preventDefault();
      updateThumbValue(index, nextValue, true, event);
    }
  }

  const firstValue = resolvedValues[0] ?? min;
  const lastValue = resolvedValues[resolvedValues.length - 1] ?? min;
  const rangeStart = resolvedValues.length > 1 ? firstValue : min;
  const rangeEnd = lastValue;

  const rangeStartPercent = valueToPercent(rangeStart, min, max);
  const rangeEndPercent = valueToPercent(rangeEnd, min, max);
  const rangeSpanPercent = Math.max(rangeEndPercent - rangeStartPercent, 0);

  const resolvedShowValueLabel = showValueLabel ?? orientation === 'vertical';
  const resolvedMinLabel = resolveEndpointLabel(minLabel, `Min: ${min}`);
  const resolvedMaxLabel = resolveEndpointLabel(maxLabel, `Max: ${max}`);
  const resolvedValueLabel =
    formatValueLabel != null ? formatValueLabel(resolvedValues) : defaultValueLabel(resolvedValues);

  const rootStyle: CSSProperties = {
    width: orientation === 'horizontal' ? '100%' : 'fit-content',
    minWidth: 0,
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: orientation === 'horizontal' ? 'stretch' : 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    touchAction: 'none',
    ...style,
  };

  const labelsStyle: CSSProperties = {
    width: orientation === 'horizontal' ? '100%' : 'fit-content',
    display: 'inline-flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column-reverse',
    justifyContent: 'space-between',
    alignItems: orientation === 'horizontal' ? 'center' : 'stretch',
    gap: orientation === 'horizontal' ? '0.75rem' : '0.35rem',
    fontSize: '0.78rem',
    lineHeight: 1.3,
    color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
  };

  const valueLabelStyle: CSSProperties = {
    width: 'fit-content',
    paddingInline: '0.4rem',
    paddingBlock: '0.2rem',
    borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
    backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.1))',
    color: 'var(--ktn-text-primary)',
    fontSize: '0.78rem',
    lineHeight: 1.25,
    border: '1px solid var(--ktn-border-muted)',
  };

  const trackWrapStyle: CSSProperties = {
    position: 'relative',
    width:
      orientation === 'horizontal'
        ? '100%'
        : `calc(${tokens.verticalTrackThickness} + ${tokens.gap} + ${tokens.gap})`,
    height:
      orientation === 'horizontal'
        ? `calc(${tokens.thumbSize} + ${tokens.gap} + ${tokens.gap})`
        : `calc(${tokens.verticalLength} + ${tokens.gap} + ${tokens.gap})`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBlock: tokens.gap,
    paddingInline: orientation === 'horizontal' ? 0 : tokens.gap,
    boxSizing: 'border-box',
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    width: orientation === 'horizontal' ? '100%' : tokens.verticalTrackThickness,
    height: orientation === 'horizontal' ? tokens.trackThickness : '100%',
    borderRadius: '999px',
    backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.14))',
    border: '1px solid var(--ktn-border-muted)',
    boxSizing: 'border-box',
  };

  const rangeStyle: CSSProperties = {
    position: 'absolute',
    borderRadius: '999px',
    pointerEvents: 'none',
    zIndex: 1,
    backgroundColor: disabled
      ? 'color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 55%, var(--ktn-bg-muted))'
      : 'var(--ktn-action-primary-bg, #2563eb)',
    ...(orientation === 'horizontal'
      ? {
          top: 0,
          left: `${rangeStartPercent}%`,
          width: `${rangeSpanPercent}%`,
          minWidth: rangeSpanPercent > 0 ? '2px' : undefined,
          height: '100%',
        }
      : {
          left: 0,
          bottom: `${rangeStartPercent}%`,
          width: '100%',
          height: `${rangeSpanPercent}%`,
          minHeight: rangeSpanPercent > 0 ? '3px' : undefined,
        }),
  };

  return (
    <div
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {resolvedShowValueLabel ? <div style={valueLabelStyle}>{resolvedValueLabel}</div> : null}

      <div style={trackWrapStyle} onPointerDown={handleTrackPointerDown}>
        <div ref={trackRef} style={trackStyle}>
          <div aria-hidden style={rangeStyle} />

          {resolvedValues.map((sliderValue, index) => {
            const percent = valueToPercent(sliderValue, min, max);
            const thumbIsActive =
              index === activeThumbIndex ||
              index === focusedThumbIndex ||
              index === draggingThumbIndex;

            const thumbPositionStyle: CSSProperties =
              orientation === 'horizontal'
                ? {
                    insetInlineStart: `${percent}%`,
                    insetBlockStart: '50%',
                    transform: 'translate(-50%, -50%)',
                  }
                : {
                    insetInlineStart: '50%',
                    insetBlockStart: `${100 - percent}%`,
                    transform: 'translate(-50%, -50%)',
                  };

            const thumbStyle: CSSProperties = {
              position: 'absolute',
              width: tokens.thumbSize,
              height: tokens.thumbSize,
              borderRadius: '999px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--ktn-action-primary-bg)',
              backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
              boxShadow: thumbIsActive
                ? `0 0 0 ${tokens.focusRing} color-mix(in srgb, var(--ktn-action-primary-bg) 24%, transparent)`
                : '0 1px 2px color-mix(in srgb, var(--ktn-text-primary, #0f172a) 22%, transparent)',
              cursor: disabled ? 'not-allowed' : 'grab',
              touchAction: 'none',
              transition:
                'box-shadow 120ms ease, border-color 120ms ease, background-color 120ms ease',
              zIndex: thumbIsActive ? 3 : 2,
              ...thumbPositionStyle,
            };

            return (
              <button
                key={`thumb-${index}`}
                ref={(element) => {
                  thumbRefs.current[index] = element;
                }}
                type="button"
                data-slider-thumb="true"
                role="slider"
                aria-orientation={orientation}
                aria-valuemin={getThumbMin(index, resolvedValues)}
                aria-valuemax={getThumbMax(index, resolvedValues)}
                aria-valuenow={sliderValue}
                aria-valuetext={`${sliderValue}`}
                aria-disabled={disabled}
                aria-label={resolvedValues.length > 1 ? `Slider thumb ${index + 1}` : 'Slider'}
                tabIndex={disabled ? -1 : index === activeThumbIndex ? 0 : -1}
                disabled={disabled}
                style={thumbStyle}
                onFocus={(event) => {
                  setFocusedThumbIndex(index);
                  setActiveThumbIndex(index);
                  emitAction('thumb-focus', {
                    activeThumbIndex: index,
                    event,
                  });
                }}
                onBlur={(event) => {
                  setFocusedThumbIndex((current) => (current === index ? null : current));
                  emitAction('thumb-blur', {
                    activeThumbIndex: index,
                    event,
                  });
                }}
                onPointerDown={(event) => {
                  if (disabled) {
                    return;
                  }

                  event.preventDefault();
                  setActiveThumbIndex(index);
                  thumbRefs.current[index]?.focus();
                  setDraggingThumbIndex(index);
                  emitAction('drag-start', {
                    activeThumbIndex: index,
                    event,
                  });
                }}
                onKeyDown={(event) => {
                  handleThumbKeyDown(index, event);
                }}
              />
            );
          })}
        </div>
      </div>

      {showLabels ? (
        <div style={labelsStyle}>
          <span>{resolvedMinLabel}</span>
          <span>{resolvedMaxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
