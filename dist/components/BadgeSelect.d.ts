import { CSSProperties, ReactNode } from 'react';
import { BadgeProps } from './Badge.js';

type BadgeSelectDropdownVariant = "inline" | "overlay";
type BadgeSelectSide = "auto" | "left" | "top" | "bottom" | "right";
type BadgeSelectValue = string | string[] | null;
type BadgeSelectActionSource = "open" | "close" | "select";
type FixedBadgeSelectSide = Exclude<BadgeSelectSide, "auto">;
interface BadgeSelectActionContext {
    source: BadgeSelectActionSource;
    value: BadgeSelectValue;
    previousValue?: BadgeSelectValue;
    multiple: boolean;
    open: boolean;
    required: boolean;
    requestedSide: BadgeSelectSide;
    resolvedSide: FixedBadgeSelectSide;
    optionValue?: string;
    event?: unknown;
}
interface BadgeSelectOption {
    value: string;
    label: string;
    description?: string;
    keywords?: string[];
    disabled?: boolean;
}
interface BadgeSelectGroup {
    label: string;
    options: BadgeSelectOption[];
}
interface BadgeSelectProps extends Omit<BadgeProps, "value" | "defaultValue" | "onChange"> {
    dropdownVariant?: BadgeSelectDropdownVariant;
    side?: BadgeSelectSide;
    sideOffset?: number;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    multiple?: boolean;
    showSelectedValue?: boolean;
    openOptionsLabel?: string;
    closeOptionsLabel?: string;
    placeholder?: string;
    emptyText?: string;
    options?: BadgeSelectOption[];
    groups?: BadgeSelectGroup[];
    value?: BadgeSelectValue;
    defaultValue?: BadgeSelectValue;
    panelMaxHeight?: CSSProperties["maxHeight"];
    panelStyle?: CSSProperties;
    containerClassName?: string;
    containerStyle?: CSSProperties;
    onValueChange?: (value: BadgeSelectValue) => void;
    onSelectAction?: (context: BadgeSelectActionContext) => void;
    renderItem?: (option: BadgeSelectOption, state: {
        selected: boolean;
    }) => ReactNode;
}
declare function BadgeSelect({ dropdownVariant, side, sideOffset, disabled, required, invalid, multiple, showSelectedValue, openOptionsLabel, closeOptionsLabel, placeholder, emptyText, options, groups, value, defaultValue, panelMaxHeight, panelStyle, containerClassName, containerStyle, onValueChange, onSelectAction, renderItem, children, variant, size, onAction, onClick, onKeyDown, tabIndex, className, style, ...badgeProps }: BadgeSelectProps): JSX.Element;

export { BadgeSelect, type BadgeSelectActionContext, type BadgeSelectActionSource, type BadgeSelectDropdownVariant, type BadgeSelectGroup, type BadgeSelectOption, type BadgeSelectProps, type BadgeSelectSide, type BadgeSelectValue };
