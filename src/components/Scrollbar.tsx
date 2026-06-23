import {
  useEffect,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type ReactNode,
  type UIEvent,
} from 'react';

export type ScrollbarAxis = 'x' | 'y' | 'both';
export type ScrollbarActionSource = 'scroll' | 'focus' | 'blur';

export interface ScrollbarActionContext {
  source: ScrollbarActionSource;
  axis: ScrollbarAxis;
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
  event?: unknown;
}

export interface ScrollbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode;
  axis?: ScrollbarAxis;
  onAction?: (context: ScrollbarActionContext) => void;
}

const STYLE_ID = 'ktn-themed-scrollbar-styles';
const BASE_CLASS = 'ktn-themed-scrollbar';

function ensureScrollbarStyles(): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById(STYLE_ID) != null) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = STYLE_ID;
  styleElement.textContent = `
.${BASE_CLASS} {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--ktn-text-secondary, #94a3b8) 58%, transparent) transparent;
}

.${BASE_CLASS}::-webkit-scrollbar {
  width: 0.6rem;
  height: 0.6rem;
}

.${BASE_CLASS}::-webkit-scrollbar-track {
  background: transparent;
}

.${BASE_CLASS}::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--ktn-text-secondary, #94a3b8) 58%, transparent);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}

.${BASE_CLASS}::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 42%, var(--ktn-text-secondary, #94a3b8));
  border: 2px solid transparent;
  background-clip: padding-box;
}

.${BASE_CLASS}::-webkit-scrollbar-corner {
  background: transparent;
}
`;

  document.head.appendChild(styleElement);
}

export function Scrollbar({
  children,
  axis = 'y',
  onAction,
  className = '',
  style,
  onScroll,
  onFocus,
  onBlur,
  role,
  tabIndex,
  ['aria-label']: ariaLabel,
  ['aria-labelledby']: ariaLabelledBy,
  ...props
}: ScrollbarProps): JSX.Element {
  useEffect(() => {
    ensureScrollbarStyles();
  }, []);

  const overflowStyle: CSSProperties =
    axis === 'both'
      ? {
          overflowX: 'auto',
          overflowY: 'auto',
        }
      : axis === 'x'
        ? {
            overflowX: 'auto',
            overflowY: 'hidden',
          }
        : {
            overflowX: 'hidden',
            overflowY: 'auto',
          };

  const composedClassName = `${BASE_CLASS} ${className}`.trim();
  const composedStyle: CSSProperties = {
    ...overflowStyle,
    ...style,
  };

  const resolvedAriaLabel =
    ariaLabel ?? (ariaLabelledBy == null ? 'Scrollable content' : undefined);

  function emitAction(
    source: ScrollbarActionSource,
    event: unknown,
    element: HTMLDivElement,
  ): void {
    onAction?.({
      source,
      axis,
      scrollTop: element.scrollTop,
      scrollLeft: element.scrollLeft,
      scrollHeight: element.scrollHeight,
      scrollWidth: element.scrollWidth,
      clientHeight: element.clientHeight,
      clientWidth: element.clientWidth,
      event,
    });
  }

  function handleScroll(event: UIEvent<HTMLDivElement>): void {
    onScroll?.(event);

    if (!event.defaultPrevented) {
      emitAction('scroll', event, event.currentTarget);
    }
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>): void {
    onFocus?.(event);

    if (!event.defaultPrevented) {
      emitAction('focus', event, event.currentTarget);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    onBlur?.(event);

    if (!event.defaultPrevented) {
      emitAction('blur', event, event.currentTarget);
    }
  }

  return (
    <div
      className={composedClassName}
      style={composedStyle}
      role={role ?? 'region'}
      tabIndex={tabIndex ?? 0}
      aria-label={resolvedAriaLabel}
      aria-labelledby={ariaLabelledBy}
      onScroll={handleScroll}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </div>
  );
}
