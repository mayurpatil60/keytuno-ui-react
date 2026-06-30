import { HTMLAttributes, ReactNode } from 'react';

type ColorPickerSize = "xs" | "sm" | "md" | "lg";
type ColorPickerVariant = "compact" | "detailed";
type ColorPickerActionSource = "picker-change" | "hex-input" | "swatch-select" | "clear" | "focus" | "blur";
interface ColorPickerActionContext {
    source: ColorPickerActionSource;
    value: string | null;
    previousValue?: string | null;
    variant: ColorPickerVariant;
    size: ColorPickerSize;
    disabled: boolean;
    required: boolean;
    invalid: boolean;
    swatch?: string;
    event?: unknown;
}
interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
    size?: ColorPickerSize;
    variant?: ColorPickerVariant;
    varient?: ColorPickerVariant;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    showClear?: boolean;
    showSwatches?: boolean;
    placeholder?: string;
    colorInputAriaLabel?: string;
    hexInputAriaLabel?: string;
    emptyValueLabel?: ReactNode;
    clearButtonLabel?: ReactNode;
    clearButtonAriaLabel?: string;
    chooseColorAriaFormatter?: (hexColor: string) => string;
    swatches?: string[];
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    onAction?: (context: ColorPickerActionContext) => void;
}
declare function ColorPicker({ size, variant, varient, disabled, required, invalid, showClear, showSwatches, placeholder, colorInputAriaLabel, hexInputAriaLabel, emptyValueLabel, clearButtonLabel, clearButtonAriaLabel, chooseColorAriaFormatter, swatches, value, defaultValue, onValueChange, onAction, className, style, role, id, ["aria-label"]: ariaLabel, ["aria-labelledby"]: ariaLabelledBy, ["aria-describedby"]: ariaDescribedBy, ...props }: ColorPickerProps): JSX.Element;

export { ColorPicker, type ColorPickerActionContext, type ColorPickerActionSource, type ColorPickerProps, type ColorPickerSize, type ColorPickerVariant };
