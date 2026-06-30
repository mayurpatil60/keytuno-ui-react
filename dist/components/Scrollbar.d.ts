import { HTMLAttributes, ReactNode } from 'react';

type ScrollbarAxis = 'x' | 'y' | 'both';
type ScrollbarActionSource = 'scroll' | 'focus' | 'blur';
interface ScrollbarActionContext {
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
interface ScrollbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: ReactNode;
    axis?: ScrollbarAxis;
    onAction?: (context: ScrollbarActionContext) => void;
}
declare function Scrollbar({ children, axis, onAction, className, style, onScroll, onFocus, onBlur, role, tabIndex, ['aria-label']: ariaLabel, ['aria-labelledby']: ariaLabelledBy, ...props }: ScrollbarProps): JSX.Element;

export { Scrollbar, type ScrollbarActionContext, type ScrollbarActionSource, type ScrollbarAxis, type ScrollbarProps };
