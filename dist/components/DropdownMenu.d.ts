import { HTMLAttributes, ReactNode } from 'react';

type DropdownMenuVariant = "default" | "outline" | "soft";
type DropdownMenuSize = "xs" | "sm" | "md" | "lg";
type DropdownMenuSide = "auto" | "bottom" | "top" | "left" | "right";
type DropdownMenuItemLayout = "block" | "inline";
type DropdownMenuActionSource = "trigger" | "outside-click" | "escape" | "item-select" | "open-change";
interface DropdownMenuActionContext {
    source: DropdownMenuActionSource;
    open: boolean;
    itemText?: string;
    checked?: boolean;
    event?: unknown;
}
interface DropdownMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onAction?: (context: DropdownMenuActionContext) => void;
    size?: DropdownMenuSize;
    variant?: DropdownMenuVariant;
    varient?: DropdownMenuVariant;
    side?: DropdownMenuSide;
    itemLayout?: DropdownMenuItemLayout;
    closeOnSelect?: boolean;
    disabled?: boolean;
}
interface DropdownMenuTriggerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    disabled?: boolean;
    asChild?: boolean;
    openLabel?: ReactNode;
    closeLabel?: ReactNode;
}
interface DropdownMenuContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    side?: DropdownMenuSide;
    sideOffset?: number;
    align?: "start" | "center" | "end";
}
interface DropdownMenuGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
}
interface DropdownMenuItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, "children"> {
    children?: ReactNode;
    disabled?: boolean;
    destructive?: boolean;
    inset?: boolean;
    icon?: ReactNode;
    shortcut?: ReactNode;
    checked?: boolean;
    checkIcon?: ReactNode;
    keepOpenOnSelect?: boolean;
    onSelect?: () => void;
    submenu?: ReactNode;
    submenuSide?: DropdownMenuSide;
    submenuOffset?: number;
}
interface DropdownMenuLabelProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    inset?: boolean;
}
interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
}
interface DropdownMenuCheckboxItemProps extends Omit<DropdownMenuItemProps, "checked" | "onSelect" | "keepOpenOnSelect" | "submenu"> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    indicatorIcon?: ReactNode;
    onSelect?: () => void;
}
interface DropdownMenuRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
}
interface DropdownMenuRadioItemProps extends Omit<DropdownMenuItemProps, "checked" | "submenu"> {
    value: string;
    indicatorIcon?: ReactNode;
}
declare function DropdownMenu({ children, open, defaultOpen, onOpenChange, onAction, size, variant, varient, side, itemLayout, closeOnSelect, disabled, className, style, ...props }: DropdownMenuProps): JSX.Element;
declare function DropdownMenuTrigger({ children, disabled, asChild, openLabel, closeLabel, className, style, ...props }: DropdownMenuTriggerProps): JSX.Element;
declare function DropdownMenuContent({ children, side, sideOffset, align, className, style, ...props }: DropdownMenuContentProps): JSX.Element | null;
declare function DropdownMenuGroup({ children, className, style, ...props }: DropdownMenuGroupProps): JSX.Element;
declare function DropdownMenuLabel({ children, inset, className, style, ...props }: DropdownMenuLabelProps): JSX.Element;
declare function DropdownMenuSeparator({ className, style, ...props }: DropdownMenuSeparatorProps): JSX.Element;
declare function DropdownMenuItem({ children, disabled, destructive, inset, icon, shortcut, checked, checkIcon, keepOpenOnSelect, onSelect, submenu, submenuSide, submenuOffset, className, style, ...props }: DropdownMenuItemProps): JSX.Element;
declare function DropdownMenuCheckboxItem({ checked, onCheckedChange, indicatorIcon, onSelect, ...props }: DropdownMenuCheckboxItemProps): JSX.Element;
declare function DropdownMenuRadioGroup({ children, value, defaultValue, onValueChange, className, style, ...props }: DropdownMenuRadioGroupProps): JSX.Element;
declare function DropdownMenuRadioItem({ value, indicatorIcon, onSelect, ...props }: DropdownMenuRadioItemProps): JSX.Element;

export { DropdownMenu, type DropdownMenuActionContext, type DropdownMenuActionSource, DropdownMenuCheckboxItem, type DropdownMenuCheckboxItemProps, DropdownMenuContent, type DropdownMenuContentProps, DropdownMenuGroup, type DropdownMenuGroupProps, DropdownMenuItem, type DropdownMenuItemLayout, type DropdownMenuItemProps, DropdownMenuLabel, type DropdownMenuLabelProps, type DropdownMenuProps, DropdownMenuRadioGroup, type DropdownMenuRadioGroupProps, DropdownMenuRadioItem, type DropdownMenuRadioItemProps, DropdownMenuSeparator, type DropdownMenuSeparatorProps, type DropdownMenuSide, type DropdownMenuSize, DropdownMenuTrigger, type DropdownMenuTriggerProps, type DropdownMenuVariant };
