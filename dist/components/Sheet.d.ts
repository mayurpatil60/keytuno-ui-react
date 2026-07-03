import { HTMLAttributes, ReactNode } from 'react';

type SheetSide = "top" | "bottom" | "left" | "right";
type SheetActionSource = "trigger" | "overlay" | "escape" | "close-button" | "open-change";
interface SheetActionContext {
    source: SheetActionSource;
    open: boolean;
    side: SheetSide;
    disabled: boolean;
    event?: unknown;
}
interface SheetProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onAction?: (context: SheetActionContext) => void;
    trigger?: ReactNode;
    side?: SheetSide;
    showCloseButton?: boolean;
    closeButtonLabel?: string;
    disabled?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
}
interface SheetContentProps extends HTMLAttributes<HTMLDivElement> {
    side?: SheetSide;
    showCloseButton?: boolean;
    closeButtonLabel?: string;
    scrollable?: boolean;
    maxContentHeight?: string;
}
interface SheetHeaderProps extends HTMLAttributes<HTMLDivElement> {
}
interface SheetTitleProps extends HTMLAttributes<HTMLHeadingElement> {
}
interface SheetDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
}
interface SheetFooterProps extends HTMLAttributes<HTMLDivElement> {
    sticky?: boolean;
}
declare function Sheet({ children, open, defaultOpen, onOpenChange, onAction, trigger, side, showCloseButton, closeButtonLabel, disabled, closeOnOverlayClick, closeOnEscape, className, style, ...props }: SheetProps): JSX.Element;
declare function SheetContent({ children, side, showCloseButton, closeButtonLabel, scrollable, maxContentHeight, className, style, ...props }: SheetContentProps): JSX.Element;
declare function SheetHeader({ children, className, style, ...props }: SheetHeaderProps): JSX.Element;
declare function SheetTitle({ children, className, style, id, ...props }: SheetTitleProps): JSX.Element;
declare function SheetDescription({ children, className, style, id, ...props }: SheetDescriptionProps): JSX.Element;
declare function SheetFooter({ children, sticky, className, style, ...props }: SheetFooterProps): JSX.Element;

export { Sheet, type SheetActionContext, type SheetActionSource, SheetContent, type SheetContentProps, SheetDescription, type SheetDescriptionProps, SheetFooter, type SheetFooterProps, SheetHeader, type SheetHeaderProps, type SheetProps, type SheetSide, SheetTitle, type SheetTitleProps };
