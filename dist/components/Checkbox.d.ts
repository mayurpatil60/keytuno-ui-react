import { InputHTMLAttributes, ReactNode, ChangeEvent } from 'react';

type CheckboxSize = "xs" | "sm" | "md" | "lg";
interface CheckboxActionContext {
    checked: boolean;
    required: boolean;
    event: ChangeEvent<HTMLInputElement>;
}
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
    size?: CheckboxSize;
    invalid?: boolean;
    description?: ReactNode;
    children?: ReactNode;
    onCheckedChange?: (checked: boolean) => void;
    onAction?: (context: CheckboxActionContext) => void;
}
declare function Checkbox({ size, invalid, description, children, required, checked, defaultChecked, disabled, onChange, onFocus, onBlur, onCheckedChange, onAction, className, style, "aria-describedby": ariaDescribedBy, "aria-label": ariaLabel, ...props }: CheckboxProps): JSX.Element;

export { Checkbox, type CheckboxActionContext, type CheckboxProps, type CheckboxSize };
