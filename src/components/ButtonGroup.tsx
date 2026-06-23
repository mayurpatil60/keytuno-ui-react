import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import type { ButtonProps } from './Button';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupSize = NonNullable<ButtonProps['size']>;
export type ButtonGroupVariant = NonNullable<ButtonProps['variant']>;

export interface ButtonGroupActionContext {
  index: number;
  total: number;
  event: ReactMouseEvent<HTMLButtonElement>;
}

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  orientation?: ButtonGroupOrientation;
  size?: ButtonGroupSize;
  variant?: ButtonGroupVariant;
  compact?: ButtonProps['compact'];
  disabled?: ButtonProps['disabled'];
  onAction?: (context: ButtonGroupActionContext) => void;
}

type ButtonGroupChildProps = {
  size?: ButtonGroupSize;
  variant?: ButtonGroupVariant;
  compact?: ButtonProps['compact'];
  disabled?: ButtonProps['disabled'];
  onAction?: ButtonProps['onAction'];
  style?: CSSProperties;
};

function getFocusableButtons(container: HTMLDivElement | null): HTMLButtonElement[] {
  if (container == null) {
    return [];
  }

  return Array.from(container.querySelectorAll('button:not(:disabled)'));
}

function getJoinedSegmentStyle(
  index: number,
  total: number,
  orientation: ButtonGroupOrientation,
  compact?: boolean,
): CSSProperties {
  if (total <= 1) {
    return {};
  }

  if (compact) {
    return orientation === 'vertical'
      ? {
          marginBlockStart: index === 0 ? undefined : '0.12rem',
        }
      : {
          marginInlineStart: index === 0 ? undefined : '0.12rem',
        };
  }

  const isFirst = index === 0;
  const isLast = index === total - 1;

  if (orientation === 'vertical') {
    if (isFirst) {
      return {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      };
    }

    if (isLast) {
      return {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        marginBlockStart: '-1px',
      };
    }

    return {
      borderRadius: 0,
      marginBlockStart: '-1px',
    };
  }

  if (isFirst) {
    return {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    };
  }

  if (isLast) {
    return {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      marginInlineStart: '-1px',
    };
  }

  return {
    borderRadius: 0,
    marginInlineStart: '-1px',
  };
}

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  size = 'md',
  variant,
  compact,
  disabled,
  onAction,
  className = '',
  style,
  role,
  onKeyDown,
  ...props
}: ButtonGroupProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const childList = Children.toArray(children);
  const segmentCount = childList.reduce<number>(
    (count, child) => (isValidElement(child) ? count + 1 : count),
    0,
  );

  let segmentIndex = 0;

  const childrenWithJoinedStyles = childList.map((child) => {
    if (!isValidElement(child)) {
      return child;
    }

    const childElement = child as ReactElement<ButtonGroupChildProps>;
    const actionIndex = segmentIndex;
    const resolvedSize = childElement.props.size ?? size;
    const resolvedVariant = childElement.props.variant ?? variant;
    const resolvedCompact = childElement.props.compact ?? compact;
    const joinedStyle = getJoinedSegmentStyle(
      segmentIndex,
      segmentCount,
      orientation,
      resolvedCompact,
    );
    const resolvedDisabled = childElement.props.disabled ?? disabled;
    const resolvedStyle: CSSProperties = {
      ...(childElement.props.style ?? {}),
      ...joinedStyle,
    };
    const childOnAction = childElement.props.onAction;
    const resolvedOnAction =
      childOnAction == null && onAction == null
        ? undefined
        : (event: ReactMouseEvent<HTMLButtonElement>) => {
            childOnAction?.(event);
            onAction?.({
              index: actionIndex,
              total: segmentCount,
              event,
            });
          };

    segmentIndex += 1;

    return cloneElement(childElement, {
      size: resolvedSize,
      variant: resolvedVariant,
      compact: resolvedCompact,
      disabled: resolvedDisabled,
      onAction: resolvedOnAction,
      style: resolvedStyle,
    });
  });

  function handleContainerKeyDown(event: ReactKeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const focusableButtons = getFocusableButtons(containerRef.current);

    if (focusableButtons.length === 0) {
      return;
    }

    const activeElement = document.activeElement;
    const currentIndex = focusableButtons.findIndex((button) => button === activeElement);

    if (event.key === 'Home') {
      event.preventDefault();
      focusableButtons[0]?.focus();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusableButtons[focusableButtons.length - 1]?.focus();
      return;
    }

    const previousKey =
      orientation === 'vertical' ? event.key === 'ArrowUp' : event.key === 'ArrowLeft';
    const nextKey =
      orientation === 'vertical' ? event.key === 'ArrowDown' : event.key === 'ArrowRight';

    if (!previousKey && !nextKey) {
      return;
    }

    event.preventDefault();

    if (currentIndex < 0) {
      focusableButtons[0]?.focus();
      return;
    }

    const direction = nextKey ? 1 : -1;
    const nextIndex =
      (currentIndex + direction + focusableButtons.length) % focusableButtons.length;
    focusableButtons[nextIndex]?.focus();
  }

  const resolvedRole = role ?? 'group';
  const ariaOrientation = resolvedRole === 'toolbar' ? orientation : undefined;

  const composedStyle: CSSProperties = {
    display: 'inline-flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    alignItems: 'stretch',
    isolation: 'isolate',
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={className.trim() === '' ? undefined : className}
      role={resolvedRole}
      aria-orientation={ariaOrientation}
      aria-disabled={disabled === true ? true : undefined}
      data-orientation={orientation}
      style={composedStyle}
      onKeyDown={handleContainerKeyDown}
      {...props}
    >
      {childrenWithJoinedStyles}
    </div>
  );
}
