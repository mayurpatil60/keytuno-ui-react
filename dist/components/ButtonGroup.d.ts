import { HTMLAttributes, ReactNode, MouseEvent } from 'react';
import { ButtonProps } from './Button.js';
import './Tooltip.js';

type ButtonGroupOrientation = 'horizontal' | 'vertical';
type ButtonGroupSize = NonNullable<ButtonProps['size']>;
type ButtonGroupVariant = NonNullable<ButtonProps['variant']>;
interface ButtonGroupActionContext {
    index: number;
    total: number;
    event: MouseEvent<HTMLButtonElement>;
}
interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children: ReactNode;
    orientation?: ButtonGroupOrientation;
    size?: ButtonGroupSize;
    variant?: ButtonGroupVariant;
    compact?: ButtonProps['compact'];
    disabled?: ButtonProps['disabled'];
    onAction?: (context: ButtonGroupActionContext) => void;
}
declare function ButtonGroup({ children, orientation, size, variant, compact, disabled, onAction, className, style, role, onKeyDown, ...props }: ButtonGroupProps): JSX.Element;

export { ButtonGroup, type ButtonGroupActionContext, type ButtonGroupOrientation, type ButtonGroupProps, type ButtonGroupSize, type ButtonGroupVariant };
