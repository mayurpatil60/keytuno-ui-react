import { HTMLAttributes, ReactNode } from 'react';

type RadioOrientation = 'horizontal' | 'vertical';
type RadioSize = 'xs' | 'sm' | 'md' | 'lg';
type RadioAlign = 'inline-start' | 'inline-end';
type RadioActionSource = 'value-change' | 'focus' | 'blur';
interface RadioActionContext {
    source: RadioActionSource;
    value: string | null;
    previousValue?: string | null;
    optionValue?: string;
    name: string;
    disabled: boolean;
    required: boolean;
    invalid: boolean;
    event?: unknown;
}
interface RadioOption {
    value: string;
    label: ReactNode;
    description?: ReactNode;
    disabled?: boolean;
}
interface RadioProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
    options?: RadioOption[];
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string) => void;
    onAction?: (context: RadioActionContext) => void;
    name?: string;
    orientation?: RadioOrientation;
    size?: RadioSize;
    align?: RadioAlign;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    choiceCard?: boolean;
}
declare function Radio({ options, value, defaultValue, onValueChange, onAction, name, orientation, size, align, disabled, required, invalid, choiceCard, className, style, ...props }: RadioProps): JSX.Element;

export { Radio, type RadioActionContext, type RadioActionSource, type RadioAlign, type RadioOption, type RadioOrientation, type RadioProps, type RadioSize };
