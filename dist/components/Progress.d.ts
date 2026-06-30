import { HTMLAttributes, ReactNode } from 'react';

type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';
type ProgressActionSource = 'value-change';
interface ProgressActionContext {
    source: ProgressActionSource;
    value: number;
    min: number;
    max: number;
    percentage: number;
    previousValue?: number;
}
interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue'> {
    value?: number;
    min?: number;
    max?: number;
    size?: ProgressSize;
    children?: ReactNode;
    formatAriaValue?: (value: number, percentage: number) => string;
    onAction?: (context: ProgressActionContext) => void;
}
interface ProgressLabelProps extends HTMLAttributes<HTMLSpanElement> {
}
interface ProgressValueProps extends HTMLAttributes<HTMLSpanElement> {
    formatter?: (value: number, percentage: number) => ReactNode;
}
declare function Progress({ value, min, max, size, children, formatAriaValue, onAction, className, style, ['aria-label']: ariaLabel, ['aria-labelledby']: ariaLabelledBy, ['aria-describedby']: ariaDescribedBy, ...props }: ProgressProps): JSX.Element;
declare function ProgressLabel({ children, className, style, ...props }: ProgressLabelProps): JSX.Element;
declare function ProgressValue({ formatter, className, style, ...props }: ProgressValueProps): JSX.Element;

export { Progress, type ProgressActionContext, type ProgressActionSource, ProgressLabel, type ProgressLabelProps, type ProgressProps, type ProgressSize, ProgressValue, type ProgressValueProps };
