import { ButtonHTMLAttributes, CSSProperties, MouseEvent } from 'react';
import { TooltipProps, TooltipSide, TooltipSize } from './Tooltip.js';

type ButtonVariantValue = 'primary' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
type ButtonSizeValue = 'xs' | 'sm' | 'md' | 'lg';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariantValue;
    size?: ButtonSizeValue;
    compact?: boolean;
    iconOnly?: boolean;
    iconOnlyTone?: boolean;
    iconColor?: CSSProperties['color'];
    onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
    tooltip?: TooltipProps['label'];
    tooltipSide?: TooltipSide;
    tooltipSize?: TooltipSize;
    tooltipDisabled?: boolean;
    tooltipOpenDelay?: number;
    tooltipCloseDelay?: number;
}
type ButtonSharedProps = Pick<ButtonProps, 'variant' | 'size' | 'compact' | 'disabled'>;
declare function Button({ children, variant, size, compact, iconOnly, iconOnlyTone, iconColor, onAction, tooltip, tooltipSide, tooltipSize, tooltipDisabled, tooltipOpenDelay, tooltipCloseDelay, className, style, type, disabled, onClick, onMouseEnter, onMouseLeave, 'aria-label': ariaLabel, ...props }: ButtonProps): JSX.Element;

export { Button, type ButtonProps, type ButtonSharedProps };
