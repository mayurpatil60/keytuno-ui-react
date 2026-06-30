import { TextareaHTMLAttributes } from 'react';

type TextareaSize = "xs" | "sm" | "md" | "lg";
type TextareaActionSource = "change" | "focus" | "blur";
interface TextareaActionContext {
    source: TextareaActionSource;
    value: string;
    size: TextareaSize;
    disabled: boolean;
    required: boolean;
    invalid: boolean;
    event?: unknown;
}
interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
    size?: TextareaSize;
    invalid?: boolean;
    onAction?: (context: TextareaActionContext) => void;
}
declare function Textarea({ size, disabled, required, invalid, rows, className, style, onChange, onFocus, onBlur, onAction, ...props }: TextareaProps): JSX.Element;

export { Textarea, type TextareaActionContext, type TextareaActionSource, type TextareaProps, type TextareaSize };
