import { HTMLAttributes, ReactNode } from 'react';

type TooltipSize = 'xs' | 'sm' | 'md' | 'lg';
type TooltipSide = 'left' | 'top' | 'bottom' | 'right' | 'auto';
type TooltipActionSource = 'open' | 'close' | 'focus' | 'blur' | 'mouse-enter' | 'mouse-leave' | 'escape';
interface TooltipActionContext {
    source: TooltipActionSource;
    open: boolean;
    size: TooltipSize;
    side: FixedTooltipSide;
    requestedSide: TooltipSide;
    disabled: boolean;
    hasLabel: boolean;
    event?: unknown;
}
interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'title'> {
    children: ReactNode;
    label: ReactNode;
    size?: TooltipSize;
    side?: TooltipSide;
    disabled?: boolean;
    openDelay?: number;
    closeDelay?: number;
    onAction?: (context: TooltipActionContext) => void;
}
type FixedTooltipSide = Exclude<TooltipSide, 'auto'>;
declare function Tooltip({ children, label, size, side, disabled, openDelay, closeDelay, onAction, className, style, onMouseEnter, onMouseLeave, onFocus, onBlur, onKeyDown, ...props }: TooltipProps): JSX.Element;

export { Tooltip, type TooltipActionContext, type TooltipActionSource, type TooltipProps, type TooltipSide, type TooltipSize };
