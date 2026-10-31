import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';

export type AccordionOrientation = 'horizontal' | 'vertical';
export type AccordionSize = 'xs' | 'sm' | 'md' | 'lg';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  actions?: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: AccordionItem[];
  orientation?: AccordionOrientation;
  size?: AccordionSize;
  disabled?: boolean;
  // Whether multiple items can be open at the same time.
  multiple?: boolean;
  defaultOpenItems?: string[];
  onOpenItemsChange?: (openItemIds: string[]) => void;
}

type AccordionSizeTokens = {
  triggerPaddingBlock: string;
  triggerPaddingInline: string;
  triggerFontSize: string;
  contentPaddingBlock: string;
  contentPaddingInline: string;
};

const sizeTokens: Record<AccordionSize, AccordionSizeTokens> = {
  xs: {
    triggerPaddingBlock: '0.4rem',
    triggerPaddingInline: '0.5rem',
    triggerFontSize: '0.75rem',
    contentPaddingBlock: '0.4rem',
    contentPaddingInline: '0.5rem',
  },
  sm: {
    triggerPaddingBlock: '0.5rem',
    triggerPaddingInline: '0.625rem',
    triggerFontSize: '0.8125rem',
    contentPaddingBlock: '0.5rem',
    contentPaddingInline: '0.625rem',
  },
  md: {
    triggerPaddingBlock: '0.625rem',
    triggerPaddingInline: '0.75rem',
    triggerFontSize: '0.875rem',
    contentPaddingBlock: '0.625rem',
    contentPaddingInline: '0.75rem',
  },
  lg: {
    triggerPaddingBlock: '0.75rem',
    triggerPaddingInline: '0.9rem',
    triggerFontSize: '0.9375rem',
    contentPaddingBlock: '0.75rem',
    contentPaddingInline: '0.9rem',
  },
};

const chevronStyle: CSSProperties = {
  width: '1rem',
  height: '1rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
  flexShrink: 0,
  transition: 'transform 180ms ease',
};

const panelTransitionDurationMs = 220;
const panelFadeDurationMs = 180;

function normalizeDefaultOpenItems(
  defaultOpenItems: string[] | undefined,
  itemIds: Set<string>,
  multiple: boolean,
): string[] {
  const normalized = (defaultOpenItems ?? []).filter((id) => itemIds.has(id));

  if (multiple) {
    return normalized;
  }

  if (normalized.length === 0) {
    return [];
  }

  return [normalized[0]];
}

function areStringArraysEqual(first: string[], second: string[]): boolean {
  if (first.length !== second.length) {
    return false;
  }

  for (let index = 0; index < first.length; index += 1) {
    if (first[index] !== second[index]) {
      return false;
    }
  }

  return true;
}

function getEnabledTriggerIndices(items: AccordionItem[], disabled: boolean): number[] {
  if (disabled) {
    return [];
  }

  return items.reduce<number[]>((indices, item, index) => {
    if (item.disabled !== true) {
      indices.push(index);
    }

    return indices;
  }, []);
}

export function Accordion({
  items,
  orientation = 'vertical',
  size = 'md',
  disabled = false,
  multiple = false,
  defaultOpenItems,
  onOpenItemsChange,
  className = '',
  style,
  ...props
}: AccordionProps): JSX.Element {
  const itemIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);
  const accordionId = useId();
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const onOpenItemsChangeRef = useRef(onOpenItemsChange);

  onOpenItemsChangeRef.current = onOpenItemsChange;

  const [openItemIds, setOpenItemIds] = useState<string[]>(() =>
    normalizeDefaultOpenItems(defaultOpenItems, itemIds, multiple),
  );

  const tokens = sizeTokens[size];

  useEffect(() => {
    setOpenItemIds((current) => {
      const normalized = normalizeDefaultOpenItems(current, itemIds, multiple);

      if (areStringArraysEqual(current, normalized)) {
        return current;
      }

      return normalized;
    });
  }, [itemIds, multiple]);

  useEffect(() => {
    onOpenItemsChangeRef.current?.(openItemIds);
  }, [openItemIds]);

  function toggleItem(itemId: string, itemDisabled: boolean): void {
    if (disabled || itemDisabled) {
      return;
    }

    setOpenItemIds((current) => {
      const isOpen = current.includes(itemId);

      if (multiple) {
        if (isOpen) {
          return current.filter((id) => id !== itemId);
        }

        return [...current, itemId];
      }

      if (isOpen) {
        return [];
      }

      return [itemId];
    });
  }

  function focusTriggerByIndex(index: number): void {
    const triggerElement = triggerRefs.current[index];

    if (triggerElement != null) {
      triggerElement.focus();
    }
  }

  function handleTriggerKeyDown(
    triggerIndex: number,
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ): void {
    if (disabled) {
      return;
    }

    const enabledIndices = getEnabledTriggerIndices(items, disabled);

    if (enabledIndices.length === 0) {
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      const firstEnabledIndex = enabledIndices[0];

      if (firstEnabledIndex != null) {
        focusTriggerByIndex(firstEnabledIndex);
      }

      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      const lastEnabledIndex = enabledIndices[enabledIndices.length - 1];

      if (lastEnabledIndex != null) {
        focusTriggerByIndex(lastEnabledIndex);
      }

      return;
    }

    const isPreviousKey =
      orientation === 'vertical' ? event.key === 'ArrowUp' : event.key === 'ArrowLeft';
    const isNextKey =
      orientation === 'vertical' ? event.key === 'ArrowDown' : event.key === 'ArrowRight';

    if (!isPreviousKey && !isNextKey) {
      return;
    }

    event.preventDefault();

    const currentEnabledPosition = enabledIndices.indexOf(triggerIndex);

    if (currentEnabledPosition < 0) {
      const fallbackIndex = enabledIndices[0];

      if (fallbackIndex != null) {
        focusTriggerByIndex(fallbackIndex);
      }

      return;
    }

    const direction = isNextKey ? 1 : -1;
    const nextEnabledPosition =
      (currentEnabledPosition + direction + enabledIndices.length) % enabledIndices.length;
    const nextEnabledIndex = enabledIndices[nextEnabledPosition];

    if (nextEnabledIndex != null) {
      focusTriggerByIndex(nextEnabledIndex);
    }
  }

  const composedClassName = className.trim() === '' ? undefined : className;

  const containerStyle: CSSProperties = {
    display: orientation === 'horizontal' ? 'grid' : 'flex',
    gridTemplateColumns:
      orientation === 'horizontal'
        ? `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))`
        : undefined,
    flexDirection: orientation === 'vertical' ? 'column' : undefined,
    gap: orientation === 'horizontal' ? '0.625rem' : 0,
    width: '100%',
    ...style,
  };

  return (
    <div
      className={composedClassName}
      style={containerStyle}
      data-orientation={orientation}
      {...props}
    >
      {items.map((item, index) => {
        const isOpen = openItemIds.includes(item.id);
        const itemDisabled = disabled || item.disabled === true;

        const itemStyle: CSSProperties = {
          border: 'none',
          borderInlineEnd:
            orientation === 'horizontal' && index < items.length - 1
              ? '1px solid var(--ktn-border-muted)'
              : undefined,
          backgroundColor: 'var(--ktn-bg-surface, transparent)',
          opacity: itemDisabled ? 0.62 : 1,
        };

        const headerStyle: CSSProperties = {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          borderBottom: '1px solid var(--ktn-border-muted)',
          backgroundColor: isOpen
            ? 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))'
            : 'transparent',
          color: 'var(--ktn-text-primary)',
          paddingBlock: tokens.triggerPaddingBlock,
          paddingInline: tokens.triggerPaddingInline,
          transition: 'background-color 120ms ease, color 120ms ease',
          boxSizing: 'border-box',
        };

        const triggerStyle: CSSProperties = {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          border: 0,
          backgroundColor: 'transparent',
          color: 'var(--ktn-text-primary)',
          fontWeight: 500,
          fontSize: tokens.triggerFontSize,
          textAlign: 'left',
          lineHeight: 1.3,
          padding: 0,
          cursor: itemDisabled ? 'not-allowed' : 'pointer',
        };

        const titleStyle: CSSProperties = {
          minWidth: 0,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        };

        const actionsWrapStyle: CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          flexShrink: 0,
          marginInlineStart: '0.2rem',
          ...(itemDisabled
            ? {
                pointerEvents: 'none',
                opacity: 0.62,
              }
            : {}),
        };

        const panelMotionStyle: CSSProperties = {
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          overflow: 'hidden',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: `grid-template-rows ${panelTransitionDurationMs}ms ease, opacity ${panelFadeDurationMs}ms ease, visibility 0ms linear ${isOpen ? 0 : panelTransitionDurationMs}ms`,
          willChange: 'grid-template-rows, opacity',
        };

        const panelInnerStyle: CSSProperties = {
          minHeight: 0,
        };

        const contentStyle: CSSProperties = {
          paddingBlock: tokens.contentPaddingBlock,
          paddingInline: tokens.contentPaddingInline,
          fontSize: tokens.triggerFontSize,
          color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
          lineHeight: 1.45,
          backgroundColor: 'var(--ktn-bg-surface, transparent)',
        };

        const triggerId = `${accordionId}-trigger-${index}`;
        const contentId = `${accordionId}-content-${index}`;

        return (
          <div key={item.id} style={itemStyle}>
            <div style={headerStyle}>
              <button
                id={triggerId}
                ref={(element) => {
                  triggerRefs.current[index] = element;
                }}
                type="button"
                style={triggerStyle}
                disabled={itemDisabled}
                aria-disabled={itemDisabled}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => {
                  toggleItem(item.id, itemDisabled);
                }}
                onKeyDown={(event) => {
                  handleTriggerKeyDown(index, event);
                }}
              >
                <span style={titleStyle}>{item.title}</span>
                <span
                  aria-hidden
                  style={{
                    ...chevronStyle,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              {item.actions != null ? <div style={actionsWrapStyle}>{item.actions}</div> : null}
            </div>

            <div
              id={contentId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              data-state={isOpen ? 'open' : 'closed'}
              style={panelMotionStyle}
            >
              <div style={panelInnerStyle}>
                <div style={contentStyle}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
