import { HTMLAttributes, MouseEvent } from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    varient?: BadgeVariant;
    size?: BadgeSize;
    onAction?: (event: MouseEvent<HTMLSpanElement>) => void;
}
declare function Badge({ children, variant, varient, size, onAction, className, style, onClick, onKeyDown, role, tabIndex, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }: BadgeProps): JSX.Element;

export { Badge, type BadgeProps, type BadgeSize, type BadgeVariant };
