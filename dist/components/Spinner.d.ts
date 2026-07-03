import { HTMLAttributes } from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
type SpinnerActionSource = 'click' | 'focus' | 'blur';
interface SpinnerActionContext {
    source: SpinnerActionSource;
    size: SpinnerSize;
    decorative: boolean;
    event?: unknown;
}
interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    size?: SpinnerSize;
    decorative?: boolean;
    onAction?: (context: SpinnerActionContext) => void;
}
declare function Spinner({ size, decorative, onAction, className, style, onClick, onFocus, onBlur, role, ['aria-label']: ariaLabel, ['aria-live']: ariaLive, ...props }: SpinnerProps): JSX.Element;

export { Spinner, type SpinnerActionContext, type SpinnerActionSource, type SpinnerProps, type SpinnerSize };
