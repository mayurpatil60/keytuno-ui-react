import { HTMLAttributes, ReactNode } from 'react';

type SelectSize = "xs" | "sm" | "md" | "lg";
type SelectVariant = "inline" | "overlay";
type SelectValue = string | string[] | null;
type SelectActionSource = "open" | "close" | "search" | "select" | "clear";
interface SelectActionContext {
    source: SelectActionSource;
    value: SelectValue;
    previousValue?: SelectValue;
    multiple: boolean;
    open: boolean;
    query: string;
    required: boolean;
    optionValue?: string;
    event?: unknown;
}
interface SelectOption {
    value: string;
    label: string;
    description?: string;
    keywords?: string[];
    disabled?: boolean;
}
interface SelectGroup {
    label: string;
    options: SelectOption[];
}
interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
    size?: SelectSize;
    variant?: SelectVariant;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    multiple?: boolean;
    showClear?: boolean;
    clearLabel?: string;
    openOptionsLabel?: string;
    closeOptionsLabel?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    options?: SelectOption[];
    groups?: SelectGroup[];
    value?: SelectValue;
    defaultValue?: SelectValue;
    onValueChange?: (value: SelectValue) => void;
    onAction?: (context: SelectActionContext) => void;
    renderItem?: (option: SelectOption, state: {
        selected: boolean;
    }) => ReactNode;
}
declare function Select({ size, variant, disabled, required, invalid, multiple, showClear, clearLabel, openOptionsLabel, closeOptionsLabel, placeholder, searchPlaceholder, emptyText, options, groups, value, defaultValue, onValueChange, onAction, renderItem, className, style, ["aria-label"]: ariaLabel, ["aria-labelledby"]: ariaLabelledBy, ["aria-describedby"]: ariaDescribedBy, ...props }: SelectProps): JSX.Element;

export { Select, type SelectActionContext, type SelectActionSource, type SelectGroup, type SelectOption, type SelectProps, type SelectSize, type SelectValue, type SelectVariant };
