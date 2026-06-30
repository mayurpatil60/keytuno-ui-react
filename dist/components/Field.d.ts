import { HTMLAttributes, LabelHTMLAttributes } from 'react';

type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';
type FieldActionSource = 'focus-within' | 'blur-within' | 'label-click' | 'field-click';
interface FieldActionContext {
    source: FieldActionSource;
    orientation: FieldOrientation;
    disabled: boolean;
    invalid: boolean;
    required: boolean;
    event?: unknown;
}
interface FieldProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: FieldOrientation;
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
    onAction?: (context: FieldActionContext) => void;
}
interface FieldGroupProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: FieldOrientation;
}
interface FieldContentProps extends HTMLAttributes<HTMLDivElement> {
}
interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}
interface FieldTitleProps extends HTMLAttributes<HTMLDivElement> {
}
interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
}
interface FieldSeparatorProps extends HTMLAttributes<HTMLDivElement> {
}
interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
}
declare function FieldGroup({ children, orientation, className, style, ...props }: FieldGroupProps): JSX.Element;
declare function Field({ children, orientation, disabled, invalid, required, onAction, className, style, ...props }: FieldProps): JSX.Element;
declare function FieldContent({ children, className, style, ...props }: FieldContentProps): JSX.Element;
declare function FieldLabel({ children, required, className, style, ...props }: FieldLabelProps): JSX.Element;
declare function FieldTitle({ children, className, style, ...props }: FieldTitleProps): JSX.Element;
declare function FieldDescription({ children, className, style, ...props }: FieldDescriptionProps): JSX.Element;
declare function FieldSeparator({ className, style, ...props }: FieldSeparatorProps): JSX.Element;
declare function FieldError({ children, className, style, ...props }: FieldErrorProps): JSX.Element;

export { Field, type FieldActionContext, type FieldActionSource, FieldContent, type FieldContentProps, FieldDescription, type FieldDescriptionProps, FieldError, type FieldErrorProps, FieldGroup, type FieldGroupProps, FieldLabel, type FieldLabelProps, type FieldOrientation, type FieldProps, FieldSeparator, type FieldSeparatorProps, FieldTitle, type FieldTitleProps };
