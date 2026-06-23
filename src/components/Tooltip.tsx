import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

export type TooltipSize = 'xs' | 'sm' | 'md' | 'lg';
export type TooltipSide = 'left' | 'top' | 'bottom' | 'right' | 'auto';
export type TooltipActionSource =
  | 'open'
  | 'close'
  | 'focus'
  | 'blur'
  | 'mouse-enter'
  | 'mouse-leave'
  | 'escape';

export interface TooltipActionContext {
  source: TooltipActionSource;
  open: boolean;
  size: TooltipSize;
  side: FixedTooltipSide;
  requestedSide: TooltipSide;
  disabled: boolean;
  hasLabel: boolean;
  event?: unknown;
}

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'title'> {
  children: ReactNode;
  label: ReactNode;
  size?: TooltipSize;
  side?: TooltipSide;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  onAction?: (context: TooltipActionContext) => void;
}

type TooltipSizeTokens = {
  fontSize: string;
  paddingInline: string;
  paddingBlock: string;
  borderRadius: string;
  maxWidth: string;
  arrowSize: string;
  offset: string;
};

type FixedTooltipSide = Exclude<TooltipSide, 'auto'>;

const sizeTokens: Record<TooltipSize, TooltipSizeTokens> = {
  xs: {
    fontSize: '0.6875rem',
    paddingInline: '0.4rem',
    paddingBlock: '0.28rem',
    borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
    maxWidth: '12rem',
    arrowSize: '4px',
    offset: '0.35rem',
  },
  sm: {
    fontSize: '0.75rem',
    paddingInline: '0.43rem',
    paddingBlock: '0.29rem',
    borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
    maxWidth: '12.75rem',
    arrowSize: '4px',
    offset: '0.35rem',
  },
  md: {
    fontSize: '0.8125rem',
    paddingInline: '0.4rem',
    paddingBlock: '0.28rem',
    borderRadius: 'var(--ktn-radius-md, 0.5rem)',
    maxWidth: '13.75rem',
    arrowSize: '4px',
    offset: '0.35rem',
  },
  lg: {
    fontSize: '0.875rem',
    paddingInline: '0.4rem',
    paddingBlock: '0.28rem',
    borderRadius: 'var(--ktn-radius-md, 0.5rem)',
    maxWidth: '14.75rem',
    arrowSize: '4px',
    offset: '0.35rem',
  },
};

const baseClasses = 'relative inline-flex w-fit max-w-full';
const tooltipBackgroundColor = 'color-mix(in srgb, var(--ktn-text-primary, #0f172a) 92%, black)';

function resolveAutoSide(triggerRect: DOMRect, bubbleRect: DOMRect): FixedTooltipSide {
  const viewportPadding = 8;
  const available = {
    top: triggerRect.top - viewportPadding,
    bottom: window.innerHeight - triggerRect.bottom - viewportPadding,
    left: triggerRect.left - viewportPadding,
    right: window.innerWidth - triggerRect.right - viewportPadding,
  };

  const required = {
    top: bubbleRect.height + viewportPadding,
    bottom: bubbleRect.height + viewportPadding,
    left: bubbleRect.width + viewportPadding,
    right: bubbleRect.width + viewportPadding,
  };

  const priority: FixedTooltipSide[] = ['top', 'bottom', 'right', 'left'];

  for (const candidate of priority) {
    if (available[candidate] >= required[candidate]) {
      return candidate;
    }
  }

  return priority.reduce((best, candidate) =>
    available[candidate] > available[best] ? candidate : best,
  );
}

function getLayerPositionStyle(side: FixedTooltipSide, offset: string): CSSProperties {
  if (side === 'bottom') {
    return {
      insetInlineStart: '50%',
      insetBlockStart: `calc(100% + ${offset})`,
      transform: 'translateX(-50%)',
    };
  }

  if (side === 'left') {
    return {
      insetInlineEnd: `calc(100% + ${offset})`,
      insetBlockStart: '50%',
      transform: 'translateY(-50%)',
    };
  }

  if (side === 'right') {
    return {
      insetInlineStart: `calc(100% + ${offset})`,
      insetBlockStart: '50%',
      transform: 'translateY(-50%)',
    };
  }

  return {
    insetInlineStart: '50%',
    insetBlockEnd: `calc(100% + ${offset})`,
    transform: 'translateX(-50%)',
  };
}

function getHiddenMotion(side: FixedTooltipSide): string {
  if (side === 'bottom') {
    return 'translateY(-3px) scale(0.98)';
  }

  if (side === 'left') {
    return 'translateX(3px) scale(0.98)';
  }

  if (side === 'right') {
    return 'translateX(-3px) scale(0.98)';
  }

  return 'translateY(3px) scale(0.98)';
}

function getArrowStyle(side: FixedTooltipSide, arrowSize: string): CSSProperties {
  if (side === 'bottom') {
    return {
      insetInlineStart: '50%',
      insetBlockEnd: '100%',
      transform: 'translateX(-50%)',
      borderWidth: `0 ${arrowSize} ${arrowSize} ${arrowSize}`,
      borderColor: `transparent transparent ${tooltipBackgroundColor} transparent`,
    };
  }

  if (side === 'left') {
    return {
      insetInlineStart: '100%',
      insetBlockStart: '50%',
      transform: 'translateY(-50%)',
      borderWidth: `${arrowSize} 0 ${arrowSize} ${arrowSize}`,
      borderColor: `transparent transparent transparent ${tooltipBackgroundColor}`,
    };
  }

  if (side === 'right') {
    return {
      insetInlineEnd: '100%',
      insetBlockStart: '50%',
      transform: 'translateY(-50%)',
      borderWidth: `${arrowSize} ${arrowSize} ${arrowSize} 0`,
      borderColor: `transparent ${tooltipBackgroundColor} transparent transparent`,
    };
  }

  return {
    insetInlineStart: '50%',
    insetBlockStart: '100%',
    transform: 'translateX(-50%)',
    borderWidth: `${arrowSize} ${arrowSize} 0 ${arrowSize}`,
    borderColor: `${tooltipBackgroundColor} transparent transparent transparent`,
  };
}

export function Tooltip({
  children,
  label,
  size = 'md',
  side = 'auto',
  disabled = false,
  openDelay = 120,
  closeDelay = 70,
  onAction,
  className = '',
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: TooltipProps): JSX.Element {
  const rootRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const openTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const previousOpenRef = useRef(isOpen);
  const [autoSide, setAutoSide] = useState<FixedTooltipSide>('top');
  const [layerShift, setLayerShift] = useState({ x: 0, y: 0 });

  const tokens = sizeTokens[size];
  const hasLabel = label != null && !(typeof label === 'string' && label.trim() === '');
  const effectiveSide: FixedTooltipSide = side === 'auto' ? autoSide : side;

  function emitAction(
    source: TooltipActionSource,
    options?: {
      open?: boolean;
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      open: options?.open ?? isOpen,
      size,
      side: effectiveSide,
      requestedSide: side,
      disabled,
      hasLabel,
      event: options?.event,
    });
  }

  function clearOpenTimeout(): void {
    if (openTimeoutRef.current != null) {
      window.clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  }

  function clearCloseTimeout(): void {
    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function showTooltip(): void {
    if (disabled || !hasLabel) {
      return;
    }

    clearCloseTimeout();

    if (openDelay <= 0) {
      clearOpenTimeout();
      setIsOpen(true);
      return;
    }

    clearOpenTimeout();

    openTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(true);
      openTimeoutRef.current = null;
    }, openDelay);
  }

  function hideTooltip(): void {
    clearOpenTimeout();

    if (closeDelay <= 0) {
      clearCloseTimeout();
      setIsOpen(false);
      return;
    }

    clearCloseTimeout();

    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimeoutRef.current = null;
    }, closeDelay);
  }

  useEffect(
    () => () => {
      clearOpenTimeout();
      clearCloseTimeout();
    },
    [],
  );

  useEffect(() => {
    if (disabled && isOpen) {
      clearOpenTimeout();
      clearCloseTimeout();
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  useEffect(() => {
    const previousOpen = previousOpenRef.current;

    if (previousOpen === isOpen) {
      return;
    }

    previousOpenRef.current = isOpen;

    onAction?.({
      source: isOpen ? 'open' : 'close',
      open: isOpen,
      size,
      side: effectiveSide,
      requestedSide: side,
      disabled,
      hasLabel,
    });
  }, [disabled, effectiveSide, hasLabel, isOpen, onAction, side, size]);

  useLayoutEffect(() => {
    if (!(isOpen && hasLabel && side === 'auto')) {
      return;
    }

    let frameId = 0;

    function updateAutoSide(): void {
      if (rootRef.current == null || bubbleRef.current == null) {
        return;
      }

      const triggerRect = rootRef.current.getBoundingClientRect();
      const bubbleRect = bubbleRef.current.getBoundingClientRect();
      const nextSide = resolveAutoSide(triggerRect, bubbleRect);

      setAutoSide((current) => (current === nextSide ? current : nextSide));
    }

    function scheduleAutoSideUpdate(): void {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(updateAutoSide);
    }

    scheduleAutoSideUpdate();

    window.addEventListener('resize', scheduleAutoSideUpdate);
    window.addEventListener('scroll', scheduleAutoSideUpdate, true);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('resize', scheduleAutoSideUpdate);
      window.removeEventListener('scroll', scheduleAutoSideUpdate, true);
    };
  }, [hasLabel, isOpen, side, size, label]);

  useLayoutEffect(() => {
    if (!(isOpen && hasLabel)) {
      setLayerShift({ x: 0, y: 0 });
      return;
    }

    let frameId = 0;

    function updateShift(): void {
      if (layerRef.current == null) {
        return;
      }

      const viewportPadding = 8;
      const layerRect = layerRef.current.getBoundingClientRect();
      let nextX = 0;
      let nextY = 0;

      if (layerRect.left < viewportPadding) {
        nextX = viewportPadding - layerRect.left;
      } else if (layerRect.right > window.innerWidth - viewportPadding) {
        nextX = window.innerWidth - viewportPadding - layerRect.right;
      }

      if (layerRect.top < viewportPadding) {
        nextY = viewportPadding - layerRect.top;
      } else if (layerRect.bottom > window.innerHeight - viewportPadding) {
        nextY = window.innerHeight - viewportPadding - layerRect.bottom;
      }

      setLayerShift((current) =>
        current.x === nextX && current.y === nextY ? current : { x: nextX, y: nextY },
      );
    }

    function scheduleShiftUpdate(): void {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(updateShift);
    }

    scheduleShiftUpdate();

    window.addEventListener('resize', scheduleShiftUpdate);
    window.addEventListener('scroll', scheduleShiftUpdate, true);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('resize', scheduleShiftUpdate);
      window.removeEventListener('scroll', scheduleShiftUpdate, true);
    };
  }, [effectiveSide, hasLabel, isOpen, size, label]);

  function handleMouseEnter(event: MouseEvent<HTMLSpanElement>): void {
    showTooltip();
    onMouseEnter?.(event);

    if (!event.defaultPrevented) {
      emitAction('mouse-enter', {
        event,
      });
    }
  }

  function handleMouseLeave(event: MouseEvent<HTMLSpanElement>): void {
    hideTooltip();
    onMouseLeave?.(event);

    if (!event.defaultPrevented) {
      emitAction('mouse-leave', {
        event,
      });
    }
  }

  function handleFocus(event: FocusEvent<HTMLSpanElement>): void {
    showTooltip();
    onFocus?.(event);

    if (!event.defaultPrevented) {
      emitAction('focus', {
        event,
      });
    }
  }

  function handleBlur(event: FocusEvent<HTMLSpanElement>): void {
    const nextFocused = event.relatedTarget as Node | null;

    if (nextFocused == null || !event.currentTarget.contains(nextFocused)) {
      hideTooltip();
    }

    onBlur?.(event);

    if (!event.defaultPrevented) {
      emitAction('blur', {
        event,
      });
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Escape') {
      hideTooltip();
      emitAction('escape', {
        open: false,
        event,
      });
    }
  }

  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    width: 'fit-content',
    maxWidth: '100%',
    ...style,
  };

  const placementStyle = getLayerPositionStyle(effectiveSide, tokens.offset);
  const placementTransform =
    typeof placementStyle.transform === 'string' ? placementStyle.transform : '';

  const layerStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 40,
    pointerEvents: 'none',
    ...placementStyle,
    transform: `${placementTransform} translate(${layerShift.x}px, ${layerShift.y}px)`,
  };

  const bubbleStyle: CSSProperties = {
    position: 'relative',
    display: 'block',
    width: 'max-content',
    maxWidth: `min(${tokens.maxWidth}, calc(100vw - 1rem))`,
    borderRadius: tokens.borderRadius,
    paddingInline: tokens.paddingInline,
    paddingBlock: tokens.paddingBlock,
    backgroundColor: tooltipBackgroundColor,
    color: 'var(--ktn-bg-surface, #ffffff)',
    fontSize: tokens.fontSize,
    lineHeight: 1.3,
    textAlign: 'center',
    boxShadow: '0 8px 20px rgba(2, 6, 23, 0.2)',
    transform: 'translate(0) scale(1)',
    transformOrigin: 'center',
    whiteSpace: 'normal',
    wordBreak: 'normal',
    overflowWrap: 'break-word',
    hyphens: 'none',
  };

  const arrowStyle: CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  };

  return (
    <span
      {...props}
      ref={rootRef}
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled || undefined}
      aria-describedby={isOpen && hasLabel ? tooltipId : undefined}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {children}

      {hasLabel && isOpen ? (
        <span id={tooltipId} ref={layerRef} role="tooltip" aria-hidden={!isOpen} style={layerStyle}>
          <span ref={bubbleRef} style={bubbleStyle}>
            {label}
          </span>
          <span
            aria-hidden
            style={{ ...arrowStyle, ...getArrowStyle(effectiveSide, tokens.arrowSize) }}
          />
        </span>
      ) : null}
    </span>
  );
}
