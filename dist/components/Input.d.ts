import { InputHTMLAttributes } from 'react';

type InputSize = 'xs' | 'sm' | 'md' | 'lg';
type InputActionSource = 'focus' | 'blur' | 'change' | 'click';
interface InputActionContext {
    source: InputActionSource;
    value: string;
    inputType: string;
    disabled: boolean;
    required: boolean;
    invalid: boolean;
    event?: unknown;
}
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: InputSize;
    invalid?: boolean;
    onAction?: (context: InputActionContext) => void;
}
declare function Input({ size, type, disabled, required, invalid, className, style, onFocus, onBlur, onChange, onClick, onAction, ...props }: InputProps): JSX.Element;

export { Input, type InputActionContext, type InputActionSource, type InputProps, type InputSize };
