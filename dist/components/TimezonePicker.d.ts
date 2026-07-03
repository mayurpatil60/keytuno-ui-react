import { HTMLAttributes } from 'react';
import { SelectOption } from './Select.js';

type TimezonePickerSize = "xs" | "sm" | "md" | "lg";
type TimezonePickerVariant = "compact" | "detailed";
type TimezonePickerActionSource = "open" | "close" | "search" | "select" | "clear" | "system-select";
interface TimezonePickerActionContext {
    source: TimezonePickerActionSource;
    value: string | null;
    previousValue?: string | null;
    open: boolean;
    query: string;
    required: boolean;
    variant: TimezonePickerVariant;
    includeSystemTimezone: boolean;
    systemTimezone: string | null;
    optionValue?: string;
    event?: unknown;
}
interface TimezonePickerOption extends SelectOption {
    timezone: string;
    offset: string;
    system: boolean;
}
interface TimezonePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
    size?: TimezonePickerSize;
    variant?: TimezonePickerVariant;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    showClear?: boolean;
    includeSystemTimezone?: boolean;
    systemTimezone?: string | null;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    timezones?: string[];
    preferredTimezones?: string[];
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    onAction?: (context: TimezonePickerActionContext) => void;
}
declare function TimezonePicker({ size, variant, disabled, required, invalid, showClear, includeSystemTimezone, systemTimezone, placeholder, searchPlaceholder, emptyText, timezones, preferredTimezones, value, defaultValue, onValueChange, onAction, className, style, ["aria-label"]: ariaLabel, ["aria-labelledby"]: ariaLabelledBy, ["aria-describedby"]: ariaDescribedBy, ...props }: TimezonePickerProps): JSX.Element;

export { TimezonePicker, type TimezonePickerActionContext, type TimezonePickerActionSource, type TimezonePickerOption, type TimezonePickerProps, type TimezonePickerSize, type TimezonePickerVariant };
