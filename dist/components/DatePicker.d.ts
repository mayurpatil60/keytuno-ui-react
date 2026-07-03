import { HTMLAttributes } from 'react';

type DatePickerVariant = "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
type DatePickerSize = "xs" | "sm" | "md" | "lg";
type DatePickerMode = "date" | "range" | "time";
type DatePickerActionSource = "open" | "close" | "clear" | "input-change" | "input-commit" | "date-select" | "time-select" | "month-shift" | "month-set" | "year-set";
interface DatePickerActionContext {
    source: DatePickerActionSource;
    mode: DatePickerMode;
    value: DatePickerValue;
    inputText: string;
    open: boolean;
    required: boolean;
}
interface DateRangeValue {
    start: string | null;
    end: string | null;
}
type DatePickerValue = string | DateRangeValue | null;
interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
    mode?: DatePickerMode;
    variant?: DatePickerVariant;
    size?: DatePickerSize;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    placeholder?: string;
    datePlaceholder?: string;
    rangePlaceholder?: string;
    timePlaceholder?: string;
    rangeSeparator?: string;
    inputAriaLabel?: string;
    panelAriaLabel?: string;
    clearLabel?: string;
    openPickerLabel?: string;
    closePickerLabel?: string;
    rangeFromLabel?: string;
    rangeToLabel?: string;
    rangeStartEmptyText?: string;
    rangeEndEmptyText?: string;
    timePanelTitle?: string;
    timeOptionAriaFormatter?: (time12Hour: string, time24Hour: string) => string;
    value?: DatePickerValue;
    defaultValue?: DatePickerValue;
    onValueChange?: (value: DatePickerValue) => void;
    onAction?: (context: DatePickerActionContext) => void;
}
declare function DatePicker({ mode, variant, size, disabled, required, invalid, placeholder, datePlaceholder, rangePlaceholder, timePlaceholder, rangeSeparator, inputAriaLabel, panelAriaLabel, clearLabel, openPickerLabel, closePickerLabel, rangeFromLabel, rangeToLabel, rangeStartEmptyText, rangeEndEmptyText, timePanelTitle, timeOptionAriaFormatter, value, defaultValue, onValueChange, onAction, className, style, id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, ...props }: DatePickerProps): JSX.Element;

export { DatePicker, type DatePickerActionContext, type DatePickerActionSource, type DatePickerMode, type DatePickerProps, type DatePickerSize, type DatePickerValue, type DatePickerVariant, type DateRangeValue };
