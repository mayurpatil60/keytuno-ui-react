import { HTMLAttributes, TextareaHTMLAttributes } from 'react';
import { ButtonProps } from './Button.js';
import { InputProps } from './Input.js';
import './Tooltip.js';

type InputGroupVariant = "primary" | "secondary" | "success" | "warning" | "accent" | "destructive" | "outline" | "ghost" | "link";
type InputGroupSize = "xs" | "sm" | "md" | "lg";
type InputGroupAlign = "inline-start" | "inline-end" | "block-start" | "block-end";
type InputGroupActionSource = "focus-within" | "blur-within" | "control-change" | "button-action";
interface InputGroupActionContext {
    source: InputGroupActionSource;
    variant: InputGroupVariant;
    size: InputGroupSize;
    align: InputGroupAlign;
    disabled: boolean;
    required: boolean;
    value?: string;
    event?: unknown;
}
interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
    variant?: InputGroupVariant;
    size?: InputGroupSize;
    align?: InputGroupAlign;
    disabled?: boolean;
    required?: boolean;
    onAction?: (context: InputGroupActionContext) => void;
}
interface InputGroupAddonProps extends HTMLAttributes<HTMLDivElement> {
    align?: InputGroupAlign;
}
interface InputGroupButtonProps extends Omit<ButtonProps, "size" | "variant" | "disabled"> {
    variant?: InputGroupVariant;
    size?: InputGroupSize;
    disabled?: boolean;
}
interface InputGroupInputProps extends Omit<InputProps, "size" | "disabled" | "required"> {
    size?: InputGroupSize;
    disabled?: boolean;
    required?: boolean;
}
interface InputGroupTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "disabled" | "required"> {
    size?: InputGroupSize;
    disabled?: boolean;
    required?: boolean;
}
declare function InputGroup({ children, variant, size, align, disabled, required, onAction, className, style, ...props }: InputGroupProps): JSX.Element;
declare function InputGroupAddon({ children, align, className, style, ...props }: InputGroupAddonProps): JSX.Element;
declare function InputGroupButton({ children, variant, size, disabled, onAction, style, ...props }: InputGroupButtonProps): JSX.Element;
declare function InputGroupInput({ size, disabled, required, onFocus, onBlur, onChange, style, ...props }: InputGroupInputProps): JSX.Element;
declare function InputGroupTextarea({ size, disabled, required, rows, onFocus, onBlur, onChange, className, style, ...props }: InputGroupTextareaProps): JSX.Element;

export { InputGroup, type InputGroupActionContext, type InputGroupActionSource, InputGroupAddon, type InputGroupAddonProps, type InputGroupAlign, InputGroupButton, type InputGroupButtonProps, InputGroupInput, type InputGroupInputProps, type InputGroupProps, type InputGroupSize, InputGroupTextarea, type InputGroupTextareaProps, type InputGroupVariant };
