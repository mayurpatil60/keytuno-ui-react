import { InputHTMLAttributes, ReactNode } from 'react';

type SwitchOrientation = 'horizontal' | 'vertical';
type SwitchSize = 'xs' | 'sm' | 'md' | 'lg';
type SwitchActionSource = 'checked-change' | 'focus' | 'blur';
interface SwitchActionContext {
    source: SwitchActionSource;
    checked: boolean;
    previousChecked?: boolean;
    orientation: SwitchOrientation;
    size: SwitchSize;
    disabled: boolean;
    invalid: boolean;
    event?: unknown;
}
interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    orientation?: SwitchOrientation;
    size?: SwitchSize;
    invalid?: boolean;
    description?: ReactNode;
    children?: ReactNode;
    onCheckedChange?: (checked: boolean) => void;
    onAction?: (context: SwitchActionContext) => void;
}
declare function Switch({ orientation, size, invalid, description, children, checked, defaultChecked, disabled, onChange, onFocus, onBlur, onCheckedChange, onAction, className, style, ['aria-describedby']: ariaDescribedBy, ...props }: SwitchProps): JSX.Element;

export { Switch, type SwitchActionContext, type SwitchActionSource, type SwitchOrientation, type SwitchProps, type SwitchSize };
